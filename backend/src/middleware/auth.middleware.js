import { verifyToken } from '../utils/auth.js';

export const authMiddleware = (req, res, next) => {
    try {
        // Check for token in cookies or Authorization header
        const token = req.cookies?.token || req.headers.authorization?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({ message: 'Unauthorized - No token provided' });
        }

        const decoded = verifyToken(token);

        if (!decoded) {
            return res.status(401).json({ message: 'Unauthorized - Invalid token' });
        }

        // Attach user info to request
        req.user = decoded;
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        return res.status(401).json({ message: 'Unauthorized' });
    }
};

export const requireRole = (role) => {
    return (req, res, next) => {
        if (req.user.role !== role) {
            return res.status(403).json({ message: `Access denied. ${role} role required.` });
        }
        next();
    };
};
