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