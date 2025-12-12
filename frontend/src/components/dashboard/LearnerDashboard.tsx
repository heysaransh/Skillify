"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, User, Trash2 } from "lucide-react";

export default function LearnerDashboard() {
    const [activeTab, setActiveTab] = useState("sessions");
    const [sessions, setSessions] = useState<any[]>([]);
    const [profile, setProfile] = useState({
        bio: "",
        age: "",
        skillsWanted: [] as string[],
    });
    const [isLoading, setIsLoading] = useState(true);

    // Fetch Data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [sessionsRes, profileRes] = await Promise.all([
                    fetch("/api/sessions"),
                    fetch("/api/learners/profile"),
                ]);

                if (sessionsRes.ok) {
                    const data = await sessionsRes.json();
                    setSessions(data.data);
                }

                if (profileRes.ok) {
                    const data = await profileRes.json();
                    if (data.data) {
                        setProfile({
                            bio: data.data.bio || "",
                            age: data.data.age?.toString() || "",
                            skillsWanted: data.data.skillsWanted || [],
                        });
                    }
                }
            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch("/api/learners/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(profile),
            });
            if (res.ok) alert("Profile updated!"); // Simple alert for now, toast later
        } catch (err) {
            console.error(err);
        }
    };

    const cancelSession = async (id: string) => {
        if (!confirm("Are you sure?")) return;
        try {
            const res = await fetch(`/api/sessions/${id}`, { method: "DELETE" });
            if (res.ok) {
                setSessions(sessions.filter(s => s.id !== id));
            }
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <div>
            {/* Tabs */}
            <div className="flex border-b border-slate-700 mb-8">
                <button
                    onClick={() => setActiveTab("sessions")}
                    className={`px-6 py-3 font-medium text-sm transition-colors border-b-2 ${activeTab === "sessions"
                            ? "border-indigo-500 text-indigo-400"
                            : "border-transparent text-slate-400 hover:text-slate-200"
                        }`}
                >
                    My Sessions
                </button>
                <button
                    onClick={() => setActiveTab("profile")}
                    className={`px-6 py-3 font-medium text-sm transition-colors border-b-2 ${activeTab === "profile"
                            ? "border-pink-500 text-pink-400"
                            : "border-transparent text-slate-400 hover:text-slate-200"
                        }`}
                >
                    Edit Profile
                </button>
            </div>

            {/* Content */}
            <div className="min-h-[400px]">
                {isLoading ? (
                    <p className="text-slate-400">Loading...</p>
                ) : activeTab === "sessions" ? (
                    <div className="space-y-4">
                        {sessions.length === 0 ? (
                            <div className="text-center py-12 bg-slate-800/30 rounded-2xl border border-slate-700/50">
                                <Calendar className="w-12 h-12 mx-auto text-slate-600 mb-4" />
                                <p className="text-slate-400">No sessions booked yet.</p>
                            </div>
                        ) : (
                            sessions.map((session) => (
                                <div key={session.id} className="glass-card p-6 rounded-xl flex justify-between items-center">
                                    <div>
                                        <h3 className="font-semibold text-lg">{session.mentor.user.name}</h3>
                                        <p className="text-sm text-slate-400">
                                            {new Date(session.date).toLocaleDateString()} at {new Date(session.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                        <span className={`text-xs px-2 py-1 rounded-full mt-2 inline-block bg-emerald-500/20 text-emerald-400`}>
                                            {session.status}
                                        </span>
                                    </div>
                                    <Button variant="outline" size="sm" onClick={() => cancelSession(session.id)} className="border-red-500/50 text-red-400 hover:bg-red-500/10">
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Cancel
                                    </Button>
                                </div>
                            ))
                        )}
                    </div>
                ) : (
                    <form className="max-w-xl space-y-6 glass-card p-8 rounded-2xl" onSubmit={handleProfileUpdate}>
                        <div className="flex gap-4">
                            <div className="w-20 h-20 bg-slate-700 rounded-full flex items-center justify-center flex-shrink-0">
                                <User className="w-8 h-8 text-slate-400" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm text-slate-400 mb-2">Avatar upload not implementing in MVP</p>
                            </div>
                        </div>

                        <Input
                            label="Bio"
                            value={profile.bio}
                            onChange={e => setProfile({ ...profile, bio: e.target.value })}
                            placeholder="Tell mentors about yourself..."
                        />

                        <Input
                            label="Age"
                            type="number"
                            value={profile.age}
                            onChange={e => setProfile({ ...profile, age: e.target.value })}
                            placeholder="25"
                        />

                        {/* Simple Skills Input for MVP - Comma separated */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300 ml-1">Skills Wanted (comma separated)</label>
                            <input
                                className="flex h-11 w-full rounded-xl border border-slate-700 bg-slate-900/50 px-4 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                                placeholder="React, Design, Python..."
                                value={profile.skillsWanted.join(", ")}
                                onChange={e => setProfile({ ...profile, skillsWanted: e.target.value.split(",").map(s => s.trim()) })}
                            />
                        </div>

                        <Button type="submit">Save Changes</Button>
                    </form>
                )}
            </div>
        </div>
    );
}
