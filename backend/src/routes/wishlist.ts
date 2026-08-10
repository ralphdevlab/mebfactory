import { Router } from "express";
import prisma from "../lib/prisma";
import { requireAuth, AuthRequest } from "../middleware/auth";

const router = Router();

router.use(requireAuth);

router.get("/", async (req: AuthRequest, res) => {
  try {
    const items = await prisma.wishlistItem.findMany({
      where: { userId: req.userId },
      include: { product: true },
    });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

router.post("/", async (req: AuthRequest, res) => {
  try {
    const { productId } = req.body;

    if (!productId) {
      return res.status(400).json({ error: "productId is required" });
    }

    const item = await prisma.wishlistItem.create({
      data: { userId: req.userId as string, productId },
      include: { product: true },
    });

    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

router.delete("/:id", async (req: AuthRequest, res) => {
  try {
    const existing = await prisma.wishlistItem.findUnique({ where: { id: String(req.params.id) } });
    if (!existing || existing.userId !== req.userId) {
      return res.status(404).json({ error: "Wishlist item not found" });
    }

    await prisma.wishlistItem.delete({ where: { id: String(req.params.id) } });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

export default router;
