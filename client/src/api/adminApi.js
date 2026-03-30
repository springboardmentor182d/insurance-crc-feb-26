import apiClient from "../utils/apiClient";

/* =========================
   📊 ANALYTICS
========================= */

export const getClaimsTrends = async () => {
    const { data } = await apiClient.get("/admin/claims-trends");
    return data;
};

/* =========================
   💰 REVENUE
========================= */

export const fetchRevenue = async () => {
    const { data } = await apiClient.get("/admin/revenue");
    return data;
};

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