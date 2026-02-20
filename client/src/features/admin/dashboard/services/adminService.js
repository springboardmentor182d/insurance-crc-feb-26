import apiClient from "../../../../utils/apiClient";

export const fetchStats = () => apiClient.get("/admin/stats");
export const fetchClaimsTrends = () => apiClient.get("/admin/claims-trends");
export const fetchRevenue = () => apiClient.get("/admin/revenue");
export const fetchPolicyDistribution = () => apiClient.get("/admin/policy-distribution");
export const fetchTopAdjusters = () => apiClient.get("/admin/top-adjusters");
export const fetchRecentActivity = () => apiClient.get("/admin/recent-activity");
