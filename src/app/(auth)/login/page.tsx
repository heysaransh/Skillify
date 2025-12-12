"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import api from "@/lib/axios";

export default function LoginPage() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuthStore();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        try {
            const { data } = await api.post("/auth/login", formData);
            login(data.user);
            router.push("/dashboard");
        } catch (err: any) {
            setError(err.response?.data?.message || "Invalid credentials or server error");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center pt-20 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 glass-card p-8 rounded-2xl bg-white purple-shadow-lg border border-border">
                <div>
                    <h2 className="mt-2 text-center text-3xl font-bold text-foreground">
                        Welcome back
                    </h2>
                    <p className="mt-2 text-center text-sm text-muted-foreground">
                        Sign in to continue your progress
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <Input
                            label="Email address"
                            type="email"
                            required
                            placeholder="john@example.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                        <Input
                            label="Password"
                            type="password"
                            required
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>

                    {error && (
                        <div className="text-red-700 text-sm text-center bg-red-50 p-3 rounded-xl border-2 border-red-200 font-medium">
                            {error}
                        </div>
                    )}

                    <Button type="submit" className="w-full shadow-md" isLoading={isLoading}>
                        Sign in
                    </Button>

                    <div className="text-sm text-center">
                        <span className="text-muted-foreground">Don't have an account? </span>
                        <Link href="/signup" className="font-semibold text-primary hover:text-primary/80 transition-colors">
                            Sign up
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
