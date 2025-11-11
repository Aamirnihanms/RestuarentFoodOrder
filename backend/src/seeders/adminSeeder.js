import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import connectDB from "../config/db.js";
import User from "../models/user.js";

dotenv.config();
await connectDB();

const seedAdmin = async () => {
  try {
   
    await User.deleteMany({ role: "admin" });

    const admin = await User.create({
      name: "Aamir Admin",
      email: "admin@foodiehub.dev",
      password: "admin@123",
      role: "admin",
      cart: [],
    });

    console.log("✅ Admin user created:", admin.email);
    process.exit();
  } catch (error) {
    console.error("❌ Error seeding admin:", error.message);
    process.exit(1);
  }
};

seedAdmin();
