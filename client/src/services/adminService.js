import api from './api.js';

const uploadAdminProductImages = async (files, onProgress) => {
  const formData = new FormData();

  files.forEach((file) => {
    formData.append('images', file);
  });

  const response = await api.post('/admin/uploads/images', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress: (event) => {
      if (!onProgress || !event.total) {
        return;
      }

      onProgress(Math.round((event.loaded * 100) / event.total));
    },
  });

  return response.data;
};

const deleteAdminProductImage = async (imageUrl) => {
  const response = await api.delete('/admin/uploads/images', {
    data: { imageUrl },
  });

  return response.data;
};

const getAdminDashboard = async () => {
  const response = await api.get('/admin/dashboard');
  return response.data;
};

const getAdminProducts = async (params = {}) => {
  const response = await api.get('/admin/products', { params });
  return response.data;
};

const createAdminProduct = async (payload) => {
  const response = await api.post('/admin/products', payload);
  return response.data;
};

const updateAdminProduct = async (productId, payload) => {
  const response = await api.put(`/admin/products/${productId}`, payload);
  return response.data;
};

const deleteAdminProduct = async (productId) => {
  const response = await api.delete(`/admin/products/${productId}`);
  return response.data;
};

const getAdminOrders = async (params = {}) => {
  const response = await api.get('/admin/orders', { params });
  return response.data;
};

const updateAdminOrder = async (orderId, payload) => {
  const response = await api.put(`/admin/orders/${orderId}`, payload);
  return response.data;
};

const getAdminUsers = async (params = {}) => {
  const response = await api.get('/admin/users', { params });
  return response.data;
};

const updateAdminUser = async (userId, payload) => {
  const response = await api.put(`/admin/users/${userId}`, payload);
  return response.data;
};

const deleteAdminUser = async (userId) => {
  const response = await api.delete(`/admin/users/${userId}`);
  return response.data;
};

export {
  getAdminDashboard,
  getAdminProducts,
  createAdminProduct,
  updateAdminProduct,
  deleteAdminProduct,
  getAdminOrders,
  updateAdminOrder,
  getAdminUsers,
  updateAdminUser,
  deleteAdminUser,
  uploadAdminProductImages,
  deleteAdminProductImage,
};