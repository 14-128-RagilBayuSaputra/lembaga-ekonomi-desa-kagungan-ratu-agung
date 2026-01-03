import express from "express";
import prisma from "../prisma/client.js";

const router = express.Router();

/**
 * GET /api/categories
 * Ambil semua kategori + jumlah produk aktif
 */
router.get("/", async (req, res) => {
  try {
    const categories = await prisma.categories.findMany({
      orderBy: {
        name: "asc",
      },
      include: {
        products: {
          where: {
            is_active: true,
          },
          select: {
            id: true,
          },
        },
      },
    });

    // rapikan response (hitung jumlah produk)
    const result = categories.map((cat) => ({
      id: cat.id,
      name: cat.name,
      total_products: cat.products.length,
    }));

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("GET /api/categories error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch categories",
    });
  }
});

export default router;
