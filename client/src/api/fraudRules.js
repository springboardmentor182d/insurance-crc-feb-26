import apiClient from "../utils/apiClient";

export const fetchFraudRules = async () => {
  const { data } = await apiClient.get("/admin/fraud-rules");
  return data;
};

export const createFraudRule = async (payload) => {
  const { data } = await apiClient.post("/admin/fraud-rules", payload);
  return data;
};

export const updateFraudRule = async ({ id, payload }) => {
  const { data } = await apiClient.put(`/admin/fraud-rules/${id}`, payload);
  return data;
};

export const deleteFraudRule = async (id) => {
  const { data } = await apiClient.delete(`/admin/fraud-rules/${id}`);
  return data;
};

export const toggleFraudRule = async ({ id, is_active }) => {
  const { data } = await apiClient.patch(
    `/admin/fraud-rules/${id}/toggle`,
    { is_active }
  );
  return data;
};