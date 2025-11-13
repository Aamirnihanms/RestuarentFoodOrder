import axios from "./axiosInstance";

export const confirmEmployeeOrder = async (id) => {
  const res = await axios.put(`/orders/${id}/confirm`,);
  return res.data;
};


export const getEmployeeOrders = async () => {
  const res = await axios.get("/orders/employee");
  return res.data;
};



export const completeEmployeeOrder = async (id,pin) => {
  const res = await axios.post(`/orders/${id}/deliver`,{pin});
  return res.data;
};