import express from "express";
import protect, { adminOnly } from "../middlewares/authMiddlewares.js";
import {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
} from "../controllers/orderController.js";

const router = express.Router();

router.use(protect);


router.post("/", createOrder);
router.get("/my", getMyOrders);


router.get("/", adminOnly, getAllOrders);
router.put("/:id", adminOnly, updateOrderStatus);

export default router;
