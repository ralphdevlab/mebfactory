import { Router } from "express";
import prisma from "../lib/prisma";
import { requireAuth } from "../middleware/auth";
import { requireAdmin } from "../middleware/admin";

const router = Router();

router.get("/active", async (req, res) => {
  try {
    const theme = await prisma.siteTheme.findFirst({ where: { isActive: true } });
    res.json(theme);
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

// Mounted separately (at /api/admin/themes) from the public router above
// (at /api/themes) - management routes need an admin, "which theme is
// currently live" doesn't.
export const adminThemesRouter = Router();

adminThemesRouter.use(requireAuth, requireAdmin);

adminThemesRouter.get("/", async (req, res) => {
  try {
    const themes = await prisma.siteTheme.findMany({ orderBy: { createdAt: "desc" } });
    res.json(themes);
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

adminThemesRouter.post("/", async (req, res) => {
  try {
    const { name, primaryBg, accentColor, heroText, heroBanner, announcementText } = req.body;

    if (!name || !primaryBg || !accentColor || !heroText || !announcementText) {
      return res
        .status(400)
        .json({ error: "name, primaryBg, accentColor, heroText, and announcementText are required" });
    }

    const theme = await prisma.siteTheme.create({
      data: { name, primaryBg, accentColor, heroText, heroBanner: heroBanner ?? null, announcementText },
    });

    res.status(201).json(theme);
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

adminThemesRouter.patch("/:id/activate", async (req, res) => {
  try {
    const id = String(req.params.id);

    // Only one theme can be active at a time - clear the rest first, then
    // activate the target, in the same transaction so a request never sees
    // either zero or two active themes.
    await prisma.$transaction([
      prisma.siteTheme.updateMany({ where: { isActive: true }, data: { isActive: false } }),
      prisma.siteTheme.update({ where: { id }, data: { isActive: true } }),
    ]);

    const theme = await prisma.siteTheme.findUnique({ where: { id } });
    res.json(theme);
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

adminThemesRouter.delete("/:id", async (req, res) => {
  try {
    await prisma.siteTheme.delete({ where: { id: String(req.params.id) } });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

export default router;
