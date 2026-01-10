import express from "express";
import prisma from "../prisma/client.js";

const router = express.Router();

/**
 * GET /api/products
 * Ambil semua produk aktif
 */
router.get("/", async (req, res) => {
  try {
    const products = await prisma.products.findMany({
      where: {
        is_active: true,
      },
      orderBy: {
        created_at: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error("GET /api/products error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch products",
    });
  }
});

/**
 * GET /api/products/:id
 * Ambil detail produk berdasarkan ID
 */
router.get("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    const product = await prisma.products.findFirst({
      where: {
        id,
        is_active: true,
      },
      include: {
        category: true,
        images: true, // ✅ INI YANG PENTING
      },
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error("GET /api/products/:id error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch product detail",
    });
  }
});


export default router;
