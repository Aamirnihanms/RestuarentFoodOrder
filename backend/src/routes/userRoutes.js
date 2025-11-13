import express from "express";
import { registerUser, loginUser,createEmployee } from "../controllers/userController.js";
import protect, { adminOnly } from "../middlewares/authMiddlewares.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);


router.post("/create-employee", protect, adminOnly, createEmployee);

export default router;
