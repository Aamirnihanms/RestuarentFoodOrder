import User from "../models/user.js";
import { createLog } from "../utils/logger.js";

// ✅ Add new address
export const addAddress = async (req, res) => {
  try {
    const { label, street, city, state, zip, country, phone, isDefault } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) return res.status(404).json({ message: "User not found" });

    if (isDefault) {
      // make all others false if this one is default
      user.addresses.forEach(addr => (addr.isDefault = false));
    }

    const newAddress = { label, street, city, state, zip, country, phone, isDefault };
    user.addresses.push(newAddress);
    await user.save();

    await createLog({
      user: user._id,
      action: "Add Address",
      description: `Added new address (${label}, ${city})`,
      ipAddress: req.ip,
      method: req.method,
      endpoint: req.originalUrl,
    });

    res.status(201).json({ message: "Address added successfully", addresses: user.addresses });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Set default address
export const setDefaultAddress = async (req, res) => {
  try {
    const { index } = req.body; // frontend sends index of address
    const user = await User.findById(req.user._id);

    if (!user || !user.addresses[index]) {
      return res.status(404).json({ message: "Address not found" });
    }

    user.addresses.forEach((addr, i) => (addr.isDefault = i === index));
    await user.save();

    await createLog({
      user: user._id,
      action: "Set Default Address",
      description: `Changed default address to ${user.addresses[index].label}`,
      ipAddress: req.ip,
      method: req.method,
      endpoint: req.originalUrl,
    });

    res.json({ message: "Default address updated", addresses: user.addresses });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Get all addresses
export const getAddresses = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("addresses");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user.addresses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Delete address
export const deleteAddress = async (req, res) => {
  try {
    const { index } = req.body;
    const user = await User.findById(req.user._id);

    if (!user || !user.addresses[index]) {
      return res.status(404).json({ message: "Address not found" });
    }

    user.addresses.splice(index, 1);
    await user.save();

    await createLog({
      user: user._id,
      action: "Delete Address",
      description: `Deleted address at index ${index}`,
      ipAddress: req.ip,
      method: req.method,
      endpoint: req.originalUrl,
    });

    res.json({ message: "Address deleted successfully", addresses: user.addresses });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
