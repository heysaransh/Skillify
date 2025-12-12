import prisma from '../utils/prisma.js';

// POST /sessions - Book a session
export const createSession = async (req, res) => {
    try {
        const userId = req.user.id;
        const { mentorId, date } = req.body;

        if (req.user.role !== 'LEARNER') {
            return res.status(403).json({ message: 'Only learners can book sessions' });
        }

        if (!mentorId || !date) {
            return res.status(400).json({ message: 'Mentor ID and date are required' });
        }

        // Verify mentor exists
        const mentor = await prisma.mentorProfile.findUnique({
            where: { id: mentorId },
        });

        if (!mentor) {
            return res.status(404).json({ message: 'Mentor not found' });
        }

        // Find learner profile
        const learnerProfile = await prisma.learnerProfile.findUnique({
            where: { userId },
        });

        if (!learnerProfile) {
            return res.status(404).json({ message: 'Learner profile not found' });
        }

        // Create session
        const session = await prisma.session.create({
            data: {
                mentorId,
                learnerId: learnerProfile.id,
                date: new Date(date),
                status: 'CONFIRMED',
            },
        });

        return res.status(201).json({
            message: 'Session booked successfully',
            data: session
        });
    } catch (error) {
        console.error('Create session error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// GET /sessions - Get user's sessions with pagination and filters
export const getSessions = async (req, res) => {
    try {
        const userId = req.user.id;
        const role = req.user.role;
        const {
            page = 1,
            limit = 10,
            status,
            startDate,
            endDate,
        } = req.query;

        const skip = (parseInt(page) - 1) * parseInt(limit);

        let where = {};

        if (role === 'MENTOR') {
            const mentorProfile = await prisma.mentorProfile.findUnique({
                where: { userId }
            });
            if (!mentorProfile) return res.status(200).json({ data: [], meta: { total: 0, page: 1, limit: 10, totalPages: 0 } });
            where.mentorId = mentorProfile.id;
        } else {
            const learnerProfile = await prisma.learnerProfile.findUnique({
                where: { userId }
            });
            if (!learnerProfile) return res.status(200).json({ data: [], meta: { total: 0, page: 1, limit: 10, totalPages: 0 } });
            where.learnerId = learnerProfile.id;
        }

        // Add status filter
        if (status) {
            where.status = status;
        }

        // Add date range filter
        if (startDate || endDate) {
            where.date = {};
            if (startDate) where.date.gte = new Date(startDate);
            if (endDate) where.date.lte = new Date(endDate);
        }

        const [sessions, total] = await prisma.$transaction([
            prisma.session.findMany({
                where,
                take: parseInt(limit),
                skip,
                include: {
                    mentor: {
                        include: {
                            user: { select: { name: true, email: true } },
                        },
                    },
                    learner: {
                        include: {
                            user: { select: { name: true, email: true } },
                        },
                    },
                    review: true,
                },
                orderBy: { date: 'asc' },
            }),
            prisma.session.count({ where }),
        ]);

        return res.status(200).json({
            data: sessions,
            meta: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(total / parseInt(limit)),
            },
        });
    } catch (error) {
        console.error('Get sessions error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// GET /sessions/:id - Get session by ID
export const getSessionById = async (req, res) => {
    try {
        const { id } = req.params;

        const session = await prisma.session.findUnique({
            where: { id },
            include: {
                mentor: {
                    include: {
                        user: { select: { name: true, email: true } },
                    },
                },
                learner: {
                    include: {
                        user: { select: { name: true, email: true } },
                    },
                },
                review: true,
            },
        });

        if (!session) {
            return res.status(404).json({ message: 'Session not found' });
        }

        return res.status(200).json({ data: session });
    } catch (error) {
        console.error('Get session by ID error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// PATCH /sessions/:id - Update session status
export const updateSession = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({ message: 'Status is required' });
        }

        const validStatuses = ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        // Find session and verify ownership
        const session = await prisma.session.findUnique({
            where: { id },
            include: {
                mentor: true,
                learner: true,
            },
        });

        if (!session) {
            return res.status(404).json({ message: 'Session not found' });
        }

        // Verify user is part of this session
        let isAuthorized = false;
        if (req.user.role === 'MENTOR') {
            const mentorProfile = await prisma.mentorProfile.findUnique({ where: { userId } });
            isAuthorized = mentorProfile && session.mentorId === mentorProfile.id;
        } else {
            const learnerProfile = await prisma.learnerProfile.findUnique({ where: { userId } });
            isAuthorized = learnerProfile && session.learnerId === learnerProfile.id;
        }

        if (!isAuthorized) {
            return res.status(403).json({ message: 'You can only update your own sessions' });
        }

        // Update session
        const updatedSession = await prisma.session.update({
            where: { id },
            data: { status },
            include: {
                mentor: {
                    include: {
                        user: { select: { name: true, email: true } },
                    },
                },
                learner: {
                    include: {
                        user: { select: { name: true, email: true } },
                    },
                },
            },
        });

        return res.status(200).json({
            message: 'Session updated successfully',
            data: updatedSession,
        });
    } catch (error) {
        console.error('Update session error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// DELETE /sessions/:id - Cancel/delete a session
export const deleteSession = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        // Find session and verify ownership
        const session = await prisma.session.findUnique({
            where: { id },
            include: {
                mentor: true,
                learner: true,
                review: true,
            },
        });

        if (!session) {
            return res.status(404).json({ message: 'Session not found' });
        }

        // Verify user is part of this session
        let isAuthorized = false;
        if (req.user.role === 'MENTOR') {
            const mentorProfile = await prisma.mentorProfile.findUnique({ where: { userId } });
            isAuthorized = mentorProfile && session.mentorId === mentorProfile.id;
        } else {
            const learnerProfile = await prisma.learnerProfile.findUnique({ where: { userId } });
            isAuthorized = learnerProfile && session.learnerId === learnerProfile.id;
        }

        if (!isAuthorized) {
            return res.status(403).json({ message: 'You can only delete your own sessions' });
        }

        // Don't allow deletion of completed sessions with reviews
        if (session.status === 'COMPLETED' && session.review) {
            return res.status(400).json({ message: 'Cannot delete completed sessions with reviews' });
        }

        // Delete session (cascade will delete review if exists)
        await prisma.session.delete({
            where: { id },
        });

        return res.status(200).json({ message: 'Session deleted successfully' });
    } catch (error) {
        console.error('Delete session error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
