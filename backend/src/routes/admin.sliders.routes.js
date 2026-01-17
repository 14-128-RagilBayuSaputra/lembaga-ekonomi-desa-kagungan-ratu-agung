import express from "express";
import prisma from "../prisma/client.js";
import cloudinary from "../config/cloudinary.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import multer from "multer"; // PENTING: Import Multer

const router = express.Router();

// --- KONFIGURASI MULTER (Wajib untuk baca file) ---
const storage = multer.memoryStorage();
const upload = multer({ 
    storage, 
    limits: { fileSize: 5 * 1024 * 1024 } // Batas 5MB
});

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
   CREATE SLIDER (INI YANG BIKIN ERROR SEBELUMNYA)
========================= */
// Tambahkan middleware 'upload.single("image")' agar backend bisa baca file
router.post("/", authMiddleware, upload.single("image"), async (req, res) => {
  try {
    // 1. Cek apakah ada file yang dikirim
    if (!req.file) {
        return res.status(400).json({ success: false, message: "Harap upload gambar!" });
    }

    // 2. Upload ke Cloudinary
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
    
    const uploadResponse = await cloudinary.uploader.upload(dataURI, {
        folder: "slider",
    });

    // 3. Ambil data teks (Judul/Deskripsi)
    const { title, description, is_active } = req.body;

    // 4. Cari urutan terakhir
    const maxOrder = await prisma.sliders.aggregate({
      _max: { order: true },
    });

    // 5. Simpan ke Database (Sekarang image_url SUDAH ADA isinya)
    const slider = await prisma.sliders.create({
      data: {
        image_url: uploadResponse.secure_url, // URL dari Cloudinary
        title: title || "",
        description: description || "",
        order: (maxOrder._max.order ?? -1) + 1,
        // Pastikan konversi string "true"/"false" ke boolean
        is_active: is_active === "true" || is_active === true, 
      },
    });

    res.status(201).json({ success: true, data: slider });
  } catch (err) {
    console.error("Error Upload Slider:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

/* =========================
   UPDATE SLIDER (GANTI GAMBAR / EDIT TEKS)
========================= */
router.put("/:id", authMiddleware, upload.single("image"), async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { title, description, is_active } = req.body;

    const oldSlider = await prisma.sliders.findUnique({ where: { id } });
    if (!oldSlider) return res.status(404).json({ success: false });

    let imageUrl = oldSlider.image_url;

    // Jika user upload foto baru, ganti di Cloudinary
    if (req.file) {
        // Hapus foto lama
        try {
            const publicId = oldSlider.image_url.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(`slider/${publicId}`);
        } catch (e) { console.log("Gagal hapus gambar lama, lanjut upload."); }

        // Upload foto baru
        const b64 = Buffer.from(req.file.buffer).toString("base64");
        let dataURI = "data:" + req.file.mimetype + ";base64," + b64;
        const uploadResponse = await cloudinary.uploader.upload(dataURI, { folder: "slider" });
        
        imageUrl = uploadResponse.secure_url;
    }

    // Update DB
    const slider = await prisma.sliders.update({
      where: { id },
      data: {
        image_url: imageUrl,
        title: title !== undefined ? title : oldSlider.title,
        description: description !== undefined ? description : oldSlider.description,
        is_active: is_active !== undefined ? (is_active === "true" || is_active === true) : oldSlider.is_active,
      },
    });

    res.json({ success: true, data: slider });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

/* =========================
   DELETE SLIDER
========================= */
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const id = Number(req.params.id);

    const slider = await prisma.sliders.findUnique({ where: { id } });
    if (!slider) return res.status(404).json({ success: false });

    try {
        const publicId = slider.image_url.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(`slider/${publicId}`);
    } catch (e) {}

    await prisma.sliders.delete({ where: { id } });

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

export default router;