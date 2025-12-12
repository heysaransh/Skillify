"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import api from "@/lib/axios";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const { login, setLoading, logout } = useAuthStore();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const { data } = await api.get("/auth/me");
                login(data.user);
            } catch (error: any) {
                // Suppress 404/401 errors as they just mean not logged in
                if (error.response?.status !== 401 && error.response?.status !== 404) {
                    console.error("Auth check failed", error);
                }
                logout();
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, [login, logout, setLoading]);

    return <>{children}</>;
}
