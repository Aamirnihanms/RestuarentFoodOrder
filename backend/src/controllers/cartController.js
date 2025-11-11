import User from "../models/user.js";
import Food from "../models/food.js";
import { createLog } from "../utils/logger.js"; // ✅ Import logger utility

// ✅ Add item to cart
export const addToCart = async (req, res) => {
  try {
    const { foodId, size, quantity, totalPrice } = req.body.foodData;

    const user = await User.findById(req.user._id);
    if (!user) {
      await createLog({
        user: req.user?._id,
        action: "Add to Cart",
        description: `Failed — User not found`,
        ipAddress: req.ip,
        method: req.method,
        endpoint: req.originalUrl,
        status: "failed",
      });
      return res.status(404).json({ message: "User not found" });
    }

    const food = await Food.findById(foodId);
    if (!food) {
      await createLog({
        user: req.user?._id,
        action: "Add to Cart",
        description: `Failed — Food not found (${foodId})`,
        ipAddress: req.ip,
        method: req.method,
        endpoint: req.originalUrl,
        status: "failed",
      });
      return res.status(404).json({ message: "Food not found" });
    }

    const existingItem = user.cart.find(
      (item) => item.foodId.toString() === foodId && item.size === size
    );

    if (existingItem) {
      existingItem.quantity += quantity || 1;
      existingItem.totalPrice = existingItem.price * existingItem.quantity;
    } else {
      user.cart.push({
        foodId,
        name: food.name,
        category: food.category,
        price: food.price,
        quantity: quantity || 1,
        size: size || "Regular",
        image: food.image,
        prepTime: food.prepTime,
        totalPrice: totalPrice || food.price * (quantity || 1),
      });
    }

    await user.save();

    await createLog({
      user: user._id,
      action: "Add to Cart",
      description: `Added "${food.name}" (${size || "Regular"}) x${quantity || 1} to cart`,
      ipAddress: req.ip,
      method: req.method,
      endpoint: req.originalUrl,
    });

    res.status(200).json({ message: "Item added to cart", cart: user.cart });
  } catch (error) {
    console.error("Error adding to cart:", error);
    await createLog({
      user: req.user?._id,
      action: "Add to Cart Error",
      description: error.message,
      ipAddress: req.ip,
      method: req.method,
      endpoint: req.originalUrl,
      status: "failed",
    });
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get user cart
export const getCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      await createLog({
        user: req.user?._id,
        action: "View Cart",
        description: "Failed — User not found",
        ipAddress: req.ip,
        method: req.method,
        endpoint: req.originalUrl,
        status: "failed",
      });
      return res.status(404).json({ message: "User not found" });
    }

    await createLog({
      user: user._id,
      action: "View Cart",
      description: `Viewed cart with ${user.cart.length} items`,
      ipAddress: req.ip,
      method: req.method,
      endpoint: req.originalUrl,
    });

    res.status(200).json(user.cart);
  } catch (error) {
    await createLog({
      user: req.user?._id,
      action: "View Cart Error",
      description: error.message,
      ipAddress: req.ip,
      method: req.method,
      endpoint: req.originalUrl,
      status: "failed",
    });
    res.status(500).json({ message: error.message });
  }
};

// ✅ Remove specific item from cart
export const removeFromCart = async (req, res) => {
  try {
    const { foodId, size } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) {
      await createLog({
        user: req.user?._id,
        action: "Remove from Cart",
        description: "Failed — User not found",
        ipAddress: req.ip,
        method: req.method,
        endpoint: req.originalUrl,
        status: "failed",
      });
      return res.status(404).json({ message: "User not found" });
    }

    const itemToRemove = user.cart.find(
      (item) => item.foodId.toString() === foodId && item.size === size
    );

    if (itemToRemove) {
      await createLog({
        user: user._id,
        action: "Remove from Cart",
        description: `Removed "${itemToRemove.name}" (${size}) from cart`,
        ipAddress: req.ip,
        method: req.method,
        endpoint: req.originalUrl,
      });
    }

    user.cart = user.cart.filter(
      (item) => item.foodId.toString() !== foodId || item.size !== size
    );

    await user.save();
    res.status(200).json({ message: "Item removed from cart", cart: user.cart });
  } catch (error) {
    await createLog({
      user: req.user?._id,
      action: "Remove from Cart Error",
      description: error.message,
      ipAddress: req.ip,
      method: req.method,
      endpoint: req.originalUrl,
      status: "failed",
    });
    res.status(500).json({ message: error.message });
  }
};

// ✅ Clear full cart
export const clearCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      await createLog({
        user: req.user?._id,
        action: "Clear Cart",
        description: "Failed — User not found",
        ipAddress: req.ip,
        method: req.method,
        endpoint: req.originalUrl,
        status: "failed",
      });
      return res.status(404).json({ message: "User not found" });
    }

    const clearedCount = user.cart.length;
    user.cart = [];
    await user.save();

    await createLog({
      user: user._id,
      action: "Clear Cart",
      description: `Cleared all ${clearedCount} items from cart`,
      ipAddress: req.ip,
      method: req.method,
      endpoint: req.originalUrl,
    });

    res.status(200).json({ message: "Cart cleared", cart: [] });
  } catch (error) {
    await createLog({
      user: req.user?._id,
      action: "Clear Cart Error",
      description: error.message,
      ipAddress: req.ip,
      method: req.method,
      endpoint: req.originalUrl,
      status: "failed",
    });
    res.status(500).json({ message: error.message });
  }
};
