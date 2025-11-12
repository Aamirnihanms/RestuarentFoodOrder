import axios from "./axiosInstance";


export const getDashboardData = async () => {
  const res = await axios.get("/dashboard");
  return res.data;
};



export const getAllUsersData = async () => {
  const res = await axios.get("/admin/users");
  return res.data;
};

export const softDeleteUserData = async (id) => {
  const res = await axios.put(`/admin/users/${id}/delete`);
  return res.data;
};


export const restoreUserData = async (id) => {
  const res = await axios.put(`/admin/users/${id}/restore`);
  return res.data;
};


export const getReviewData = async () => {
  const res = await axios.get("/admin/review/analytics");
  return res.data;
};


export const getLogData = async () => {
  const res = await axios.get("/admin/logs");
  return res.data;
};


export const deleteLogData = async () => {
  const res = await axios.delete("/admin/logs");
  return res.data;
};


export const deleteFoodReview = async (id,reviewId) => {
  const res = await axios.delete(`foods/${id}/review/${reviewId}`);
  return res.data;
};

export const createSettings = async (data) => {
  const res = await axios.post("/settings",data);
  return res.data;
};


export const getSettings = async () => {
  const res = await axios.get("/settings");
  return res.data;
};


export const validatePromoCode = async (code) => {
  const res = await axios.get(`/settings/promo/${code}`);
  return res.data;
};

export const updateSettings = async (data) => {
  const res = await axios.put("/settings", data);
  return res.data;
};


