import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';

// Load environment variables FIRST
dotenv.config();

// Import routes
import authRoutes from './routes/auth.routes.js';
import mentorsRoutes from './routes/mentors.routes.js';
import sessionsRoutes from './routes/sessions.routes.js';
import reviewsRoutes from './routes/reviews.routes.js';
import learnersRoutes from './routes/learners.routes.js';

const app = express();
const PORT = process.env.PORT || 5000;

// ============================================
// CRITICAL: CORS MUST BE FIRST MIDDLEWARE
// ============================================
const allowedOrigins = [
    'https://skillify-rose.vercel.app',
    'http://localhost:3000',
    process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (mobile apps, Postman, curl)
        if (!origin) return callback(null, true);

        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            console.warn(`❌ CORS blocked: ${origin}`);
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    credentials: true,
    optionsSuccessStatus: 204
}));

// Handle ALL preflight requests globally
app.options('*', cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    credentials: true
}));

// ============================================
// OTHER MIDDLEWARE (AFTER CORS)
// ============================================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Add credentials header to all responses
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
});

// ============================================
// ROUTES
// ============================================

// Health check
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        message: 'Backend is running',
        timestamp: new Date().toISOString()
    });
});

// API Routes
app.use('/auth', authRoutes);
app.use('/mentors', mentorsRoutes);
app.use('/sessions', sessionsRoutes);
app.use('/reviews', reviewsRoutes);
app.use('/learners', learnersRoutes);

// ============================================
// ERROR HANDLERS
// ============================================

// 404 handler
app.use((req, res) => {
    console.log(`❌ 404 - Route not found: ${req.method} ${req.path}`);
    res.status(404).json({
        message: 'Route not found',
        path: req.path,
        method: req.method
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('❌ Server error:', err);

    // Handle CORS errors
    if (err.message && err.message.includes('CORS')) {
        return res.status(403).json({
            message: 'CORS error',
            error: err.message,
            origin: req.headers.origin
        });
    }

    res.status(500).json({
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// ============================================
// START SERVER
// ============================================

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Backend server running on port ${PORT}`);
    console.log(`📍 Health check: http://localhost:${PORT}/health`);
    console.log(`🌐 Allowed origins:`, allowedOrigins);
    console.log(`🔒 CORS credentials: enabled`);
    console.log(`⚙️  Environment: ${process.env.NODE_ENV || 'development'}`);
});
