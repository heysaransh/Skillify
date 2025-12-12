import prisma from '../utils/prisma.js';

// POST /reviews - Create a review for a session
export const createReview = async (req, res) => {
    try {
        const userId = req.user.id;
        const { sessionId, rating, comment } = req.body;

        if (req.user.role !== 'LEARNER') {
            return res.status(403).json({ message: 'Only learners can create reviews' });
        }

        if (!sessionId || !rating) {
            return res.status(400).json({ message: 'Session ID and rating are required' });
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).json({ message: 'Rating must be between 1 and 5' });
        }

        // Verify session exists and belongs to this learner
        const session = await prisma.session.findUnique({
            where: { id: sessionId },
            include: {
                learner: true,
                review: true,
            },
        });

        if (!session) {
            return res.status(404).json({ message: 'Session not found' });
        }

        // Get learner profile
        const learnerProfile = await prisma.learnerProfile.findUnique({
            where: { userId },
        });

        if (!learnerProfile || session.learnerId !== learnerProfile.id) {
            return res.status(403).json({ message: 'You can only review your own sessions' });
        }

        // Check if session is completed
        if (session.status !== 'COMPLETED') {
            return res.status(400).json({ message: 'Can only review completed sessions' });
        }

        // Check if review already exists
        if (session.review) {
            return res.status(409).json({ message: 'Review already exists for this session' });
        }

        // Create review
        const review = await prisma.review.create({
            data: {
                sessionId,
                learnerId: learnerProfile.id,
                rating,
                comment: comment || null,
            },
            include: {
                session: {
                    include: {
                        mentor: {
                            include: {
                                user: { select: { name: true } },
                            },
                        },
                    },
                },
            },
        });

        // Update mentor's average rating
        const mentorId = session.mentorId;
        const reviews = await prisma.review.findMany({
            where: {
                session: {
                    mentorId,
                },
            },
        });

        const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

        await prisma.mentorProfile.update({
            where: { id: mentorId },
            data: { rating: avgRating },
        });

        return res.status(201).json({
            message: 'Review created successfully',
            data: review,
        });
    } catch (error) {
        console.error('Create review error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// GET /reviews - Get reviews (with filters)
export const getReviews = async (req, res) => {
    try {
        const { mentorId, learnerId, sessionId } = req.query;

        let where = {};

        if (sessionId) {
            where.sessionId = sessionId;
        } else if (mentorId) {
            where.session = { mentorId };
        } else if (learnerId) {
            where.learnerId = learnerId;
        }

        const reviews = await prisma.review.findMany({
            where,
            include: {
                learner: {
                    include: {
                        user: { select: { name: true } },
                    },
                },
                session: {
                    include: {
                        mentor: {
                            include: {
                                user: { select: { name: true } },
                            },
                        },
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        return res.status(200).json({ data: reviews });
    } catch (error) {
        console.error('Get reviews error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// DELETE /reviews/:id - Delete a review
export const deleteReview = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        if (req.user.role !== 'LEARNER') {
            return res.status(403).json({ message: 'Only learners can delete reviews' });
        }

        // Find review and verify ownership
        const review = await prisma.review.findUnique({
            where: { id },
            include: {
                learner: true,
                session: {
                    include: {
                        mentor: true,
                    },
                },
            },
        });

        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        // Get learner profile
        const learnerProfile = await prisma.learnerProfile.findUnique({
            where: { userId },
        });

        if (!learnerProfile || review.learnerId !== learnerProfile.id) {
            return res.status(403).json({ message: 'You can only delete your own reviews' });
        }

        // Delete review
        await prisma.review.delete({
            where: { id },
        });

        // Recalculate mentor's average rating
        const mentorId = review.session.mentorId;
        const remainingReviews = await prisma.review.findMany({
            where: {
                session: {
                    mentorId,
                },
            },
        });

        const avgRating = remainingReviews.length > 0
            ? remainingReviews.reduce((sum, r) => sum + r.rating, 0) / remainingReviews.length
            : 0;

        await prisma.mentorProfile.update({
            where: { id: mentorId },
            data: { rating: avgRating },
        });

        return res.status(200).json({ message: 'Review deleted successfully' });
    } catch (error) {
        console.error('Delete review error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
