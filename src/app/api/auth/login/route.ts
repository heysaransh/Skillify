import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { comparePassword, generateToken } from "@/lib/auth";

export async function POST(req: Request) {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json(
                { message: "Email and password are required" },
                { status: 400 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            return NextResponse.json( // Good practice to use generic message for security, but specific for debugging now
                { message: "Invalid credentials" },
                { status: 401 }
            );
        }

        const isMatch = await comparePassword(password, user.password);

        if (!isMatch) {
            return NextResponse.json(
                { message: "Invalid credentials" },
                { status: 401 }
            );
        }

        const token = generateToken({ id: user.id, email: user.email, role: user.role });

        const response = NextResponse.json(
            {
                message: "Login successful",
                user: { id: user.id, name: user.name, email: user.email, role: user.role }
            },
            { status: 200 }
        );

        response.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 86400 // 1 day
        });

        return response;

    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
