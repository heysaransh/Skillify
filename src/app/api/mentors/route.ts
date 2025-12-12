import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);

        // Pagination
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "10");
        const skip = (page - 1) * limit;

        // Filters
        const search = searchParams.get("search") || "";
        const minPrice = parseFloat(searchParams.get("minPrice") || "0");
        const maxPrice = parseFloat(searchParams.get("maxPrice") || "10000");
        const minRating = parseFloat(searchParams.get("rating") || "0");
        const minExperience = parseInt(searchParams.get("experience") || "0");

        // Sorting
        const sort = searchParams.get("sort") || "rating_desc"; // default sort

        // Construct Query
        const where: Prisma.MentorProfileWhereInput = {
            pricePerHour: {
                gte: minPrice,
                lte: maxPrice,
            },
            rating: {
                gte: minRating,
            },
            experience: {
                gte: minExperience,
            },
            OR: search ? [
                {
                    user: {
                        name: {
                            contains: search,
                            mode: "insensitive",
                        }
                    }
                },
                // Removed skills search to avoid scalar array filtering issues for now
                {
                    bio: {
                        contains: search,
                        mode: "insensitive"
                    }
                }
            ] : undefined,
        };

        // Determine Sort Order
        let orderBy: Prisma.MentorProfileOrderByWithRelationInput = {};
        if (sort === "rating_desc") orderBy = { rating: "desc" };
        else if (sort === "price_asc") orderBy = { pricePerHour: "asc" };
        else if (sort === "price_desc") orderBy = { pricePerHour: "desc" };
        else if (sort === "experience_desc") orderBy = { experience: "desc" };
        else orderBy = { rating: "desc" };

        // Execute Query
        const [mentors, total] = await prisma.$transaction([
            prisma.mentorProfile.findMany({
                where,
                take: limit,
                skip,
                orderBy,
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        }
                    },
                    // skills is a scalar array now, so it is included by default, no need for 'include'
                },
            }),
            prisma.mentorProfile.count({ where }),
        ]);

        return NextResponse.json({
            data: mentors,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            }
        });

    } catch (error) {
        console.error("Mentor Search API Error:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
