"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import LearnerDashboard from "@/components/dashboard/LearnerDashboard";
import MentorDashboard from "@/components/dashboard/MentorDashboard";
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
    const { user, isAuthenticated, isLoading } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push("/login");
        }
    }, [isLoading, isAuthenticated, router]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold mb-8">
                Welcome back, <span className="text-indigo-400">{user.name}</span>
            </h1>

            {user.role === "MENTOR" ? <MentorDashboard /> : <LearnerDashboard />}
        </div>
    );
}
