"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";

type ToastType = "success" | "error" | "info";

interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    toast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const toast = useCallback((message: string, type: ToastType = "info") => {
        const id = Math.random().toString(36).substr(2, 9);
        setToasts((prev) => [...prev, { id, message, type }]);

        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 5000);
    }, []);

    const removeToast = (id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    return (
        <ToastContext.Provider value={{ toast }}>
            {children}
            <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
                {toasts.map((t) => (
                    <div
                        key={t.id}
                        className={`min-w-[300px] p-4 rounded-xl shadow-lg border backdrop-blur-md flex items-start gap-3 transition-all animate-in slide-in-from-right-full ${t.type === "success"
                                ? "bg-emerald-900/80 border-emerald-500/50 text-emerald-100"
                                : t.type === "error"
                                    ? "bg-red-900/80 border-red-500/50 text-red-100"
                                    : "bg-slate-800/80 border-slate-600/50 text-slate-100"
                            }`}
                    >
                        {t.type === "success" && <CheckCircle className="w-5 h-5 text-emerald-400 mt-0.5" />}
                        {t.type === "error" && <AlertCircle className="w-5 h-5 text-red-400 mt-0.5" />}
                        {t.type === "info" && <Info className="w-5 h-5 text-blue-400 mt-0.5" />}

                        <div className="flex-1 text-sm font-medium">{t.message}</div>

                        <button onClick={() => removeToast(t.id)} className="opacity-70 hover:opacity-100 transition-opacity">
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
}
