import express from "express";
import protect from "../middlewares/authMiddlewares.js";
import {
  addAddress,
  setDefaultAddress,
  getAddresses,
  deleteAddress,
} from "../controllers/addressController.js";

const router = express.Router();

router.post("/", protect, addAddress);
router.put("/default", protect, setDefaultAddress);
router.get("/", protect, getAddresses);
router.delete("/", protect, deleteAddress);

export default router;
