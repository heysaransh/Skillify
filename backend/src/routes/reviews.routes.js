import express from 'express';
import { createReview, getReviews, deleteReview } from '../controllers/reviews.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/', authMiddleware, createReview);
router.get('/', getReviews);
router.delete('/:id', authMiddleware, deleteReview);

export default router;
