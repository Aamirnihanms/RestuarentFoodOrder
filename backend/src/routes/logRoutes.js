import express from "express";
import { getAllLogs, clearLogs } from "../controllers/logController.js";
import protect, {  adminOnly } from "../middlewares/authMiddlewares.js";

const router = express.Router();

router.get("/", protect, adminOnly, getAllLogs);
router.delete("/", protect, adminOnly, clearLogs);

export default router;
