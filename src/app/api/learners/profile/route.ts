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
        if (!user || user.role !== "LEARNER") {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { bio, age, skillsWanted } = await req.json();

        const updatedProfile = await prisma.learnerProfile.update({
            where: { userId: user.id },
            data: {
                bio,
                age: age ? parseInt(age) : null,
                skillsWanted: skillsWanted || [], // ensuring array
            },
        });

        return NextResponse.json({ message: "Profile updated", data: updatedProfile });

    } catch (error) {
        console.error("Learner Profile Update Error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const user = await getAuthUser();
        if (!user || user.role !== "LEARNER") {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const profile = await prisma.learnerProfile.findUnique({
            where: { userId: user.id },
        });

        return NextResponse.json({ data: profile });
    } catch (error) {
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
