import express from "express";
import {
  getAllUsers,
  softDeleteUser,
  restoreUser,
} from "../controllers/userAdminController.js";
import protect,{ adminOnly } from "../middlewares/authMiddlewares.js";

const router = express.Router();

router.get("/", protect, adminOnly, getAllUsers);
router.put("/:id/delete", protect, adminOnly, softDeleteUser);
router.put("/:id/restore", protect, adminOnly, restoreUser);

export default router;
