import "dotenv/config";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth";
import productRoutes from "./routes/products";
import cartRoutes from "./routes/cart";
import wishlistRoutes from "./routes/wishlist";
import orderRoutes from "./routes/orders";
import checkoutRoutes, { stripeWebhookRouter } from "./routes/checkout";
import adminRoutes from "./routes/admin";
import uploadRoutes from "./routes/upload";
import themeRoutes, { adminThemesRouter } from "./routes/themes";

const app = express();

app.use(cors());

// Mounted before express.json() with a raw-body parser: Stripe's webhook
// signature verification needs the exact bytes it sent, not the
// already-parsed JSON object the rest of the app works with.
app.use("/api/webhooks", express.raw({ type: "application/json" }), stripeWebhookRouter);

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/checkout", checkoutRoutes);
app.use("/api/themes", themeRoutes);
// More specific /api/admin/* paths mounted before the general /api/admin
// catch-all below, so they're matched directly instead of first falling
// through adminRoutes' own requireAuth/requireAdmin checks unnecessarily.
app.use("/api/admin/upload", uploadRoutes);
app.use("/api/admin/themes", adminThemesRouter);
app.use("/api/admin", adminRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
