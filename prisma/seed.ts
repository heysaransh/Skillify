import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    console.log("Start seeding...");

    // Optional: clear existing data
    // await prisma.review.deleteMany();
    // await prisma.session.deleteMany();
    // await prisma.mentorProfile.deleteMany();
    // await prisma.learnerProfile.deleteMany();
    // await prisma.user.deleteMany();

    const mentorsData = [
        {
            name: "Sarah Jenkins",
            email: "sarah.j@example.com",
            role: "MENTOR",
            bio: "Senior Frontend Engineer with 8 years of experience in React and Accessible UI design.",
            experience: 8,
            pricePerHour: 120,
            skills: ["React", "TypeScript", "Accessibility", "Design Systems"],
            rating: 4.9,
        },
        {
            name: "David Chen",
            email: "david.c@example.com",
            role: "MENTOR",
            bio: "Full Stack Developer specializing in Node.js and Cloud Architecture (AWS).",
            experience: 6,
            pricePerHour: 150,
            skills: ["Node.js", "AWS", "Docker", "Microservices"],
            rating: 4.8,
        },
        {
            name: "Elena Rodriguez",
            email: "elena.r@example.com",
            role: "MENTOR",
            bio: "Product Manager turned Data Scientist. I help engineers transition into ML.",
            experience: 5,
            pricePerHour: 200,
            skills: ["Python", "Machine Learning", "Data Analysis", "SQL"],
            rating: 5.0,
        },
        {
            name: "Michael Chang",
            email: "michael.c@example.com",
            role: "MENTOR",
            bio: "Ex-Google Tech Lead. Expert in System Design and Interview Prep.",
            experience: 12,
            pricePerHour: 300,
            skills: ["System Design", "Java", "Go", "Distributed Systems"],
            rating: 5.0,
        },
        {
            name: "Priya Patel",
            email: "priya.p@example.com",
            role: "MENTOR",
            bio: "Mobile Development Expert (iOS & Flutter). Published 10+ apps.",
            experience: 7,
            pricePerHour: 110,
            skills: ["Swift", "Flutter", "iOS", "Mobile Architecture"],
            rating: 4.7,
        },
        {
            name: "James Wilson",
            email: "james.w@example.com",
            role: "MENTOR",
            bio: "Cybersecurity Analyst and Ethical Hacker. Learn to secure your apps.",
            experience: 9,
            pricePerHour: 180,
            skills: ["Cybersecurity", "Penetration Testing", "Network Security"],
            rating: 4.9,
        },
        {
            name: "Anita Singh",
            email: "anita.s@example.com",
            role: "MENTOR",
            bio: "DevOps Engineer with a passion for automation and CI/CD pipelines.",
            experience: 6,
            pricePerHour: 130,
            skills: ["Kubernetes", "Terraform", "CI/CD", "Linux"],
            rating: 4.8,
        },
        {
            name: "Tom Baker",
            email: "tom.b@example.com",
            role: "MENTOR",
            bio: "Blockchain Developer. Helping you understand Web3 and Smart Contracts.",
            experience: 4,
            pricePerHour: 160,
            skills: ["Solidity", "Ethereum", "Web3.js", "Smart Contracts"],
            rating: 4.6,
        },
    ];

    const hashedPassword = await bcrypt.hash("password123", 10);

    for (const m of mentorsData) {
        const user = await prisma.user.upsert({
            where: { email: m.email },
            update: {},
            create: {
                email: m.email,
                name: m.name,
                password: hashedPassword,
                role: "MENTOR",
            },
        });

        await prisma.mentorProfile.upsert({
            where: { userId: user.id },
            update: {
                bio: m.bio,
                experience: m.experience,
                pricePerHour: m.pricePerHour,
                skills: m.skills,
                rating: m.rating,
            },
            create: {
                userId: user.id,
                bio: m.bio,
                experience: m.experience,
                pricePerHour: m.pricePerHour,
                skills: m.skills,
                rating: m.rating,
            },
        });
        console.log(`Seeded mentor: ${m.name}`);
    }

    console.log("Seeding finished.");
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
