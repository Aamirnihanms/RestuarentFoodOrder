import User from "../models/user.js";
import generateToken from "../utils/generateToken.js";
import { createLog } from "../utils/logger.js"; // ✅ Import logger utility

// ------------------------ REGISTER ------------------------
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      await createLog({
        action: "User Registration",
        description: `Registration failed — Email already exists: ${email}`,
        ipAddress: req.ip,
        method: req.method,
        endpoint: req.originalUrl,
        status: "failed",
      });

      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({ name, email: email.toLowerCase().trim(), password });

    await createLog({
      user: user._id,
      action: "User Registration",
      description: `New user registered successfully (${user.email})`,
      ipAddress: req.ip,
      method: req.method,
      endpoint: req.originalUrl,
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    await createLog({
      action: "User Registration Error",
      description: error.message,
      ipAddress: req.ip,
      method: req.method,
      endpoint: req.originalUrl,
      status: "failed",
    });
    res.status(500).json({ message: error.message });
  }
};

// ------------------------ LOGIN ------------------------
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (user && (await user.matchPassword(password))) {
      if (!user.isActive || user.isDeleted) {
        await createLog({
          user: user._id,
          action: "User Login Attempt",
          description: `Login failed — Account disabled or deleted (${email})`,
          ipAddress: req.ip,
          method: req.method,
          endpoint: req.originalUrl,
          status: "failed",
        });

        return res.status(403).json({ message: "Account disabled or deleted" });
      }

      await createLog({
        user: user._id,
        action: "User Login",
        description: `User ${user.name} logged in successfully`,
        ipAddress: req.ip,
        method: req.method,
        endpoint: req.originalUrl,
      });

    
      const defaultAddress = user.addresses?.find(addr => addr.isDefault) || null;

      res.json({
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          address: defaultAddress, 
        },
        token: generateToken(user._id),
      });

    } else {
      await createLog({
        action: "User Login Attempt",
        description: `Invalid credentials for ${email}`,
        ipAddress: req.ip,
        method: req.method,
        endpoint: req.originalUrl,
        status: "failed",
      });

      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    await createLog({
      action: "User Login Error",
      description: error.message,
      ipAddress: req.ip,
      method: req.method,
      endpoint: req.originalUrl,
      status: "failed",
    });

    res.status(500).json({ message: error.message });
  }
};
