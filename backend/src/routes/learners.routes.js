import express from 'express';
import { updateLearnerProfile, getLearnerProfile } from '../controllers/learners.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/profile', authMiddleware, getLearnerProfile);
router.put('/profile', authMiddleware, updateLearnerProfile);

export default router;
