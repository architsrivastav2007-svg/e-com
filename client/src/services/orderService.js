import api from './api.js';

const placeOrder = async (payload) => {
  const response = await api.post('/orders', payload);
  return response.data;
};

const getMyOrders = async () => {
  const response = await api.get('/orders/my-orders');
  return response.data;
};

const getOrderById = async (orderId) => {
  const response = await api.get(`/orders/${orderId}`);
  return response.data;
};

const cancelOrder = async (orderId) => {
  const response = await api.put(`/orders/${orderId}/cancel`);
  return response.data;
};

export { placeOrder, getMyOrders, getOrderById, cancelOrder };
