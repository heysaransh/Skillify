import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { corsMiddleware } from './middleware/cors.middleware.js';

// Import routes
import authRoutes from './routes/auth.routes.js';
import mentorsRoutes from './routes/mentors.routes.js';
import sessionsRoutes from './routes/sessions.routes.js';
import reviewsRoutes from './routes/reviews.routes.js';
import learnersRoutes from './routes/learners.routes.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(corsMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Health check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Backend is running' });
});

// API Routes
app.use('/auth', authRoutes);
app.use('/mentors', mentorsRoutes);
app.use('/sessions', sessionsRoutes);
app.use('/reviews', reviewsRoutes);
app.use('/learners', learnersRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ message: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Backend server running on port ${PORT}`);
    console.log(`📍 Health check: http://localhost:${PORT}/health`);
});
