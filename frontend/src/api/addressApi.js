import axios from "./axiosInstance";


export const getAddress = async () => {
  const res = await axios.get("/addresses");
  return res.data;
};


export const addAdress = async (addressData) => {
  const res = await axios.post("/addresses",  addressData );
  return res.data;
};


export const removeAddress = async (index) => {
  const res = await axios.delete('/addresses', {
    data: { index }, 
  });
  return res.data;
};


export const setDefaultAddress = async (index) => {
  const res = await axios.put(`/addresses/default`,{index});
  return res.data;
};
