import express from "express";
import healthRoutes from "./healthRoutes.js";
import authRoutes from "./authRoutes.js";

const router = express.Router();

router.use("/api/health", healthRoutes);
router.use("/api/auth", authRoutes);

export default router;
