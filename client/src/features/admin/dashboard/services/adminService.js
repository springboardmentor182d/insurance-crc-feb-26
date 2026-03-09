import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
});

export const fetchStats = () => API.get("/admin/stats");
export const fetchClaimsTrends = () => API.get("/admin/claims-trends");
export const fetchRevenue = () => API.get("/admin/revenue");
export const fetchPolicyDistribution = () => API.get("/admin/policy-distribution");
export const fetchTopAdjusters = () => API.get("/admin/top-adjusters");
export const fetchRecentActivity = () => API.get("/admin/recent-activity");
