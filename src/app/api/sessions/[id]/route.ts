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

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const user = await getAuthUser();
        if (!user) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { id: sessionId } = await params;
        const session = await prisma.session.findUnique({
            where: { id: sessionId },
            include: {
                mentor: true,
                learner: true,
            }
        });

        if (!session) {
            return NextResponse.json({ message: "Session not found" }, { status: 404 });
        }

        // Authorization: Only the learner who booked it or the mentor involved can delete it
        const isLearnerOwner = session.learner.userId === user.id;
        const isMentorOwner = session.mentor.userId === user.id;

        if (!isLearnerOwner && !isMentorOwner) {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

        await prisma.session.delete({
            where: { id: sessionId },
        });

        return NextResponse.json({ message: "Session cancelled successfully" }, { status: 200 });

    } catch (error) {
        console.error("Session Delete Error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
