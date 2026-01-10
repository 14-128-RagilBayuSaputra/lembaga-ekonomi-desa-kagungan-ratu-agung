import express from "express";
import prisma from "../prisma/client.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

/**
 * GET /api/admin/sliders
 * Ambil semua slider (admin)
 */
router.get("/", authMiddleware, async (req, res) => {
  try {
    const sliders = await prisma.sliders.findMany({
      orderBy: {
        created_at: "desc",
      },
    });

    res.json({
      success: true,
      data: sliders,
    });
  } catch (error) {
    console.error("ADMIN GET SLIDERS error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch sliders",
    });
  }
});


/**
 * POST /api/admin/sliders
 * Tambah slider baru
 */
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { title, description, image_url } = req.body;

    const slider = await prisma.sliders.create({
      data: {
        title,
        description,
        image_url,
        is_active: true,
      },
    });

    res.status(201).json({ success: true, data: slider });
  } catch (error) {
    console.error("ADMIN CREATE SLIDER error:", error);
    res.status(500).json({ success: false, message: "Failed to create slider" });
  }
});

/**
 * PUT /api/admin/sliders/:id
 * Update slider
 */
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const id = Number(req.params.id);

    const slider = await prisma.sliders.update({
      where: { id },
      data: req.body,
    });

    res.json({ success: true, data: slider });
  } catch (error) {
    console.error("ADMIN UPDATE SLIDER error:", error);
    res.status(500).json({ success: false, message: "Failed to update slider" });
  }
});

/**
 * DELETE /api/admin/sliders/:id
 * Soft delete slider
 */
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const id = Number(req.params.id);

    await prisma.sliders.update({
      where: { id },
      data: { is_active: false },
    });

    res.json({ success: true, message: "Slider deactivated" });
  } catch (error) {
    console.error("ADMIN DELETE SLIDER error:", error);
    res.status(500).json({ success: false, message: "Failed to delete slider" });
  }
});

export default router;
