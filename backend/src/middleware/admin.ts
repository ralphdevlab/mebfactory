import { Response, NextFunction } from "express";
import prisma from "../lib/prisma";
import { AuthRequest } from "./auth";

// Lets specific accounts (e.g. a personal test email during development)
// act as admin without needing an @mebfactory.com address.
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? "")
  .split(",")
  .map((e) => e.trim())
  .filter(Boolean);

export async function requireAdmin(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.userId }, select: { email: true } });

    const isAdmin =
      !!user &&
      (user.email.endsWith("@mebfactory.com") ||
        ADMIN_EMAILS.includes(user.email) ||
        user.email === process.env.ADMIN_EMAIL);

    if (!isAdmin) {
      return res.status(403).json({ error: "Forbidden" });
    }

    next();
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
}
