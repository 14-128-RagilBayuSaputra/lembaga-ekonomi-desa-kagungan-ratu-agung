import express from "express";
import prisma from "../prisma/client.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

/**
 * PUT /api/admin/about
 * Update konten About (1 data saja)
 */
router.put("/", authMiddleware, async (req, res) => {
  try {
    const { content } = req.body;

    const existing = await prisma.about.findFirst();

    let about;
    if (!existing) {
      about = await prisma.about.create({
        data: { content },
      });
    } else {
      about = await prisma.about.update({
        where: { id: existing.id },
        data: { content },
      });
    }

    res.json({
      success: true,
      data: about,
    });
  } catch (error) {
    console.error("ADMIN UPDATE ABOUT error:", error);
    res.status(500).json({ success: false, message: "Failed to update about" });
  }
});

export default router;
