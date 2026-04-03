import apiClient from '../../../utils/apiClient';

export const getPreferences = async () => {
  const response = await apiClient.get('/users/preferences');
  return response.data;
};

export const updatePreferences = async (preferencesData) => {
  const response = await apiClient.put('/users/preferences', preferencesData);
  return response.data;
};
