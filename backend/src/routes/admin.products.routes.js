import express from "express";
import prisma from "../prisma/client.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import cloudinary from "../config/cloudinary.js";
import multer from "multer";

const router = express.Router();

/* =========================
   MULTER CONFIG
========================= */
const storage = multer.memoryStorage();
const upload = multer({ storage });

/* =========================
   GET ALL PRODUCTS
========================= */
router.get("/", authMiddleware, async (req, res) => {
  try {
    const products = await prisma.products.findMany({
      where: { is_active: true },
      include: {
        category: true,
        images: true,
      },
      orderBy: { created_at: "desc" },
    });

    res.json({ success: true, data: products });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

/* =========================
   CREATE PRODUCT (MULTI IMAGE)
========================= */
router.post(
  "/",
  authMiddleware,
  upload.array("images", 10),
  async (req, res) => {
    try {
      const {
        product_name,
        business_name,
        price,
        description,
        category_id,
        instagram_url,
        whatsapp_url,
        shopee_url,
        facebook_url,
        maps_url,
      } = req.body;

      if (!category_id) {
        return res.status(400).json({ message: "category_id required" });
      }

      let coverImage = null;
      const galleryImages = [];

      if (req.files?.length) {
        for (let i = 0; i < req.files.length; i++) {
          const result = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
              { folder: "produk-desa/gallery" },
              (err, res) => (err ? reject(err) : resolve(res))
            ).end(req.files[i].buffer);
          });

          if (i === 0) coverImage = result.secure_url;
          galleryImages.push({ image_url: result.secure_url });
        }
      }

      const product = await prisma.products.create({
        data: {
          product_name,
          business_name,
          price: price ? Number(price) : null,
          description,
          category_id: Number(category_id),
          image_url: coverImage,
          instagram_url,
          whatsapp_url,
          shopee_url,
          facebook_url,
          maps_url,
          images: {
            create: galleryImages,
          },
        },
        include: { images: true },
      });

      res.status(201).json({ success: true, data: product });
    } catch (err) {
      console.error("CREATE PRODUCT ERROR:", err);
      res.status(500).json({ success: false });
    }
  }
);

/* =========================
   UPDATE PRODUCT + ADD IMAGES
========================= */
router.put(
  "/:id",
  authMiddleware,
  upload.array("images", 10),
  async (req, res) => {
    try {
      const id = Number(req.params.id);

      const newImages = [];

      if (req.files?.length) {
        for (const file of req.files) {
          const uploadResult = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
              { folder: "produk-desa/gallery" },
              (err, res) => (err ? reject(err) : resolve(res))
            ).end(file.buffer);
          });

          newImages.push({ image_url: uploadResult.secure_url });
        }
      }

      const product = await prisma.products.update({
        where: { id },
        data: {
          product_name: req.body.product_name,
          business_name: req.body.business_name,
          description: req.body.description,
          price: req.body.price ? Number(req.body.price) : null,
          instagram_url: req.body.instagram_url,
          whatsapp_url: req.body.whatsapp_url,
          shopee_url: req.body.shopee_url,
          facebook_url: req.body.facebook_url,
          maps_url: req.body.maps_url,
          images: newImages.length
            ? { create: newImages }
            : undefined,
        },
        include: { images: true },
      });

      res.json({ success: true, data: product });
    } catch (err) {
      console.error("UPDATE PRODUCT ERROR:", err);
      res.status(500).json({ success: false });
    }
  }
);

/* =========================
   DELETE SINGLE IMAGE
========================= */
router.delete("/image/:id", authMiddleware, async (req, res) => {
  try {
    const id = Number(req.params.id);

    const image = await prisma.product_images.findUnique({ where: { id } });
    if (!image) return res.status(404).json({ success: false });

    // delete from cloudinary
    const publicId = image.image_url.split("/").pop().split(".")[0];
    await cloudinary.uploader.destroy(`produk-desa/gallery/${publicId}`);

    await prisma.product_images.delete({ where: { id } });

    res.json({ success: true });
  } catch (err) {
    console.error("DELETE IMAGE ERROR:", err);
    res.status(500).json({ success: false });
  }
});

/* =========================
   DELETE PRODUCT (SOFT)
========================= */
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    await prisma.products.update({
      where: { id: Number(req.params.id) },
      data: { is_active: false },
    });

    res.json({ success: true });
  } catch {
    res.status(500).json({ success: false });
  }
});

export default router;
