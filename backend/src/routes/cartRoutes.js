import express from "express";
import protect from "../middlewares/authMiddlewares.js";
import {
  addToCart,
  getCart,
  removeFromCart,
  clearCart,
} from "../controllers/cartController.js";

const router = express.Router();

router.use(protect); 

router.post("/add", addToCart);
router.get("/", getCart);
router.delete("/:foodId", removeFromCart);
router.delete("/", clearCart);

export default router;
