import express from "express";
import prisma from "../prisma/client.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

/**
 * POST /api/admin/products
 * Tambah produk baru
 */
router.post("/", authMiddleware, async (req, res) => {
  try {
    const {
      product_name,
      business_name,
      price,
      description,
      category_id,
      image_url,
      instagram_url,
      whatsapp_url,
      shopee_url,
      facebook_url,
      maps_url,
    } = req.body;

    const product = await prisma.products.create({
      data: {
        product_name,
        business_name,
        price,
        description,
        category_id,
        image_url,
        instagram_url,
        whatsapp_url,
        shopee_url,
        facebook_url,
        maps_url,
      },
    });

    res.status(201).json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error("ADMIN CREATE PRODUCT error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create product",
    });
  }
});

/**
 * PUT /api/admin/products/:id
 * Update produk
 */
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const id = Number(req.params.id);

    const product = await prisma.products.update({
      where: { id },
      data: req.body,
    });

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error("ADMIN UPDATE PRODUCT error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update product",
    });
  }
});

/**
 * DELETE /api/admin/products/:id
 * Soft delete (nonaktifkan)
 */
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const id = Number(req.params.id);

    await prisma.products.update({
      where: { id },
      data: { is_active: false },
    });

    res.json({
      success: true,
      message: "Product deactivated",
    });
  } catch (error) {
    console.error("ADMIN DELETE PRODUCT error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete product",
    });
  }
});

export default router;
