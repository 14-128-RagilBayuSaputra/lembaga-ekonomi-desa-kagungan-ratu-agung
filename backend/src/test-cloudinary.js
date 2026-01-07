import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { v2 as cloudinary } from "cloudinary";

// ===== PATH FIX UNTUK ESM =====
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ===== PAKSA LOAD .env dari backend/ =====
dotenv.config({ path: path.resolve(__dirname, "../.env") });

// ===== DEBUG ENV =====
console.log("ENV CHECK:", {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ===== CONFIG CLOUDINARY =====
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ===== TEST UPLOAD =====
try {
  const res = await cloudinary.uploader.upload(
    "https://res.cloudinary.com/demo/image/upload/sample.jpg"
  );
  console.log("✅ CLOUDINARY CONNECTED");
  console.log("Image URL:", res.secure_url);
} catch (err) {
  console.error("❌ CLOUDINARY ERROR");
  console.error(err);
}
