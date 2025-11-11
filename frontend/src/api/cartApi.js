import axios from "./axiosInstance";

// Get current user’s cart
export const getCart = async () => {
  const res = await axios.get("/cart");
  return res.data;
};

// Add item to cart
export const addToCart = async (foodData) => {
  const res = await axios.post("/cart/add", { foodData });
  return res.data;
};

// Remove item from cart
export const removeFromCart = async (foodId) => {
  const res = await axios.delete(`/cart/${foodId}`);
  return res.data;
};
