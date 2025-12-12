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

        const { id: reviewId } = await params;

        const review = await prisma.review.findUnique({
            where: { id: reviewId },
            include: { learner: true }
        });

        if (!review) {
            return NextResponse.json({ message: "Review not found" }, { status: 404 });
        }

        // Only the author (learner) or admin (not implemented) can delete
        if (review.learner.userId !== user.id) {
            return NextResponse.json({ message: "Forbidden" }, { status: 403 });
        }

        await prisma.review.delete({
            where: { id: reviewId },
        });

        return NextResponse.json({ message: "Review deleted successfully" }, { status: 200 });

    } catch (error) {
        console.error("Review Delete Error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
