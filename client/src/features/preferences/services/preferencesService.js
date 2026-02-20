import apiClient from 'utils/apiClient';

export const getPreferences = async () => {
  const response = await apiClient.get('/api/users/preferences');
  return response.data;
};

export const updatePreferences = async (preferencesData) => {
  const response = await apiClient.put('/api/users/preferences', preferencesData);
  return response.data;
};
