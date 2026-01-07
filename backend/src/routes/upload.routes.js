import express from "express";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "lembaga-ekonomi-desa",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 2 * 1024 * 1024, // 2MB
  },
});

router.post("/", authMiddleware, upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "No file uploaded",
    });
  }

  res.status(201).json({
    success: true,
    image_url: req.file.path, // URL Cloudinary
  });
});

export default router;
