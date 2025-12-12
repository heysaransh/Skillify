import { create } from 'zustand';

interface User {
    id: string;
    name: string;
    email: string;
    role: 'MENTOR' | 'LEARNER' | string;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (user: User) => void;
    logout: () => void;
    setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isAuthenticated: false,
    isLoading: true, // Default to true to check session on mount
    login: (user) => set({ user, isAuthenticated: true, isLoading: false }),
    logout: () => set({ user: null, isAuthenticated: false, isLoading: false }),
    setLoading: (loading) => set({ isLoading: loading }),
}));
