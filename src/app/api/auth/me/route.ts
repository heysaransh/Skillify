import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function GET() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const decoded = verifyToken(token);

        if (!decoded || typeof decoded === "string") {
            return NextResponse.json(
                { message: "Invalid token" },
                { status: 401 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { id: (decoded as any).id }, // Type assertion for now, should use interface
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                mentorProfile: true, // Include profile data if needed
                learnerProfile: true
            }
        });

        if (!user) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ user }, { status: 200 });

    } catch (error) {
        console.error("Me API error:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
