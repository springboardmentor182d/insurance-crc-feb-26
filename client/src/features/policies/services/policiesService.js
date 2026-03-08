import apiClient from '../../../utils/apiClient';

export const fetchPolicies = async ({ search = '', category = '' } = {}) => {
  const params = {};
  if (search) params.search = search;
  if (category && category !== 'ALL') params.category = category;

  const response = await apiClient.get('/api/policies', { params });
  return response.data;
};

export const fetchActivePolicies = async () => {
  const response = await apiClient.get('/api/policies/active');
  return response.data;
};

export const fetchActivePoliciesSummary = async () => {
  const response = await apiClient.get('/api/policies/active/summary');
  return response.data;
};

