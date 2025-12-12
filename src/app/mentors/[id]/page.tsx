"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/button";
import { Star, Clock, Briefcase, Calendar } from "lucide-react";

export default function MentorProfilePage({ params }: { params: Promise<{ id: string }> }) {
    // Unwrap params using React.use() or await in async component. 
    // Since 'use client', we use the 'use' hook or standard async unwrapping if Next 15 allows it in client components (unlikely directly).
    // Actually, in Next.js 15 Client Components, params is a Promise.
    // We can use `use(params)` from React.
    const { id } = use(params);

    const router = useRouter();
    const { user, isAuthenticated } = useAuthStore();

    const [mentor, setMentor] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [bookingDate, setBookingDate] = useState("");
    const [isBooking, setIsBooking] = useState(false);

    useEffect(() => {
        const fetchMentor = async () => {
            try {
                const res = await fetch(`/api/mentors/${id}`);
                if (res.ok) {
                    const data = await res.json();
                    setMentor(data.data);
                } else {
                    router.push("/mentors"); // Redirect if not found
                }
            } catch (error) {
                console.error("Error fetching mentor:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchMentor();
    }, [id, router]);

    const handleBooking = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isAuthenticated) {
            router.push("/login?redirect=/mentors/" + id);
            return;
        }
        if (user?.role === "MENTOR") {
            alert("Mentors cannot book sessions with other mentors (yet).");
            return;
        }

        setIsBooking(true);
        try {
            const res = await fetch("/api/sessions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    mentorId: id,
                    date: bookingDate
                })
            });

            const data = await res.json();

            if (res.ok) {
                alert("Session booked successfully!");
                router.push("/dashboard");
            } else {
                alert(data.message || "Booking failed");
            }
        } catch (err) {
            console.error(err);
            alert("Something went wrong");
        } finally {
            setIsBooking(false);
        }
    };

    if (isLoading) return <div className="text-center py-20">Loading...</div>;
    if (!mentor) return null;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid lg:grid-cols-3 gap-12">
                {/* Left Column: Details */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="glass-card p-8 rounded-3xl">
                        <div className="flex flex-col md:flex-row gap-6 items-start">
                            <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-3xl font-bold text-white shadow-lg">
                                {mentor.user.name.charAt(0)}
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold mb-2">{mentor.user.name}</h1>
                                <div className="flex flex-wrap gap-4 text-slate-400 text-sm">
                                    <span className="flex items-center gap-1 text-yellow-400">
                                        <Star className="w-4 h-4 fill-current" /> {mentor.rating.toFixed(1)} Rating
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Briefcase className="w-4 h-4" /> {mentor.experience} Years Experience
                                    </span>
                                    <span className="flex items-center gap-1 text-indigo-400 font-semibold">
                                        <span className="text-lg">${mentor.pricePerHour}</span>/hour
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8">
                            <h2 className="text-xl font-semibold mb-3">About</h2>
                            <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">{mentor.bio || "No biography provided."}</p>
                        </div>
                    </div>

                    <div className="glass-card p-8 rounded-3xl">
                        <h2 className="text-xl font-semibold mb-4">Skills & Expertise</h2>
                        <div className="flex flex-wrap gap-2">
                            {mentor.skills.map((skill: any) => (
                                <span key={skill.id} className="px-4 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-300">
                                    {skill.name}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: Booking Card */}
                <div className="lg:col-span-1">
                    <div className="glass-card p-6 rounded-3xl sticky top-24 border border-indigo-500/20 shadow-indigo-500/10 shadow-2xl">
                        <h3 className="text-2xl font-bold mb-6">Book a Session</h3>

                        <form onSubmit={handleBooking} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-400 mb-2">Select Date & Time</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Calendar className="h-5 w-5 text-slate-500" />
                                    </div>
                                    <input
                                        type="datetime-local"
                                        required
                                        min={new Date().toISOString().slice(0, 16)}
                                        className="w-full pl-10 pr-4 py-3 bg-slate-900/80 border border-slate-700 rounded-xl focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none text-slate-200"
                                        value={bookingDate}
                                        onChange={e => setBookingDate(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="bg-slate-800/50 p-4 rounded-xl space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-400">Rate</span>
                                    <span>${mentor.pricePerHour}/hr</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-400">Duration</span>
                                    <span>60 min</span>
                                </div>
                                <div className="border-t border-slate-700 pt-2 flex justify-between font-semibold text-lg">
                                    <span>Total</span>
                                    <span className="text-indigo-400">${mentor.pricePerHour}</span>
                                </div>
                            </div>

                            <Button type="submit" className="w-full h-12 text-lg" size="lg" isLoading={isBooking}>
                                Confirm Booking
                            </Button>

                            {!isAuthenticated && (
                                <p className="text-xs text-center text-slate-500">
                                    You'll be asked to sign in first.
                                </p>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
