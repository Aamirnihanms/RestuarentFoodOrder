import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    userName: { type: String, required: true },

    items: [
      {
        foodId: { type: mongoose.Schema.Types.ObjectId, ref: "Food", required: true },
        name: String,
        image: String,
        category: String,
        quantity: Number,
        price: Number,
        size: { type: String, default: "Regular" },
        totalItemPrice: Number,
      },
    ],

    subtotal: Number,
    tax: Number,
    deliveryFee: Number,
    discount: Number,
    totalPrice: Number,
    appliedPromo: String,

    deliveryAddress: { type: String, required: true },

    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Delivered", "Cancelled"],
      default: "Pending",
    },

    paymentMethod: { type: String, enum: ["COD", "Online"], default: "COD" },

    // 🆕 EMPLOYEE ASSIGNMENT
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    // 🆕 DELIVERY PIN
    deliveryPin: { type: String, default: null },
  },
  { timestamps: true }
);


const Order = mongoose.model("Order", orderSchema);
export default Order;
