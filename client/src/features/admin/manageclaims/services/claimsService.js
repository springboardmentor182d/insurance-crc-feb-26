import apiClient from '../../../../utils/apiClient';

export const fetchClaims = async ({ status = '' } = {}) => {
  const params = {};
  if (status && status !== 'all') params.status = status;

  const response = await apiClient.get('/admin/claims', { params });
  return response.data;
};

export const fetchClaimDetail = async (claimId) => {
  const response = await apiClient.get(`/admin/claims/${claimId}`);
  return response.data;
};

export const updateClaimStatus = async (claimId, { status, review_notes }) => {
  const response = await apiClient.patch(`/admin/claims/${claimId}/status`, {
    status,
    review_notes,
  });
  return response.data;
};
