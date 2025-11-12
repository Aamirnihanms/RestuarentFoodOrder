import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import foodRoutes from "./routes/foodRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import adminUserRoutes from "./routes/adminUserRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import logRoutes from "./routes/logRoutes.js";
import settingsRoute from "./routes/settingsRoute.js";
import addressRoutes from "./routes/addressRoutes.js";
import cors from "cors";



dotenv.config();
connectDB();

const app = express();
app.use(cors());

app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/foods", foodRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/admin/users", adminUserRoutes);
app.use("/api/admin/review", reviewRoutes);
app.use("/api/admin/logs", logRoutes);
app.use("/api/settings", settingsRoute);
app.use("/api/addresses", addressRoutes);



export default app;