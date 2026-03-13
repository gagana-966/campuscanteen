import express from 'express';
import {
    getFoodItems,
    createFoodItem,
    updateFoodItem,
    deleteFoodItem,
} from '../controllers/foodController.js';
import { protect, restaurant } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').get(getFoodItems).post(protect, restaurant, createFoodItem);
router
    .route('/:id')
    .put(protect, restaurant, updateFoodItem)
    .delete(protect, restaurant, deleteFoodItem);

export default router;
