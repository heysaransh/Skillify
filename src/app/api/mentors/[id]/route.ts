import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;

        const mentor = await prisma.mentorProfile.findUnique({
            where: { id },
            include: {
                user: { select: { name: true, email: true } },
                skills: true,
                // reviews: true // Assuming we want reviews later, but for now specific relation might be indirect via Sessions.
                // Actually Reviews are on Learner? No, Reviews are on Session. To get reviews for a mentor, we need to query Reviews where Session.mentorId = id.
            },
        });

        if (!mentor) {
            return NextResponse.json({ message: "Mentor not found" }, { status: 404 });
        }

        // Fetch reviews manually to keep query clean or use nested include on sessions
        // Let's do a separate count/avg if not already stored on profile (profile has 'rating' and 'ratingCount' usually, my schema has 'rating')

        return NextResponse.json({ data: mentor });

    } catch (error) {
        console.error("Mentor Detail API Error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
