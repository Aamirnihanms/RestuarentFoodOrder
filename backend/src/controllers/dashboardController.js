import User from "../models/user.js";
import Food from "../models/food.js";
import Order from "../models/order.js";

/**
 * @desc Get overall dashboard statistics
 * @route GET /api/dashboard
 * @access Private/Admin
 */
export const getDashboardData = async (req, res) => {
  try {
    // ✅ Count metrics
    const totalUsers = await User.countDocuments();
    const totalFoods = await Food.countDocuments();
    const totalOrders = await Order.countDocuments();

    // ✅ Calculate total revenue
    const revenueData = await Order.aggregate([
      { $group: { _id: null, total: { $sum: "$totalPrice" } } },
    ]);
    const totalRevenue = revenueData[0]?.total || 0;

    // ✅ Group orders by status
    const ordersByStatus = await Order.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    // ✅ Optional: Monthly revenue trend (for charts)
    const monthlyRevenue = await Order.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          totalRevenue: { $sum: "$totalPrice" },
        },
      },
      { $sort: { "_id": 1 } },
    ]);

    // ✅ Response
    res.status(200).json({
      totalUsers,
      totalFoods,
      totalOrders,
      totalRevenue,
      ordersByStatus: ordersByStatus.map((item) => ({
        status: item._id,
        count: item.count,
      })),
      monthlyRevenue: monthlyRevenue.map((item) => ({
        month: item._id,
        totalRevenue: item.totalRevenue,
      })),
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
