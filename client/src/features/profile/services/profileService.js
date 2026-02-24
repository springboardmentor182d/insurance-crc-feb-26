import apiClient from '../../../utils/apiClient';

export const getProfile = async () => {
  const response = await apiClient.get('/api/users/profile');
  return response.data;
};

export const updateProfile = async (profileData) => {
  const response = await apiClient.put('/api/users/profile', profileData);
  return response.data;
};
