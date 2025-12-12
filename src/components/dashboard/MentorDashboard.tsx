"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, User, Plus, X } from "lucide-react";

export default function MentorDashboard() {
    const [activeTab, setActiveTab] = useState("sessions");
    const [sessions, setSessions] = useState<any[]>([]);
    const [profile, setProfile] = useState({
        bio: "",
        pricePerHour: "",
        experience: "",
        skills: [] as string[],
    });
    const [newSkill, setNewSkill] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    // Fetch Data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [sessionsRes, profileRes] = await Promise.all([
                    fetch("/api/sessions"),
                    fetch("/api/mentors/profile"),
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
                            pricePerHour: data.data.pricePerHour?.toString() || "",
                            experience: data.data.experience?.toString() || "",
                            skills: data.data.skills?.map((s: any) => s.name) || [],
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
            const res = await fetch("/api/mentors/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(profile),
            });
            if (res.ok) alert("Profile updated!");
        } catch (err) {
            console.error(err);
        }
    };

    const addSkill = () => {
        if (newSkill.trim() && !profile.skills.includes(newSkill.trim())) {
            setProfile({ ...profile, skills: [...profile.skills, newSkill.trim()] });
            setNewSkill("");
        }
    };

    const removeSkill = (skill: string) => {
        setProfile({ ...profile, skills: profile.skills.filter(s => s !== skill) });
    };

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
                                <p className="text-slate-400">No upcoming sessions.</p>
                            </div>
                        ) : (
                            sessions.map((session) => (
                                <div key={session.id} className="glass-card p-6 rounded-xl flex justify-between items-center">
                                    <div>
                                        <h3 className="font-semibold text-lg">{session.learner.user.name}</h3>
                                        <p className="text-sm text-slate-400">
                                            {new Date(session.date).toLocaleDateString()} at {new Date(session.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                        <span className={`text-xs px-2 py-1 rounded-full mt-2 inline-block bg-emerald-500/20 text-emerald-400`}>
                                            {session.status}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                ) : (
                    <form className="max-w-2xl space-y-6 glass-card p-8 rounded-2xl" onSubmit={handleProfileUpdate}>
                        <div className="flex gap-4 mb-6">
                            <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg">
                                <User className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h3 className="text-lg font-medium">Profile Details</h3>
                                <p className="text-sm text-slate-400">Update your public mentor profile</p>
                            </div>
                        </div>

                        <Input
                            label="Bio"
                            value={profile.bio}
                            onChange={e => setProfile({ ...profile, bio: e.target.value })}
                            placeholder="I am an expert in..."
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                label="Price ($/hour)"
                                type="number"
                                value={profile.pricePerHour}
                                onChange={e => setProfile({ ...profile, pricePerHour: e.target.value })}
                                placeholder="50"
                            />
                            <Input
                                label="Experience (Years)"
                                type="number"
                                value={profile.experience}
                                onChange={e => setProfile({ ...profile, experience: e.target.value })}
                                placeholder="5"
                            />
                        </div>

                        {/* Skills Management */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-300 ml-1">Skills</label>
                            <div className="flex gap-2">
                                <Input
                                    value={newSkill}
                                    onChange={e => setNewSkill(e.target.value)}
                                    placeholder="Add a skill (e.g. React)"
                                    className="flex-1"
                                    onKeyDown={e => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            addSkill();
                                        }
                                    }}
                                />
                                <Button type="button" onClick={addSkill} variant="secondary">
                                    <Plus className="w-4 h-4" />
                                </Button>
                            </div>

                            <div className="flex flex-wrap gap-2 mt-3">
                                {profile.skills.map((skill) => (
                                    <div key={skill} className="bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                                        {skill}
                                        <button type="button" onClick={() => removeSkill(skill)} className="hover:text-white">
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <Button type="submit" className="w-full mt-4">Save Profile</Button>
                    </form>
                )}
            </div>
        </div>
    );
}
