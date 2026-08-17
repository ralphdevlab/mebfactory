import { Router } from "express";
import type Stripe from "stripe";
import stripe from "../lib/stripe";
import prisma from "../lib/prisma";
import { sendOrderConfirmation } from "../lib/email";
import { requireAuth, AuthRequest } from "../middleware/auth";

const router = Router();

router.post("/create-intent", requireAuth, async (req: AuthRequest, res) => {
  try {
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

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(total * 100),
      currency: "usd",
      metadata: { userId: req.userId as string },
    });

    res.json({ clientSecret: paymentIntent.client_secret, total });
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

// Mounted separately from the router above - it needs the raw request body
// (not the JSON-parsed one the rest of the app uses) to verify the Stripe
// signature, and it's public since Stripe, not a logged-in user, calls it.
export const stripeWebhookRouter = Router();

stripeWebhookRouter.post("/stripe", async (req, res) => {
  const signature = req.headers["stripe-signature"];

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature as string,
      process.env.STRIPE_WEBHOOK_SECRET as string,
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${(err as Error).message}`);
  }

  try {
    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;

      const order = await prisma.order.findUnique({ where: { paymentIntentId: paymentIntent.id } });
      if (!order) {
        // The order may not be created yet if this webhook beat the
        // frontend's POST /api/orders call. Returning a non-2xx makes
        // Stripe retry the webhook automatically until it lands.
        return res.status(404).json({ error: "Order not found for payment intent" });
      }

      const updated = await prisma.order.update({
        where: { id: order.id },
        data: { status: "paid" },
        include: { items: { include: { product: true } }, user: true },
      });

      await sendOrderConfirmation(updated.user.email, updated);
      await prisma.cartItem.deleteMany({ where: { userId: updated.userId } });
    }

    res.json({ received: true });
  } catch (err) {
    res.status(500).json({ error: "Webhook handler failed" });
  }
});

export default router;
