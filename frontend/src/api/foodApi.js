import axios from "./axiosInstance";

// ✅ Get all foods
export const getAllFoods = async () => {
  const res = await axios.get("/foods");
  return res.data;
};

// ✅ Get single food by ID
export const getFoodById = async (id) => {
  const res = await axios.get(`/foods/${id}`);
  return res.data;
};

// ✅ Admin: Add new food
export const addFood = async (foodData) => {
  const res = await axios.post("/foods", foodData);
  return res.data;
};

// ✅ Admin: Edit new food
export const editFood = async (id,foodData) => {
  const res = await axios.post(`/foods/${id}`, foodData);
  return res.data;
};

// ✅ Admin: Delete food
export const deleteFood = async (id) => {
  const res = await axios.delete(`/foods/${id}`);
  return res.data;
};
