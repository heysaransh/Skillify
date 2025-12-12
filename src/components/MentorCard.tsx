"use client";

import { useState } from "react";
import { Star, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BookingModal } from "@/components/BookingModal";

interface Mentor {
    id: string;
    bio: string;
    pricePerHour: number;
    experience: number;
    rating: number;
    skills: { name: string }[];
    user: {
        name: string;
        email: string;
    };
}

export default function MentorCard({ mentor }: { mentor: Mentor }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <div className="glass-card rounded-2xl overflow-hidden hover:scale-[1.02] transition-all duration-300 flex flex-col h-full bg-white purple-shadow hover:purple-shadow-lg border border-border">
                <div className="p-6 flex-1">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex gap-4">
                            <div className="w-14 h-14 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-xl shadow-md">
                                {mentor.user.name.charAt(0)}
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-foreground">{mentor.user.name}</h3>
                                <div className="flex items-center text-yellow-500 text-sm mt-1">
                                    <Star className="w-4 h-4 fill-current mr-1" />
                                    <span className="text-foreground font-semibold">{mentor.rating.toFixed(1)}</span>
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="flex items-baseline">
                                <span className="text-2xl font-bold text-primary">${mentor.pricePerHour}</span>
                                <span className="text-muted-foreground text-sm ml-1">/hr</span>
                            </div>
                        </div>
                    </div>

                    <p className="text-muted-foreground text-sm line-clamp-3 mb-4 h-16 leading-relaxed">
                        {mentor.bio || "No bio provided."}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                        {mentor.skills.slice(0, 3).map((skill, i) => (
                            <span
                                key={i}
                                className="text-xs bg-primary/10 border border-primary/30 text-primary px-3 py-1.5 rounded-full font-semibold"
                            >
                                {skill.name}
                            </span>
                        ))}
                        {mentor.skills.length > 3 && (
                            <span className="text-xs text-muted-foreground px-2 py-1 font-medium">
                                +{mentor.skills.length - 3} more
                            </span>
                        )}
                    </div>

                    <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
                        <div className="flex items-center gap-1.5">
                            <Briefcase className="w-4 h-4 text-primary" />
                            <span className="font-semibold text-foreground">{mentor.experience} Years</span>
                        </div>
                    </div>
                </div>

                <div className="p-4 border-t border-border bg-muted/30">
                    <Button
                        variant="primary"
                        className="w-full font-semibold shadow-md hover:shadow-lg"
                        onClick={() => setIsModalOpen(true)}
                    >
                        View Profile & Book
                    </Button>
                </div>
            </div>

            <BookingModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                mentor={mentor}
            />
        </>
    );
}
