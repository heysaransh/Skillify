import express from 'express';
import {
    getMentors,
    getMentorById,
    updateMentorProfile,
    getMentorProfile,
} from '../controllers/mentors.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', getMentors);
router.get('/profile', authMiddleware, getMentorProfile);
router.put('/profile', authMiddleware, updateMentorProfile);
router.get('/:id', getMentorById);

export default router;
