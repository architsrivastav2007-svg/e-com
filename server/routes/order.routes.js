import express from 'express';
import {
  cancelOrder,
  getMyOrders,
  getOrderById,
  placeOrder,
  updateOrderStatus,
} from '../controllers/orderController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.post('/', placeOrder);
router.get('/my-orders', getMyOrders);
router.get('/:id', getOrderById);
router.put('/:id/cancel', cancelOrder);
router.put('/:id/status', updateOrderStatus);

export default router;
