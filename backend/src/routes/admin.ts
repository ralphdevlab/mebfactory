import { Router } from "express";
import prisma from "../lib/prisma";
import { requireAuth } from "../middleware/auth";
import { requireAdmin } from "../middleware/admin";

const router = Router();

router.use(requireAuth, requireAdmin);

router.get("/stats", async (req, res) => {
  try {
    const [totalOrders, revenue, totalProducts, totalUsers] = await Promise.all([
      prisma.order.count(),
      // "pending" orders haven't actually been paid for yet (Stripe hasn't
      // confirmed them), so they're excluded from revenue.
      prisma.order.aggregate({
        _sum: { total: true },
        where: { status: { not: "pending" } },
      }),
      prisma.product.count(),
      prisma.user.count(),
    ]);

    res.json({
      totalOrders,
      totalRevenue: revenue._sum.total ?? 0,
      totalProducts,
      totalUsers,
    });
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

router.get("/customers", async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        createdAt: true,
        _count: { select: { orders: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

router.get("/products", async (req, res) => {
  try {
    const products = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

router.post("/products", async (req, res) => {
  try {
    const { name, description, price, salePrice, category, sizes, isNew, images } = req.body;

    if (!name || price == null || !category) {
      return res.status(400).json({ error: "name, price, and category are required" });
    }

    const product = await prisma.product.create({
      data: {
        name,
        description: description ?? null,
        price,
        salePrice: salePrice ?? null,
        category,
        sizes: sizes ?? [],
        images: images ?? [],
        isNew: isNew ?? false,
      },
    });

    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

router.patch("/products/:id", async (req, res) => {
  try {
    const { name, description, price, salePrice, category, sizes, isNew, images } = req.body;

    const product = await prisma.product.update({
      where: { id: String(req.params.id) },
      data: { name, description, price, salePrice, category, sizes, isNew, images },
    });

    res.json(product);
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

router.delete("/products/:id", async (req, res) => {
  try {
    await prisma.product.delete({ where: { id: String(req.params.id) } });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

router.get("/orders", async (req, res) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: { include: { product: true } },
        user: { select: { email: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

router.patch("/orders/:id", async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: "status is required" });
    }

    const order = await prisma.order.update({
      where: { id: String(req.params.id) },
      data: { status },
      include: {
        items: { include: { product: true } },
        user: { select: { email: true } },
      },
    });

    res.json(order);
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

export default router;
