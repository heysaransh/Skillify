"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import api from "@/lib/axios";
import { User, GraduationCap } from "lucide-react";

export default function SignupPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "LEARNER",
    });
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuthStore();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        if (formData.password.length < 6) {
            setError("Password must be at least 6 characters long");
            setIsLoading(false);
            return;
        }

        try {
            const { data } = await api.post("/auth/signup", formData);

            // Auto login logic (Token is set in cookie by API)
            login(data.user);
            router.push("/dashboard");
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || "Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex text-center justify-center pt-32 pb-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 glass-card p-8 rounded-2xl h-fit bg-white purple-shadow-lg border border-border">
                <div>
                    <h2 className="mt-2 text-3xl font-bold text-foreground">
                        Create account
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Join Skillify today and start your journey
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <Input
                            label="Full Name"
                            type="text"
                            required
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
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

                        {/* Role Selection */}
                        <div className="pt-2">
                            <label className="block text-sm font-bold text-foreground mb-3 text-left ml-1">
                                I want to join as a:
                            </label>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, role: "LEARNER" })}
                                    className={`p-5 rounded-xl border-2 flex flex-col items-center justify-center gap-2.5 transition-all font-semibold ${formData.role === "LEARNER"
                                        ? "bg-primary/10 border-primary text-primary shadow-md ring-2 ring-primary/30"
                                        : "bg-white border-border text-muted-foreground hover:bg-muted hover:border-primary/50"
                                        }`}
                                >
                                    <User className="w-7 h-7" />
                                    <span>Learner</span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData({ ...formData, role: "MENTOR" })}
                                    className={`p-5 rounded-xl border-2 flex flex-col items-center justify-center gap-2.5 transition-all font-semibold ${formData.role === "MENTOR"
                                        ? "bg-primary/10 border-primary text-primary shadow-md ring-2 ring-primary/30"
                                        : "bg-white border-border text-muted-foreground hover:bg-muted hover:border-primary/50"
                                        }`}
                                >
                                    <GraduationCap className="w-7 h-7" />
                                    <span>Mentor</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div className="text-red-700 text-sm text-center bg-red-50 p-3 rounded-xl border-2 border-red-200 font-medium">
                            {error}
                        </div>
                    )}

                    <Button type="submit" className="w-full shadow-md" isLoading={isLoading}>
                        Sign up
                    </Button>

                    <div className="text-sm text-center">
                        <span className="text-muted-foreground">Already have an account? </span>
                        <Link href="/login" className="font-semibold text-primary hover:text-primary/80 transition-colors">
                            Sign in
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
