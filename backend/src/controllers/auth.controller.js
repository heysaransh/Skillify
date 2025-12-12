import prisma from '../utils/prisma.js';
import { hashPassword, comparePassword, generateToken } from '../utils/auth.js';

// POST /auth/signup
export const signup = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password || !role) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        if (role !== 'MENTOR' && role !== 'LEARNER') {
            return res.status(400).json({ message: 'Invalid role' });
        }

        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return res.status(409).json({ message: 'User already exists' });
        }

        const hashedPassword = await hashPassword(password);

        // Transaction to ensure user and profile are created together
        const user = await prisma.$transaction(async (tx) => {
            const newUser = await tx.user.create({
                data: {
                    name,
                    email,
                    password: hashedPassword,
                    role,
                },
            });

            if (role === 'MENTOR') {
                await tx.mentorProfile.create({
                    data: {
                        userId: newUser.id,
                        bio: '',
                    },
                });
            } else {
                await tx.learnerProfile.create({
                    data: {
                        userId: newUser.id,
                    },
                });
            }

            return newUser;
        });

        const token = generateToken({ id: user.id, email: user.email, role: user.role });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        return res.status(201).json({
            message: 'User created successfully',
            user: { id: user.id, name: user.name, email: user.email, role: user.role },
        });
    } catch (error) {
        console.error('Signup error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// POST /auth/login
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isMatch = await comparePassword(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = generateToken({ id: user.id, email: user.email, role: user.role });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        return res.status(200).json({
            message: 'Login successful',
            user: { id: user.id, name: user.name, email: user.email, role: user.role },
        });
    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// POST /auth/logout
export const logout = async (req, res) => {
    try {
        res.clearCookie('token');
        return res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        console.error('Logout error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// GET /auth/me
export const getMe = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                mentorProfile: {
                    select: {
                        id: true,
                        bio: true,
                        pricePerHour: true,
                        experience: true,
                        rating: true,
                        skills: true,
                    },
                },
                learnerProfile: {
                    select: {
                        id: true,
                        bio: true,
                        age: true,
                        skillsWanted: true,
                    },
                },
            },
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        return res.status(200).json({ user });
    } catch (error) {
        console.error('Get me error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
