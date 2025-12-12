"use client";

import Link from "next/link";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Navbar() {
    const { user, isAuthenticated, isLoading, logout } = useAuthStore();
    const router = useRouter();

    const handleLogout = async () => {
        try {
            // Call API to clear httpOnly cookie
            await fetch("/api/auth/logout", { method: "POST" });

            // Clear Zustand state
            logout();

            // Force full page reload to clear all state
            window.location.href = "/login";
        } catch (error) {
            console.error("Logout failed:", error);
            // Fallback: force reload anyway
            logout();
            window.location.href = "/login";
        }
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-b border-border shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex-shrink-0">
                        <h1 className="text-2xl font-bold text-gradient">
                            Skillify
                        </h1>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-4">
                            <Link href="/mentors" className="text-muted-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                Find Mentors
                            </Link>

                            {!isLoading && isAuthenticated && (
                                <Link href="/dashboard" className="text-muted-foreground hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors">
                                    Dashboard
                                </Link>
                            )}
                        </div>
                    </div>

                    {/* Auth Buttons */}
                    <div className="hidden md:block">
                        <div className="ml-4 flex items-center md:ml-6 space-x-3">
                            {isLoading ? (
                                <div className="w-24 h-8" />
                            ) : isAuthenticated ? (
                                <>
                                    <span className="text-sm text-muted-foreground mr-2">Hello, {user?.name}</span>
                                    <Button variant="ghost" size="sm" onClick={handleLogout}>
                                        Logout
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Link href="/login">
                                        <Button variant="ghost" size="sm">
                                            Login
                                        </Button>
                                    </Link>
                                    <Link href="/signup">
                                        <Button variant="primary" size="sm">
                                            Get Started
                                        </Button>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}
