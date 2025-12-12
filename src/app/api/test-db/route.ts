import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        await prisma.$connect();
        const userCount = await prisma.user.count();
        return NextResponse.json({ status: "ok", message: "Database connected", userCount });
    } catch (error: any) {
        console.error("Database connection error:", error);
        return NextResponse.json({ status: "error", message: error.message, error: String(error) }, { status: 500 });
    } finally {
        await prisma.$disconnect();
    }
}
