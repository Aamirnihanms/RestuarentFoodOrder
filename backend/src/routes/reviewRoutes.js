import express from "express";
import { getReviewAnalytics } from "../controllers/reviewController.js";
import protect, {  adminOnly } from "../middlewares/authMiddlewares.js";

const router = express.Router();

// Admin analytics endpoint
router.get("/analytics", protect, adminOnly, getReviewAnalytics);

export default router;
