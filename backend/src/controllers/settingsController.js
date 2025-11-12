import Settings from "../models/settings.js";
import { createLog } from "../utils/logger.js";

/**
 * @desc Create initial app settings
 * @route POST /api/settings
 * @access Private/Admin
 */
export const createSettings = async (req, res) => {
  try {
    const { deliveryFee, taxRate, promos } = req.body;

    // Prevent multiple documents — only 1 settings record
    const existing = await Settings.findOne();
    if (existing) {
      return res
        .status(400)
        .json({ message: "Settings already exist. Use PUT to update." });
    }

    const settings = await Settings.create({
      deliveryFee,
      taxRate,
      promos,
    });

    // Log creation
    await createLog({
      user: req.user?._id,
      action: "Create Settings",
      description: `Created initial settings (deliveryFee: ${deliveryFee}, tax: ${taxRate})`,
      ipAddress: req.ip,
      method: req.method,
      endpoint: req.originalUrl,
    });

    res.status(201).json({
      message: "Settings created successfully",
      settings,
    });
  } catch (error) {
    console.error("Error creating settings:", error);
    await createLog({
      user: req.user?._id,
      action: "Create Settings Error",
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
 * @desc Get current app settings
 * @route GET /api/settings
 * @access Public
 */
export const getSettings = async (req, res) => {
  try {
    const settings = await Settings.findOne();
    if (!settings) {
      return res.status(404).json({ message: "Settings not found" });
    }
    res.status(200).json(settings);
  } catch (error) {
    console.error("Error fetching settings:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * @desc Update settings (Admin)
 * @route PUT /api/settings
 * @access Private/Admin
 */
export const updateSettings = async (req, res) => {
  try {
    const { deliveryFee, taxRate, promos } = req.body;

    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({ deliveryFee, taxRate, promos });
    } else {
      if (deliveryFee !== undefined) settings.deliveryFee = deliveryFee;
      if (taxRate !== undefined) settings.taxRate = taxRate;
      if (promos) settings.promos = promos;
      await settings.save();
    }

    await createLog({
      user: req.user?._id,
      action: "Update Settings",
      description: "Admin updated global settings",
      ipAddress: req.ip,
      method: req.method,
      endpoint: req.originalUrl,
    });

    res.status(200).json({ message: "Settings updated successfully", settings });
  } catch (error) {
    console.error("Error updating settings:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

/**
 * @desc Validate promo code
 * @route GET /api/settings/promo/:code
 * @access Public
 */
export const validatePromo = async (req, res) => {
  try {
    const { code } = req.params;
    const settings = await Settings.findOne();
    if (!settings) return res.status(404).json({ message: "Settings not found" });

    const promo = settings.promos.find(
      (p) => p.code.toUpperCase() === code.toUpperCase() && p.isActive
    );

    if (!promo) return res.status(404).json({ message: "Invalid promo code" });
    if (promo.expiresAt && new Date(promo.expiresAt) < new Date()) {
      return res.status(400).json({ message: "Promo code expired" });
    }

    res.status(200).json({
      message: "Promo code valid",
      promo: {
        code: promo.code,
        type: promo.type,
        value: promo.value,
      },
    });
  } catch (error) {
    console.error("Error validating promo:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
