import apiClient from "../utils/apiClient";

export const fetchFlaggedClaims = async (params) => {
  const { data } = await apiClient.get("/admin/flagged-claims", { params });
  return data;
};

export const fetchFlaggedClaimsStats = async () => {
  const { data } = await apiClient.get("/admin/flagged-claims/stats");
  return data;
};

export const confirmFraud = async (claimId) => {
  await apiClient.post(`/admin/flagged-claims/${claimId}/confirm-fraud`);
};

export const clearClaim = async (claimId) => {
  await apiClient.post(`/admin/flagged-claims/${claimId}/clear`);
};

export const fetchClaimDetails = async (claimId) => {
  const { data } = await apiClient.get(`/admin/flagged-claims/${claimId}/details`);
  return data;
};