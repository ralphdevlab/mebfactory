import { Router } from "express";
import prisma from "../lib/prisma";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const { category, new: isNew } = req.query;

    const where: Record<string, unknown> = {};
    if (category) where.category = String(category);
    if (isNew === "true") where.isNew = true;

    const products = await prisma.product.findMany({ where, orderBy: { createdAt: "desc" } });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const product = await prisma.product.findUnique({ where: { id: String(req.params.id) } });
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

export default router;
