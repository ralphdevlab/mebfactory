import { Router } from "express";
import type Stripe from "stripe";
import stripe from "../lib/stripe";
import prisma from "../lib/prisma";
import { sendOrderConfirmation } from "../lib/email";
import { requireAuth, AuthRequest } from "../middleware/auth";

const router = Router();

router.post("/create-intent", requireAuth, async (req: AuthRequest, res) => {
  const userId = req.userId;

  try {
    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: { product: true },
    });

    console.log(`[checkout] create-intent userId=${userId} cartItems=${cartItems.length}`);

    if (cartItems.length === 0) {
      console.log(`[checkout] cart empty for userId=${userId}`);
      return res.status(400).json({ error: "Cart is empty", userId, cartCount: 0 });
    }

    const total = cartItems.reduce((sum, item) => {
      const price = item.product.salePrice ?? item.product.price;
      return sum + price * item.quantity;
    }, 0);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(total * 100),
      currency: "usd",
      metadata: { userId: userId as string },
    });

    res.json({ clientSecret: paymentIntent.client_secret, total });
  } catch (err: any) {
    // Cart lookup succeeded (logged above) but something after it failed -
    // most commonly Stripe rejecting STRIPE_SECRET_KEY. Logging the actual
    // error here (not just a generic 500) is what surfaces that instead of
    // it looking like a cart problem.
    console.error("Stripe error full details:", {
      userId,
      message: err.message,
      type: err.type,
      code: err.code,
      statusCode: err.statusCode,
      raw: err.raw,
    });
    res.status(500).json({
      error: err.message,
      type: err.type,
      code: err.code,
    });
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
