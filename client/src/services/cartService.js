import api from './api.js';

const getCart = async () => {
  const response = await api.get('/cart');
  return response.data;
};

const addToCart = async (payload) => {
  const response = await api.post('/cart', payload);
  return response.data;
};

const updateCartItem = async (productId, payload) => {
  const response = await api.put(`/cart/${productId}`, payload);
  return response.data;
};

const removeCartItem = async (productId) => {
  const response = await api.delete(`/cart/${productId}`);
  return response.data;
};

const clearCart = async () => {
  const response = await api.delete('/cart');
  return response.data;
};

export { getCart, addToCart, updateCartItem, removeCartItem, clearCart };
