import express from "express";
import {
  createSettings,
  getSettings,
  updateSettings,
  validatePromo,
} from "../controllers/settingsController.js";
import protect,{  adminOnly } from "../middlewares/authMiddlewares.js";

const router = express.Router();

// Public — get current settings (tax, delivery, promos)
router.get("/", getSettings);

// Public — validate a promo code
router.get("/promo/:code", validatePromo);

// Admin — create initial settings
router.post("/", protect, adminOnly, createSettings);

// Admin — update existing settings
router.put("/", protect, adminOnly, updateSettings);

export default router;
