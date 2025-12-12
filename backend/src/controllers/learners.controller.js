import prisma from '../utils/prisma.js';

// PUT /learners/profile - Update learner profile
export const updateLearnerProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { bio, age, skillsWanted } = req.body;

        if (req.user.role !== 'LEARNER') {
            return res.status(403).json({ message: 'Only learners can update learner profiles' });
        }

        // Validate skillsWanted is an array of strings
        let skillsArray = [];
        if (skillsWanted && Array.isArray(skillsWanted)) {
            skillsArray = skillsWanted.map(skill =>
                typeof skill === 'string' ? skill : skill.name || skill
            );
        }

        // Update the learner profile
        const updatedProfile = await prisma.learnerProfile.update({
            where: { userId },
            data: {
                bio: bio !== undefined ? bio : undefined,
                age: age ? parseInt(age) : undefined,
                skillsWanted: skillsArray.length > 0 ? skillsArray : undefined,
            },
        });

        return res.status(200).json({
            message: 'Profile updated successfully',
            data: updatedProfile
        });
    } catch (error) {
        console.error('Update learner profile error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// GET /learners/profile - Get current learner's profile
export const getLearnerProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        if (req.user.role !== 'LEARNER') {
            return res.status(403).json({ message: 'Only learners can access learner profiles' });
        }

        const profile = await prisma.learnerProfile.findUnique({
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
            return res.status(404).json({ message: 'Learner profile not found' });
        }

        return res.status(200).json({ data: profile });
    } catch (error) {
        console.error('Get learner profile error:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
