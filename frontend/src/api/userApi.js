import axios from "./axiosInstance";

// Register new user
export const registerUser = async (name, email, password) => {
  const res = await axios.post("/users/register", { name, email, password });
  return res.data;
};

// Login existing user
export const loginUser = async (email, password) => {
  const res = await axios.post("/users/login", { email, password });
  return res.data;
};

// Get current logged-in user details (optional)
export const getUserProfile = async () => {
  const res = await axios.get("/users/profile");
  return res.data;
};
