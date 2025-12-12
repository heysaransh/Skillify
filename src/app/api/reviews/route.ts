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
            return NextResponse.json({ message: "Only learners can write reviews" }, { status: 403 });
        }

        const { sessionId, rating, comment } = await req.json();

        if (!sessionId || !rating) {
            return NextResponse.json({ message: "Session ID and Rating are required" }, { status: 400 });
        }

        // Verify Session
        const session = await prisma.session.findUnique({
            where: { id: sessionId },
            include: { learner: true }
        });

        if (!session) {
            return NextResponse.json({ message: "Session not found" }, { status: 404 });
        }

        if (session.learner.userId !== user.id) {
            return NextResponse.json({ message: "You can only review your own sessions" }, { status: 403 });
        }

        // Check if check already exists
        const existingReview = await prisma.review.findUnique({
            where: { sessionId }
        });

        if (existingReview) {
            return NextResponse.json({ message: "Review already exists for this session" }, { status: 409 });
        }

        const review = await prisma.review.create({
            data: {
                sessionId,
                learnerId: session.learnerId,
                rating: parseInt(rating),
                comment,
            },
        });

        // Update Mentor Average Rating (Optional but good for real app)
        // skipping for MVP speed unless requested

        return NextResponse.json({ message: "Review created successfully", data: review }, { status: 201 });

    } catch (error) {
        console.error("Review Creation Error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
