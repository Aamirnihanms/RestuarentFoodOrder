import mongoose from "mongoose";

const logSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    action: {
      type: String,
      required: true, // e.g., "User Login", "Order Placed"
    },
    description: {
      type: String,
      required: true, // detailed message
    },
    ipAddress: {
      type: String,
    },
    method: {
      type: String, // e.g., GET, POST, DELETE
    },
    endpoint: {
      type: String, // e.g., /api/orders
    },
    status: {
      type: String,
      enum: ["success", "failed"],
      default: "success",
    },
  },
  { timestamps: true }
);

const Log = mongoose.model("Log", logSchema);
export default Log;
