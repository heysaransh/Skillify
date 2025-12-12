import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";
import { cookies } from "next/headers";

async function getAuthUser() {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return null;
    const decoded = verifyToken(token);
    if (!decoded || typeof decoded === "string") return null;
    return decoded as { id: string; role: string };
}

export async function PUT(req: Request) {
    try {
        const user = await getAuthUser();
        if (!user || user.role !== "MENTOR") {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { bio, pricePerHour, experience, skills } = await req.json();

        // Update Mentor Profile
        // We need to find the profile associated with the user first
        // Actually, update based on userId is safer

        // Transaction to update profile and sync skills
        const updatedProfile = await prisma.$transaction(async (tx) => {
            // 1. Update basic fields
            const profile = await tx.mentorProfile.update({
                where: { userId: user.id },
                data: {
                    bio,
                    pricePerHour: parseFloat(pricePerHour),
                    experience: parseInt(experience),
                },
            });

            // 2. Sync Skills
            if (skills && Array.isArray(skills)) {
                // Delete all existing skills
                await tx.skill.deleteMany({
                    where: { mentorProfileId: profile.id },
                });

                // Create new skills
                if (skills.length > 0) {
                    await tx.skill.createMany({
                        data: skills.map((name: string) => ({
                            name,
                            mentorProfileId: profile.id,
                        })),
                    });
                }
            }

            return profile;
        });

        return NextResponse.json({ message: "Profile updated", data: updatedProfile });

    } catch (error) {
        console.error("Mentor Profile Update Error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const user = await getAuthUser();
        if (!user || user.role !== "MENTOR") {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const profile = await prisma.mentorProfile.findUnique({
            where: { userId: user.id },
            include: { skills: true }
        });

        return NextResponse.json({ data: profile });
    } catch (error) {
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
