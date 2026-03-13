import express from 'express';
import { addOrderItems, getOrders } from '../controllers/orderController.js';
import { protect, restaurant } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(protect, addOrderItems).get(protect, getOrders);

export default router;
