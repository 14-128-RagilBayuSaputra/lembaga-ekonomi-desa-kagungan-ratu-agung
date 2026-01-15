import express from "express";
import prisma from "../prisma/client.js";
import cloudinary from "../config/cloudinary.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

/* =========================
   GET SLIDERS (ADMIN)
========================= */
router.get("/", authMiddleware, async (req, res) => {
  try {
    const sliders = await prisma.sliders.findMany({
      orderBy: { order: "asc" },
    });

    res.json({ success: true, data: sliders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

/* =========================
   CREATE SLIDER
========================= */
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { image_url } = req.body;

    const maxOrder = await prisma.sliders.aggregate({
      _max: { order: true },
    });

    const slider = await prisma.sliders.create({
      data: {
        image_url,
        order: (maxOrder._max.order ?? -1) + 1,
        is_active: true,
      },
    });

    res.status(201).json({ success: true, data: slider });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

/* =========================
   UPDATE (TOGGLE / ORDER)
========================= */
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const id = Number(req.params.id);

    const slider = await prisma.sliders.update({
      where: { id },
      data: req.body,
    });

    res.json({ success: true, data: slider });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

/* =========================
   REORDER (DRAG & DROP)
========================= */
router.put("/reorder/all", authMiddleware, async (req, res) => {
  try {
    const { orders } = req.body;

    const queries = orders.map((s) =>
      prisma.sliders.update({
        where: { id: s.id },
        data: { order: s.order },
      })
    );

    await prisma.$transaction(queries);

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

/* =========================
   DELETE SLIDER (DB + CLOUDINARY)
========================= */
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const id = Number(req.params.id);

    const slider = await prisma.sliders.findUnique({ where: { id } });
    if (!slider) return res.status(404).json({ success: false });

    const publicId = slider.image_url.split("/").pop().split(".")[0];
    await cloudinary.uploader.destroy(`slider/${publicId}`);

    await prisma.sliders.delete({ where: { id } });

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

export default router;
