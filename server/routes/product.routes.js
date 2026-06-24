import express from 'express';
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  updateProduct,
} from '../controllers/productController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(protect, createProduct).get(getAllProducts);
router.route('/:id').get(getProductById).put(protect, updateProduct).delete(protect, deleteProduct);

export default router;
