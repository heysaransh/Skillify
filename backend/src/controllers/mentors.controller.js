import prisma from '../utils/prisma.js';

// GET /mentors - List all mentors with filters
export const getMentors = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            search = '',
            minPrice = 0,
            maxPrice = 10000,
            rating = 0,
            experience = 0,
            sort = 'rating_desc',
        } = req.query;

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const where = {
            pricePerHour: {
                gte: parseFloat(minPrice),
                lte: parseFloat(maxPrice),
            },
            rating: {
                gte: parseFloat(rating),
            },
            experience: {
                gte: parseInt(experience),
            },
            ...(search && {
                OR: [
                    {
                        user: {
                            name: {
                                contains: search,
                                mode: 'insensitive',
                            },
                        },
                    },
                    {
                        bio: {
                            contains: search,
                            mode: 'insensitive',
                        },
                    },
                ],
            }),
        };

        let orderBy = {};
        if (sort === 'rating_desc') orderBy = { rating: 'desc' };
        else if (sort === 'price_asc') orderBy = { pricePerHour: 'asc' };
        else if (sort === 'price_desc') orderBy = { pricePerHour: 'desc' };
        else if (sort === 'experience_desc') orderBy = { experience: 'desc' };
        else orderBy = { rating: 'desc' };

        const [mentors, total] = await prisma.$transaction([
            prisma.mentorProfile.findMany({
                where,
                take: parseInt(limit),
                skip,
                orderBy,
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                },
            }),
            prisma.mentorProfile.count({ where }),
        ]);

        // Transform skills array to objects for frontend compatibility
        const transformedMentors = mentors.map(mentor => ({
            ...mentor,
            skills: mentor.skills.map(skill => ({ name: skill })),
        }));

        return res.status(200).json({
            data: transformedMentors,
            meta: {
                total,
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages: Math.ceil(total / parseInt(limit)),
            },
        });
    } catch (error) {
        console.error('Get mentors error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// GET /mentors/:id - Get single mentor
export const getMentorById = async (req, res) => {
    try {
        const { id } = req.params;

        const mentor = await prisma.mentorProfile.findUnique({
            where: { id },
            include: {
                user: { select: { name: true, email: true } },
            },
        });

        if (!mentor) {
            return res.status(404).json({ message: 'Mentor not found' });
        }

        // Transform skills
        const transformedMentor = {
            ...mentor,
            skills: mentor.skills.map(skill => ({ name: skill })),
        };

        return res.status(200).json({ data: transformedMentor });
    } catch (error) {
        console.error('Get mentor by ID error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// PUT /mentors/profile - Update mentor profile (FIXED!)
export const updateMentorProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { bio, pricePerHour, experience, skills } = req.body;

        if (req.user.role !== 'MENTOR') {
            return res.status(403).json({ message: 'Only mentors can update mentor profiles' });
        }

        // Validate skills is an array of strings
        let skillsArray = [];
        if (skills && Array.isArray(skills)) {
            // Handle both string[] and {name: string}[] formats
            skillsArray = skills.map(skill =>
                typeof skill === 'string' ? skill : skill.name
            );
        }

        // Update the mentor profile - THIS IS THE FIX!
        const updatedProfile = await prisma.mentorProfile.update({
            where: { userId },
            data: {
                bio: bio || undefined,
                pricePerHour: pricePerHour ? parseFloat(pricePerHour) : undefined,
                experience: experience ? parseInt(experience) : undefined,
                skills: skillsArray.length > 0 ? skillsArray : undefined, // Direct array update
            },
        });

        // Transform for response
        const response = {
            ...updatedProfile,
            skills: updatedProfile.skills.map(skill => ({ name: skill })),
        };

        return res.status(200).json({
            message: 'Profile updated successfully',
            data: response
        });
    } catch (error) {
        console.error('Update mentor profile error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// GET /mentors/profile - Get current mentor's profile
export const getMentorProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        if (req.user.role !== 'MENTOR') {
            return res.status(403).json({ message: 'Only mentors can access mentor profiles' });
        }

        const profile = await prisma.mentorProfile.findUnique({
            where: { userId },
            include: {
                user: {
                    select: {
                        name: true,
                        email: true,
                    },
                },
            },
        });

        if (!profile) {
            return res.status(404).json({ message: 'Mentor profile not found' });
        }

        // Transform skills
        const response = {
            ...profile,
            skills: profile.skills.map(skill => ({ name: skill })),
        };

        return res.status(200).json({ data: response });
    } catch (error) {
        console.error('Get mentor profile error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
