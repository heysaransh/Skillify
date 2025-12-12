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

export async function POST(req: Request) {
    try {
        const user = await getAuthUser();
        if (!user || user.role !== "LEARNER") {
            return NextResponse.json({ message: "Only learners can book sessions" }, { status: 403 });
        }

        const { mentorId, date } = await req.json();

        if (!mentorId || !date) {
            return NextResponse.json({ message: "Mentor ID and Date are required" }, { status: 400 });
        }

        // Verify mentor exists
        const mentor = await prisma.mentorProfile.findUnique({
            where: { id: mentorId }
        });

        if (!mentor) {
            return NextResponse.json({ message: "Mentor not found" }, { status: 404 });
        }

        // Find Learner Profile ID
        const learnerProfile = await prisma.learnerProfile.findUnique({
            where: { userId: user.id }
        });

        if (!learnerProfile) {
            return NextResponse.json({ message: "Learner profile not found" }, { status: 404 });
        }

        // Create session
        const session = await prisma.session.create({
            data: {
                mentorId,
                learnerId: learnerProfile.id,
                date: new Date(date),
                status: "CONFIRMED", // Auto-confirming for MVP, usually PENDING
            },
        });

        return NextResponse.json({ message: "Session booked successfully", data: session }, { status: 201 });

    } catch (error) {
        console.error("Session Booking Error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const user = await getAuthUser();
        if (!user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        // Build query based on role
        let where = {};
        if (user.role === "MENTOR") {
            const mentorProfile = await prisma.mentorProfile.findUnique({ where: { userId: user.id } });
            if (!mentorProfile) return NextResponse.json({ data: [] });
            where = { mentorId: mentorProfile.id };
        } else {
            const learnerProfile = await prisma.learnerProfile.findUnique({ where: { userId: user.id } });
            if (!learnerProfile) return NextResponse.json({ data: [] });
            where = { learnerId: learnerProfile.id };
        }

        const sessions = await prisma.session.findMany({
            where,
            include: {
                mentor: {
                    include: {
                        user: { select: { name: true, email: true } }
                    }
                },
                learner: {
                    include: {
                        user: { select: { name: true, email: true } }
                    }
                }
            },
            orderBy: { date: 'asc' }
        });

        return NextResponse.json({ data: sessions });
    } catch (error) {
        console.error("Session List Error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
