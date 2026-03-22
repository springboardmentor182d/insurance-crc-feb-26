import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
});

export const getPolicies = async () => {
  const res = await API.get("/admin/policies");
  return res.data.data;
};

export const getPolicyStats = async () => {
  const res = await API.get("/admin/policies/stats");
  return res.data.data;
};

export const createPolicy = async (data) => {
  const res = await API.post("/admin/policies", data);
  return res.data.data;
};

export const deletePolicy = async (id) => {
  await API.delete(`/admin/policies/${id}`);
};

export const getPolicyById = async (id) => {
  const res = await API.get(`/admin/policies/${id}`);
  return res.data.data;
};

export const updatePolicy = async (id, data) => {
  const res = await API.put(`/admin/policies/${id}`, data);
  return res.data.data;
};
