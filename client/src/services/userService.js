import api from './api.js';

const getMyProfile = async () => {
  const response = await api.get('/users/profile');
  return response.data;
};

const updateMyProfile = async (payload) => {
  const response = await api.put('/users/profile', payload);
  return response.data;
};

export { getMyProfile, updateMyProfile };
