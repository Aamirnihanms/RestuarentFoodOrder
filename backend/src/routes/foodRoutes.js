import express from "express";
import {
  getFoods,
  addFood,
  updateFood,
  deleteFood,
  addFoodReview,
  getFoodById,
  deleteFoodReview,
} from "../controllers/foodController.js";
import protect , {adminOnly} from "../middlewares/authMiddlewares.js";

const router = express.Router();


router.get("/", getFoods);


router.post("/", protect, adminOnly, addFood);
router.get("/:id", getFoodById);
router.put("/:id", protect, adminOnly, updateFood);
router.delete("/:id", protect, adminOnly, deleteFood);
router.post("/:id/review", protect, addFoodReview);
router.delete("/:foodId/review/:reviewId", protect,adminOnly, deleteFoodReview);

export default router;
