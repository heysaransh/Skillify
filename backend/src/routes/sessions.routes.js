import express from 'express';
import { createSession, getSessions, getSessionById, updateSession, deleteSession } from '../controllers/sessions.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/', authMiddleware, createSession);
router.get('/', authMiddleware, getSessions);
router.get('/:id', authMiddleware, getSessionById);
router.patch('/:id', authMiddleware, updateSession);
router.delete('/:id', authMiddleware, deleteSession);

export default router;
