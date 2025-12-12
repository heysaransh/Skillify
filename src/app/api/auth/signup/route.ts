import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, generateToken } from "@/lib/auth";

export async function POST(req: Request) {
    try {
        const { name, email, password, role } = await req.json();

        if (!name || !email || !password || !role) {
            return NextResponse.json(
                { message: "All fields are required" },
                { status: 400 }
            );
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { message: "Invalid email format" },
                { status: 400 }
            );
        }

        if (role !== "MENTOR" && role !== "LEARNER") {
            return NextResponse.json({ message: "Invalid role" }, { status: 400 });
        }

        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return NextResponse.json(
                { message: "User already exists" },
                { status: 409 }
            );
        }

        const hashedPassword = await hashPassword(password);

        // Transaction to ensure user and profile are created together
        const user = await prisma.$transaction(async (tx) => {
            const newUser = await tx.user.create({
                data: {
                    name,
                    email,
                    password: hashedPassword,
                    role,
                },
            });

            if (role === "MENTOR") {
                await tx.mentorProfile.create({
                    data: {
                        userId: newUser.id,
                        bio: "",
                        // fields have defaults
                    },
                });
            } else {
                await tx.learnerProfile.create({
                    data: {
                        userId: newUser.id,
                        // fields have defaults
                    },
                });
            }

            return newUser;
        });

        const token = generateToken({ id: user.id, email: user.email, role: user.role });

        const response = NextResponse.json(
            { message: "User created successfully", user: { id: user.id, name: user.name, email: user.email, role: user.role } },
            { status: 201 }
        );

        // Set cookie for session persistence (optional but good for middleware)
        response.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 86400 // 1 day
        });

        return response;

    } catch (error) {
        console.error("Signup error:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
