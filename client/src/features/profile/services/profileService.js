import apiClient from '../../../utils/apiClient';

export const getProfile = async () => {
  const response = await apiClient.get('/users/profile');
  return response.data;
};

export const updateProfile = async (profileData) => {
  const response = await apiClient.put('/users/profile', profileData);
  return response.data;
};
