import axios from "./axiosInstance";


export const addReview = async (id,reviewData) => {
  const res = await axios.post(`/foods/${id}/review`, reviewData);
  return res.data;
};