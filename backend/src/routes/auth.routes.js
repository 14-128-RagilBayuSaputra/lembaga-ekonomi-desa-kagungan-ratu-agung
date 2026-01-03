import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../prisma/client.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

/**
 * POST /api/auth/login
 */
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  const admin = await prisma.admins.findFirst({
    where: { username },
  });

  if (!admin) {
    return res.status(401).json({
      success: false,
      message: "Invalid username or password",
    });
  }

  const isValid = await bcrypt.compare(password, admin.password);

  if (!isValid) {
    return res.status(401).json({
      success: false,
      message: "Invalid username or password",
    });
  }

  const token = jwt.sign(
    { id: admin.id, username: admin.username },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.json({
    success: true,
    token,
  });
});

/**
 * PUT /api/auth/update
 * Ganti username / password (login required)
 */
router.put("/update", authMiddleware, async (req, res) => {
  const { username, password } = req.body;

  const data = {};

  if (username) data.username = username;
  if (password) data.password = await bcrypt.hash(password, 10);

  await prisma.admins.update({
    where: { id: req.admin.id },
    data,
  });

  res.json({
    success: true,
    message: "Admin credentials updated",
  });
});

/**
 * POST /api/auth/reset
 * Reset pakai kode rahasia
 */
router.post("/reset", async (req, res) => {
  const { reset_code, username, password } = req.body;

  if (reset_code !== process.env.ADMIN_RESET_CODE) {
    return res.status(403).json({
      success: false,
      message: "Invalid reset code",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const admin = await prisma.admins.findFirst();

  if (!admin) {
    await prisma.admins.create({
      data: {
        username,
        password: hashedPassword,
      },
    });
  } else {
    await prisma.admins.update({
      where: { id: admin.id },
      data: {
        username,
        password: hashedPassword,
      },
    });
  }

  res.json({
    success: true,
    message: "Admin reset successful",
  });
});

export default router;
