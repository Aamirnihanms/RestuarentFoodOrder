import User from "../models/user.js";
import { createLog } from "../utils/logger.js"; // ✅ Import logger utility

/**
 * @desc Get all users (excluding deleted)
 * @route GET /api/admin/users
 * @access Private/Admin
 */
export const getAllUsers = async (req, res) => {
  try {
    // 👇 Fetch only non-admin users & non-deleted users
    const users = await User.find({ role: { $ne: "admin" } })
      .select("-password")
      .sort({ createdAt: -1 });

    await createLog({
      user: req.user?._id,
      action: "Get Users List",
      description: `Admin viewed all active users (${users.length} total)`,
      ipAddress: req.ip,
      method: req.method,
      endpoint: req.originalUrl,
    });

    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);

    await createLog({
      user: req.user?._id,
      action: "Get Users List Error",
      description: error.message,
      ipAddress: req.ip,
      method: req.method,
      endpoint: req.originalUrl,
      status: "failed",
    });

    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * @desc Soft delete a user (Admin)
 * @route PUT /api/admin/users/:id/delete
 * @access Private/Admin
 */
export const softDeleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      await createLog({
        user: req.user?._id,
        action: "User Delete Attempt",
        description: `Failed delete attempt — User not found (${req.params.id})`,
        ipAddress: req.ip,
        method: req.method,
        endpoint: req.originalUrl,
        status: "failed",
      });
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isDeleted) {
      await createLog({
        user: req.user?._id,
        action: "User Delete Attempt",
        description: `User already deleted: ${user.email}`,
        ipAddress: req.ip,
        method: req.method,
        endpoint: req.originalUrl,
        status: "failed",
      });
      return res.status(400).json({ message: "User already deleted" });
    }

    user.isDeleted = true;
    user.isActive = false;
    await user.save();

    await createLog({
      user: req.user?._id,
      action: "User Soft Delete",
      description: `Admin soft-deleted user ${user.name} (${user.email})`,
      ipAddress: req.ip,
      method: req.method,
      endpoint: req.originalUrl,
    });

    res.status(200).json({ message: "User soft deleted successfully", user });
  } catch (error) {
    await createLog({
      user: req.user?._id,
      action: "User Soft Delete Error",
      description: error.message,
      ipAddress: req.ip,
      method: req.method,
      endpoint: req.originalUrl,
      status: "failed",
    });

    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * @desc Restore a soft-deleted user (Admin)
 * @route PUT /api/admin/users/:id/restore
 * @access Private/Admin
 */
export const restoreUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      await createLog({
        user: req.user?._id,
        action: "User Restore Attempt",
        description: `Failed restore — User not found (${req.params.id})`,
        ipAddress: req.ip,
        method: req.method,
        endpoint: req.originalUrl,
        status: "failed",
      });
      return res.status(404).json({ message: "User not found" });
    }

    user.isDeleted = false;
    user.isActive = true;
    await user.save();

    await createLog({
      user: req.user?._id,
      action: "User Restore",
      description: `Admin restored user ${user.name} (${user.email})`,
      ipAddress: req.ip,
      method: req.method,
      endpoint: req.originalUrl,
    });

    res.status(200).json({ message: "User restored successfully", user });
  } catch (error) {
    await createLog({
      user: req.user?._id,
      action: "User Restore Error",
      description: error.message,
      ipAddress: req.ip,
      method: req.method,
      endpoint: req.originalUrl,
      status: "failed",
    });

    res.status(500).json({ message: "Server error", error: error.message });
  }
};
