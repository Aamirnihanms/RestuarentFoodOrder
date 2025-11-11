import axios from "./axiosInstance";

// Create new order
export const createOrder = async (selectedItems) => {
  const res = await axios.post("/orders",  selectedItems );
  return res.data;
};

// Get current user's orders
export const getMyOrders = async () => {
  const res = await axios.get("/orders/my");
  return res.data;
};

// Admin: Get all orders
export const getAllOrders = async () => {
  const res = await axios.get("/orders");
  return res.data;
};

// Admin: Update order status
export const updateOrderStatus = async (id, status) => {
  const res = await axios.put(`/orders/${id}`, { status });
  return res.data;
};
