import express from "express";
import { getDashboardData } from "../controllers/dashboardController.js";
import protect,{ adminOnly } from "../middlewares/authMiddlewares.js";

const router = express.Router();

router.get("/", protect, adminOnly, getDashboardData);

export default router;
