import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
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

// CRITICAL: CORS must be FIRST middleware
app.use(corsMiddleware);

// Handle preflight requests globally
app.options('*', cors({
    origin: ['https://skillify-rose.vercel.app', 'http://localhost:3000', process.env.FRONTEND_URL].filter(Boolean),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
}));

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Add security headers
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
});

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
    console.log(`404 - Route not found: ${req.method} ${req.path}`);
    res.status(404).json({ message: 'Route not found', path: req.path });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Server error:', err);

    // Handle CORS errors specifically
    if (err.message && err.message.includes('CORS')) {
        return res.status(403).json({ message: 'CORS error', error: err.message });
    }

    res.status(500).json({ message: 'Internal server error' });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Backend server running on port ${PORT}`);
    console.log(`📍 Health check: http://localhost:${PORT}/health`);
    console.log(`🌐 Allowed origins:`, ['https://skillify-rose.vercel.app', 'http://localhost:3000', process.env.FRONTEND_URL].filter(Boolean));
});
