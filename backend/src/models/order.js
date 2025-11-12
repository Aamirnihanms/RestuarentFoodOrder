import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userName: { type: String, required: true },

    // Ordered items
    items: [
      {
        foodId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Food",
          required: true,
        },
        name: { type: String, required: true },
        image: { type: String },
        category: { type: String },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        size: { type: String, default: "Regular" },
        totalItemPrice: { type: Number, required: true },
      },
    ],

    // 💰 Pricing Breakdown
    subtotal: { type: Number, required: true },
    tax: { type: Number, default: 0 },
    deliveryFee: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    totalPrice: { type: Number, required: true },

    // 🎟️ Promo
    appliedPromo: { type: String, default: null },

    deliveryAddress: { type: String, required: true },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Delivered", "Cancelled"],
      default: "Pending",
    },
    paymentMethod: {
      type: String,
      enum: ["COD", "Online"],
      default: "COD",
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
