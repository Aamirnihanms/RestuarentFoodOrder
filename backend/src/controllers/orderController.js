import Order from "../models/order.js";
import User from "../models/user.js";
import Food from "../models/food.js";
import { createLog } from "../utils/logger.js"; // ✅ import logger utility


// =======================
//  ROUND ROBIN EMPLOYEE ASSIGNMENT
// =======================

let lastAssignedIndex = 0;

async function assignEmployeeToOrder(order) {
  const employees = await User.find({ role: "employee", isActive: true });

  if (!employees.length) return null;

  const employee = employees[lastAssignedIndex % employees.length];
  lastAssignedIndex++;

  order.assignedTo = employee._id;
  await order.save();

  await createLog({
    user: employee._id,
    action: "Order Assigned",
    description: `Order ${order._id} assigned to ${employee.name}`,
  });

  return employee;
}


/**
 * @desc Create new order from user's cart
 * @route POST /api/orders
 * @access Private
 */
export const createOrder = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    const { selectedItems = [], paymentMethod, deliveryAddress, pricing, appliedPromo } = req.body;

    if (!user) return res.status(404).json({ message: "User not found" });
    if (!selectedItems.length) return res.status(400).json({ message: "No items provided" });

    // Build Items Array
    const orderItems = [];

    for (const sel of selectedItems) {
      const food = await Food.findById(sel.foodId);
      if (!food) continue;

      const price = sel.price || food.price;
      const quantity = sel.quantity || 1;

      orderItems.push({
        foodId: food._id,
        name: food.name,
        image: food.image,
        category: food.category,
        size: sel.size || "Regular",
        price,
        quantity,
        totalItemPrice: price * quantity,
      });
    }

    if (!orderItems.length) {
      return res.status(400).json({ message: "No valid items to order" });
    }

    // Pricing Calculation
    const calculatedSubtotal = orderItems.reduce((sum, item) => sum + item.totalItemPrice, 0);

    const subtotal = pricing?.subtotal || calculatedSubtotal;
    const tax = pricing?.tax || 0;
    const deliveryFee = pricing?.deliveryFee || 0;
    const discount = pricing?.discount || 0;
    const totalPrice = pricing?.total || subtotal + tax + deliveryFee - discount;

    // Create Order
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
      deliveryAddress: deliveryAddress || "No address provided",
      status: "Pending",
    });

    // Clear Cart
    user.cart = [];
    await user.save();

    // Auto-assign employee
    await assignEmployeeToOrder(order);

    await createLog({
      user: user._id,
      action: "Order Placed",
      description: `Order placed — Total ₹${totalPrice}`,
      endpoint: req.originalUrl,
      method: req.method,
      ipAddress: req.ip,
    });

    res.status(201).json({ message: "Order placed successfully", order });
  } catch (error) {
    console.error("Order Error:", error);

    await createLog({
      user: req.user?._id,
      action: "Order Creation Error",
      description: error.message,
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





// =======================
//  EMPLOYEE CONFIRM ORDER (Generate Delivery PIN)
// =======================

export const confirmOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.assignedTo.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Generate 6 digit delivery pin
    const pin = Math.floor(100000 + Math.random() * 900000).toString();

    order.status = "Confirmed";
    order.deliveryPin = pin;
    await order.save();

    await createLog({
      user: req.user._id,
      action: "Order Confirmed",
      description: `Order ${order._id} confirmed with PIN`,
    });

    res.json({ message: "Order confirmed", deliveryPin: pin });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// =======================
//  EMPLOYEE COMPLETE ORDER (Verify PIN)
// =======================

export const completeOrder = async (req, res) => {
  try {
    const { pin } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.assignedTo.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (order.deliveryPin !== pin) {
      return res.status(400).json({ message: "Invalid PIN" });
    }

    order.status = "Delivered";
    order.deliveryPin = null;
    await order.save();

    await createLog({
      user: req.user._id,
      action: "Order Delivered",
      description: `Order ${order._id} marked Delivered`,
    });

    res.json({ message: "Order delivered successfully", order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




export const getEmployeeOrders = async (req, res) => {
  try {
    const orders = await Order.find({ assignedTo: req.user._id })
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
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
