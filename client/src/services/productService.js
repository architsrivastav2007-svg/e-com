import api from './api.js';

const getProducts = async () => {
  const response = await api.get('/products');
  return response.data;
};

const getProductById = async (id) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};

export { getProducts, getProductById };
