import express from "express";
import {
  getFoods,
  addFood,
  updateFood,
  deleteFood,
  addFoodReview,
  getFoodById,
} from "../controllers/foodController.js";
import protect , {adminOnly} from "../middlewares/authMiddlewares.js";

const router = express.Router();


router.get("/", getFoods);


router.post("/", protect, adminOnly, addFood);
router.get("/:id", getFoodById);
router.put("/:id", protect, adminOnly, updateFood);
router.delete("/:id", protect, adminOnly, deleteFood);
router.post("/:id/review", protect, addFoodReview);

export default router;
