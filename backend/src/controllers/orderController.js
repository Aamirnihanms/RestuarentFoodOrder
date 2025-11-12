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
    const user = await User.findById(req.user._id).populate("cart.foodId");
    const { selectedItems = [], paymentMethod, deliveryAddress } = req.body;

    if (!user) {
      await createLog({
        action: "Order Creation",
        description: `Order failed — User not found`,
        ipAddress: req.ip,
        method: req.method,
        endpoint: req.originalUrl,
        status: "failed",
      });
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.cart || user.cart.length === 0) {
      await createLog({
        user: user._id,
        action: "Order Creation",
        description: `Order failed — Empty cart`,
        ipAddress: req.ip,
        method: req.method,
        endpoint: req.originalUrl,
        status: "failed",
      });
      return res.status(400).json({ message: "Cart is empty" });
    }

    let itemsToOrder = [];
    if (selectedItems.length > 0) {
      itemsToOrder = user.cart.filter((cartItem) =>
        selectedItems.some(
          (sel) => sel.foodId === cartItem.foodId._id.toString()
        )
      );
    } else {
      itemsToOrder = user.cart;
    }

    if (!itemsToOrder.length) {
      await createLog({
        user: user._id,
        action: "Order Creation",
        description: `Order failed — No valid items selected`,
        ipAddress: req.ip,
        method: req.method,
        endpoint: req.originalUrl,
        status: "failed",
      });
      return res.status(400).json({ message: "No valid items found to order" });
    }

    const orderItems = itemsToOrder.map((item) => {
      const food = item.foodId;
      return {
        foodId: food._id,
        name: food.name,
        image: food.image,
        category: food.category,
        price: food.price,
        size: item.size || "Regular",
        quantity: item.quantity,
        totalItemPrice: food.price * item.quantity,
      };
    });

    const totalPrice = orderItems.reduce(
      (sum, item) => sum + item.totalItemPrice,
      0
    );

    const order = await Order.create({
      user: user._id,
      userName: user.name,
      items: orderItems,
      totalPrice,
      paymentMethod,
      deliveryAddress: deliveryAddress || user.address || "No address provided",
    });

    // ✅ Clear ordered items from cart
    user.cart = user.cart.filter(
      (cartItem) =>
        !itemsToOrder.some(
          (ordered) =>
            ordered.foodId._id.toString() === cartItem.foodId._id.toString()
        )
    );
    await user.save();

    // ✅ Log successful order creation
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
