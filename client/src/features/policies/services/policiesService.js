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

export const createExternalActivePolicy = async (payload) => {
  const response = await apiClient.post('/api/policies/active/external', payload);
  return response.data;
};

export const updateActivePolicy = async (activePolicyId, payload) => {
  const response = await apiClient.put(`/api/policies/active/${activePolicyId}`, payload);
  return response.data;
};

export const uploadPolicyDocuments = async (activePolicyId, files) => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append('files', file);
  });

  const response = await apiClient.post(
    `/api/policies/active/${activePolicyId}/documents`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );

  return response.data;
};

export const fetchPolicyDocuments = async (activePolicyId) => {
  const response = await apiClient.get(`/api/policies/active/${activePolicyId}/documents`);
  return response.data;
};

export const downloadPolicyDocument = async (activePolicyId, documentId) => {
  const response = await apiClient.get(
    `/api/policies/active/${activePolicyId}/documents/${documentId}`,
    {
      responseType: 'blob',
    },
  );

  return response.data;
};

export const deleteActivePolicy = async (activePolicyId) => {
  await apiClient.delete(`/api/policies/active/${activePolicyId}`);
};

