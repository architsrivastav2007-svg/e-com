import api from './api.js';

const getRecommendations = async (productId) => {
  const response = await api.get(`/recommendations/${productId}`);
  return response.data;
};

export { getRecommendations };
