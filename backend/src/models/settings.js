import mongoose from "mongoose";

const promoCodeSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  type: { type: String, enum: ["percentage", "fixed"], required: true },
  value: { type: Number, required: true },
  expiresAt: { type: Date },
  isActive: { type: Boolean, default: true },
});

const settingsSchema = new mongoose.Schema(
  {
    deliveryFee: { type: Number, default: 5.99 },
    taxRate: { type: Number, default: 8 }, // percentage
    promos: [promoCodeSchema],
  },
  { timestamps: true }
);

const Settings = mongoose.model("Settings", settingsSchema);
export default Settings;
