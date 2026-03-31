import apiClient from "../utils/apiClient";


export const fetchPendingPolicies = async () => {
    const { data } = await apiClient.get("/admin/policy-approvals");
    return data;
};

export const approvePolicy = async (id) => {
    await apiClient.post(`/admin/policy-approvals/${id}/approve`);
};

export const rejectPolicy = async (id) => {
    await apiClient.post(`/admin/policy-approvals/${id}/reject`);
};