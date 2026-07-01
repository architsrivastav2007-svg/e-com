import api from './api.js';

const getProducts = async (params = {}) => {
  const response = await api.get('/products', { params });
  return response.data;
};

const getProductById = async (id) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};

export { getProducts, getProductById };
