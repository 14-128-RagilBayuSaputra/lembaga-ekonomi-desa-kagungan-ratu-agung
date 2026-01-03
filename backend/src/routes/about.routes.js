import express from "express";
import prisma from "../prisma/client.js";

const router = express.Router();

/**
 * GET /api/about
 * Ambil profil lembaga ekonomi desa
 */
router.get("/", async (req, res) => {
  try {
    const about = await prisma.about.findFirst({
      orderBy: {
        updated_at: "desc",
      },
    });

    if (!about) {
      return res.status(200).json({
        success: true,
        data: null,
        message: "About content not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: about,
    });
  } catch (error) {
    console.error("GET /api/about error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch about content",
    });
  }
});

export default router;
