import express from 'express';
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  updateProduct,
} from '../controllers/productController.js';
import protect from '../middleware/authMiddleware.js';
import requireAdmin from '../middleware/adminMiddleware.js';

const router = express.Router();

router.route('/').post(protect, requireAdmin, createProduct).get(getAllProducts);
router.route('/:id').get(getProductById).put(protect, requireAdmin, updateProduct).delete(protect, requireAdmin, deleteProduct);

export default router;
