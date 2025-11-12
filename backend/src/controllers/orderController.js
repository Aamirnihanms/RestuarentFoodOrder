import Order from "../models/order.js";
import User from "../models/user.js";
import Food from "../models/food.js";
import { createLog } from "../utils/logger.js"; // ✅ import logger utility

/**
 * @desc Create new order from user's cart
 * @route POST /api/orders
 * @access Private
 */
export const createOrder = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const { selectedItems = [], paymentMethod, deliveryAddress, pricing, appliedPromo } = req.body;

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!selectedItems.length) {
      return res.status(400).json({ message: "No items provided" });
    }

    // ✅ Rebuild order items safely
    const orderItems = [];
    for (const sel of selectedItems) {
      const food = await Food.findById(sel.foodId);
      if (!food) continue; // skip invalid food IDs

      const quantity = sel.quantity || 1;
      const price = sel.price || food.price;
      const totalItemPrice = price * quantity;

      orderItems.push({
        foodId: food._id,
        name: food.name,
        image: food.image,
        category: food.category,
        size: sel.size || "Regular",
        price,
        quantity,
        totalItemPrice,
      });
    }

    if (orderItems.length === 0) {
      return res.status(400).json({ message: "No valid items to order" });
    }

    // ✅ Calculate totals (fallback to server-side calculation for safety)
    const calculatedSubtotal = orderItems.reduce(
      (sum, item) => sum + item.totalItemPrice,
      0
    );

    const subtotal = pricing?.subtotal || calculatedSubtotal;
    const tax = pricing?.tax || 0;
    const deliveryFee = pricing?.deliveryFee || 0;
    const discount = pricing?.discount || 0;
    const totalPrice = pricing?.total || subtotal + tax + deliveryFee - discount;

    const order = await Order.create({
      user: user._id,
      userName: user.name,
      items: orderItems,
      subtotal,
      tax,
      deliveryFee,
      discount,
      totalPrice,
      appliedPromo: appliedPromo || null,
      paymentMethod,
      deliveryAddress: deliveryAddress || user.address || "No address provided",
    });

    // ✅ Optionally clear cart
    user.cart = [];
    await user.save();

    await createLog({
      user: user._id,
      action: "Order Placed",
      description: `Order placed successfully — ${orderItems.length} items, total ₹${totalPrice}`,
      ipAddress: req.ip,
      method: req.method,
      endpoint: req.originalUrl,
    });

    res.status(201).json({
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    await createLog({
      user: req.user?._id,
      action: "Order Creation Error",
      description: error.message,
      ipAddress: req.ip,
      method: req.method,
      endpoint: req.originalUrl,
      status: "failed",
    });
    res.status(500).json({ message: error.message });
  }
};


/**
 * @desc Get all orders for current user
 * @route GET /api/orders/my
 * @access Private
 */
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate(
      "items.foodId"
    );

    await createLog({
      user: req.user._id,
      action: "View My Orders",
      description: `User viewed ${orders.length} orders`,
      ipAddress: req.ip,
      method: req.method,
      endpoint: req.originalUrl,
    });

    res.json(orders);
  } catch (error) {
    await createLog({
      user: req.user._id,
      action: "Get My Orders Error",
      description: error.message,
      ipAddress: req.ip,
      method: req.method,
      endpoint: req.originalUrl,
      status: "failed",
    });
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc Get all orders (admin only)
 * @route GET /api/orders
 * @access Private/Admin
 */
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("items.foodId");

    // await createLog({
    //   user: req.user._id,
    //   action: "Admin View All Orders",
    //   description: `Admin viewed all orders — ${orders.length} total`,
    //   ipAddress: req.ip,
    //   method: req.method,
    //   endpoint: req.originalUrl,
    // });

    res.json(orders);
  } catch (error) {
    await createLog({
      user: req.user._id,
      action: "Get All Orders Error",
      description: error.message,
      ipAddress: req.ip,
      method: req.method,
      endpoint: req.originalUrl,
      status: "failed",
    });
    res.status(500).json({ message: error.message });
  }
};

/**
 * @desc Update order status (admin)
 * @route PUT /api/orders/:id
 * @access Private/Admin
 */
export const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      await createLog({
        user: req.user._id,
        action: "Update Order Status Attempt",
        description: `Failed — Order not found (${req.params.id})`,
        ipAddress: req.ip,
        method: req.method,
        endpoint: req.originalUrl,
        status: "failed",
      });
      return res.status(404).json({ message: "Order not found" });
    }

    order.status = req.body.status || order.status;
    await order.save();

    await createLog({
      user: req.user._id,
      action: "Update Order Status",
      description: `Order ${order._id} marked as ${order.status}`,
      ipAddress: req.ip,
      method: req.method,
      endpoint: req.originalUrl,
    });

    res.json({ message: "Order status updated", order });
  } catch (error) {
    await createLog({
      user: req.user._id,
      action: "Update Order Status Error",
      description: error.message,
      ipAddress: req.ip,
      method: req.method,
      endpoint: req.originalUrl,
      status: "failed",
    });
    res.status(500).json({ message: error.message });
  }
};
