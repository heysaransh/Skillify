"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4 text-center px-4">
            <h2 className="text-2xl font-bold text-red-400">Something went wrong!</h2>
            <p className="text-slate-400 max-w-md">
                We encountered an error while loading this page. Please try again.
            </p>
            <div className="flex gap-4">
                <Button onClick={() => reset()} variant="secondary">
                    Try again
                </Button>
                <Button onClick={() => window.location.href = "/"} variant="outline">
                    Go Home
                </Button>
            </div>
        </div>
    );
}
