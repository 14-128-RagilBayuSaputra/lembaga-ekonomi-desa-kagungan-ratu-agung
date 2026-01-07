import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import productsRoutes from "./routes/products.routes.js";
import categoriesRoutes from "./routes/categories.routes.js";
import slidersRoutes from "./routes/sliders.routes.js";
import aboutRoutes from "./routes/about.routes.js";
import authRoutes from "./routes/auth.routes.js";
import adminProductsRoutes from "./routes/admin.products.routes.js";
import adminSlidersRoutes from "./routes/admin.sliders.routes.js";
import adminAboutRoutes from "./routes/admin.about.routes.js";
import uploadRoutes from "./routes/upload.routes.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

// health check
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "API Lembaga Ekonomi Desa berjalan 🚀",
  });
});

// REGISTER ROUTES (INI KUNCI)
app.use("/api/products", productsRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/sliders", slidersRoutes);
app.use("/api/about", aboutRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin/upload", uploadRoutes);
app.use("/api/admin/products", adminProductsRoutes);
app.use("/api/admin/sliders", adminSlidersRoutes);
app.use("/api/admin/about", adminAboutRoutes);


export default app;
