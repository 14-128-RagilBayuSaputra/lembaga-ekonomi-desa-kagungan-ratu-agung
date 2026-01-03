import express from "express";
import prisma from "../prisma/client.js";

const router = express.Router();

/**
 * GET /api/sliders
 * Ambil slider aktif untuk hero section
 */
router.get("/", async (req, res) => {
  try {
    const sliders = await prisma.sliders.findMany({
      where: {
        is_active: true,
      },
      orderBy: {
        created_at: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      data: sliders,
    });
  } catch (error) {
    console.error("GET /api/sliders error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch sliders",
    });
  }
});

export default router;
