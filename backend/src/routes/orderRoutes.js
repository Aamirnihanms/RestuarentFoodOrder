import express from "express";
import protect, { adminOnly,employeeOnly } from "../middlewares/authMiddlewares.js";
import {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
  confirmOrder,
  completeOrder, 
  getEmployeeOrders, 
} from "../controllers/orderController.js";

const router = express.Router();

router.use(protect);


router.post("/", createOrder);
router.get("/my", getMyOrders);


router.get("/", adminOnly, getAllOrders);
router.put("/:id", adminOnly, updateOrderStatus);

router.get("/employee", protect, employeeOnly, getEmployeeOrders);

router.put("/:id/confirm", protect, employeeOnly, confirmOrder);

router.post("/:id/deliver", protect, employeeOnly, completeOrder);



export default router;
