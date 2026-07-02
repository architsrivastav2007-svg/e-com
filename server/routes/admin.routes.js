import express from 'express';
import protect from '../middleware/authMiddleware.js';
import requireAdmin from '../middleware/adminMiddleware.js';
import {
  deleteAdminUser,
  getAdminDashboard,
  getAdminOrders,
  getAdminUsers,
  updateAdminUser,
} from '../controllers/adminController.js';
import { deleteImage, uploadImages } from '../controllers/uploadController.js';
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  updateProduct,
} from '../controllers/productController.js';
import { updateOrderStatus } from '../controllers/orderController.js';
import upload from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.use(protect, requireAdmin);

router.get('/dashboard', getAdminDashboard);

router.post('/uploads/images', upload.array('images', 10), uploadImages);
router.delete('/uploads/images', deleteImage);

router.route('/products').get(getAllProducts).post(createProduct);
router.route('/products/:id').put(updateProduct).delete(deleteProduct);

router.get('/orders', getAdminOrders);
router.put('/orders/:id', updateOrderStatus);

router.get('/users', getAdminUsers);
router.route('/users/:id').put(updateAdminUser).delete(deleteAdminUser);

export default router;