import { Router } from "express";
import prisma from "../lib/prisma";
import { requireAuth, AuthRequest } from "../middleware/auth";

const router = Router();

router.use(requireAuth);

router.get("/", async (req: AuthRequest, res) => {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.userId },
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: "desc" },
    });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

router.post("/", async (req: AuthRequest, res) => {
  try {
    const { paymentIntentId } = req.body;

    const cartItems = await prisma.cartItem.findMany({
      where: { userId: req.userId },
      include: { product: true },
    });

    if (cartItems.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    const total = cartItems.reduce((sum, item) => {
      const price = item.product.salePrice ?? item.product.price;
      return sum + price * item.quantity;
    }, 0);

    // The cart is intentionally left alone here - it's only cleared once
    // the Stripe webhook confirms the payment actually succeeded, so a
    // failed/abandoned payment doesn't silently lose the user's cart.
    const order = await prisma.order.create({
      data: {
        userId: req.userId as string,
        total,
        paymentIntentId: paymentIntentId ?? undefined,
        items: {
          create: cartItems.map((item) => ({
            productId: item.productId,
            size: item.size,
            quantity: item.quantity,
            price: item.product.salePrice ?? item.product.price,
          })),
        },
      },
      include: { items: { include: { product: true } } },
    });

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

export default router;
