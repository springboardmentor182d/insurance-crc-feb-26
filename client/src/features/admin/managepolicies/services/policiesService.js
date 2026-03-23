import apiClient from "../../../../utils/apiClient";

export const getPolicies = async () => {
  const res = await apiClient.get("/admin/policies");
  const payload = res.data?.data ?? res.data;
  return Array.isArray(payload) ? payload : [];
};

export const getPolicyStats = async () => {
  const res = await apiClient.get("/admin/policies/stats");
  const payload = res.data?.data ?? res.data;
  return payload && typeof payload === "object" ? payload : {};
};

export const createPolicy = async (data) => {
  const payload = {
    ...data,
    premium: Number(data.premium),
    coverage: Number(data.coverage),
    deductible: Number(data.deductible),
  };
  const res = await apiClient.post("/admin/policies", payload);
  return res.data.data;
};

export const deletePolicy = async (id) => {
  await apiClient.delete(`/admin/policies/${id}`);
};

export const getPolicyById = async (id) => {
  const res = await apiClient.get(`/admin/policies/${id}`);
  return res.data.data;
};

export const updatePolicy = async (id, data) => {
  const res = await apiClient.put(`/admin/policies/${id}`, data);
  return res.data.data;
};
