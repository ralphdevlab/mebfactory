import { Router } from "express";
import prisma from "../lib/prisma";
import { requireAuth, AuthRequest } from "../middleware/auth";

const router = Router();

router.use(requireAuth);

router.get("/", async (req: AuthRequest, res) => {
  try {
    const items = await prisma.cartItem.findMany({
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
    const { productId, size, quantity } = req.body;

    if (!productId || !size) {
      return res.status(400).json({ error: "productId and size are required" });
    }

    const item = await prisma.cartItem.create({
      data: {
        userId: req.userId as string,
        productId,
        size,
        quantity: quantity ?? 1,
      },
      include: { product: true },
    });

    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

router.patch("/:id", async (req: AuthRequest, res) => {
  try {
    const { quantity } = req.body;

    const existing = await prisma.cartItem.findUnique({ where: { id: String(req.params.id) } });
    if (!existing || existing.userId !== req.userId) {
      return res.status(404).json({ error: "Cart item not found" });
    }

    const item = await prisma.cartItem.update({
      where: { id: String(req.params.id) },
      data: { quantity },
      include: { product: true },
    });

    res.json(item);
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

router.delete("/:id", async (req: AuthRequest, res) => {
  try {
    const existing = await prisma.cartItem.findUnique({ where: { id: String(req.params.id) } });
    if (!existing || existing.userId !== req.userId) {
      return res.status(404).json({ error: "Cart item not found" });
    }

    await prisma.cartItem.delete({ where: { id: String(req.params.id) } });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

router.delete("/", async (req: AuthRequest, res) => {
  try {
    await prisma.cartItem.deleteMany({ where: { userId: req.userId } });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

export default router;
