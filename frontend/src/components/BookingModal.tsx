"use client";

import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, DollarSign, Star, Briefcase } from "lucide-react";
import api from "@/lib/axios";
import { useState } from "react";

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

interface BookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    mentor: Mentor;
}

export function BookingModal({ isOpen, onClose, mentor }: BookingModalProps) {
    const [selectedDate, setSelectedDate] = useState("");
    const [selectedTime, setSelectedTime] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleBookSession = async () => {
        if (!selectedDate || !selectedTime) {
            setError("Please select both date and time");
            return;
        }

        setIsLoading(true);
        setError("");

        try {
            const dateTime = new Date(`${selectedDate}T${selectedTime}`);

            const response = await api.post("/sessions", {
                mentorId: mentor.id,
                date: dateTime.toISOString(),
            });

            setSuccess(true);
            setTimeout(() => {
                onClose();
                setSuccess(false);
                setSelectedDate("");
                setSelectedTime("");
            }, 2000);
        } catch (err: any) {
            setError(err.response?.data?.message || "Failed to book session. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Book a Session" className="purple-shadow-lg">
            <div className="space-y-6">
                {/* Mentor Info */}
                <div className="flex items-start gap-4 p-5 bg-muted/50 rounded-xl border border-border">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-md flex-shrink-0">
                        {mentor.user.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                        <h3 className="text-xl font-bold text-foreground">{mentor.user.name}</h3>
                        <div className="flex items-center gap-4 mt-2 text-sm">
                            <div className="flex items-center text-yellow-500">
                                <Star className="w-4 h-4 fill-current mr-1" />
                                <span className="text-foreground font-semibold">{mentor.rating.toFixed(1)}</span>
                            </div>
                            <div className="flex items-center text-muted-foreground">
                                <Briefcase className="w-4 h-4 mr-1 text-primary" />
                                <span className="font-medium">{mentor.experience} years</span>
                            </div>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="flex items-baseline text-primary font-bold text-2xl">
                            <DollarSign className="w-5 h-5" />
                            {mentor.pricePerHour}
                        </div>
                        <span className="text-muted-foreground text-sm">per hour</span>
                    </div>
                </div>

                {/* Bio */}
                <div>
                    <p className="text-muted-foreground text-sm leading-relaxed">{mentor.bio}</p>
                </div>

                {/* Skills */}
                <div>
                    <h4 className="text-sm font-bold text-foreground mb-3">Skills & Expertise</h4>
                    <div className="flex flex-wrap gap-2">
                        {mentor.skills.map((skill, i) => (
                            <span
                                key={i}
                                className="text-xs bg-primary/10 border border-primary/30 text-primary px-3 py-1.5 rounded-full font-semibold"
                            >
                                {skill.name}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Date & Time Selection */}
                <div className="space-y-4 pt-2">
                    <div>
                        <label className="block text-sm font-bold text-foreground mb-2">
                            <Calendar className="w-4 h-4 inline mr-1.5 text-primary" />
                            Select Date
                        </label>
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            min={new Date().toISOString().split('T')[0]}
                            className="w-full px-4 py-3 border-2 border-border rounded-xl focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground bg-white transition-all"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-foreground mb-2">
                            <Clock className="w-4 h-4 inline mr-1.5 text-primary" />
                            Select Time
                        </label>
                        <input
                            type="time"
                            value={selectedTime}
                            onChange={(e) => setSelectedTime(e.target.value)}
                            className="w-full px-4 py-3 border-2 border-border rounded-xl focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground bg-white transition-all"
                        />
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="p-4 bg-red-50 border-2 border-red-200 rounded-xl text-red-700 text-sm font-medium">
                        {error}
                    </div>
                )}

                {/* Success Message */}
                {success && (
                    <div className="p-4 bg-green-50 border-2 border-green-200 rounded-xl text-green-700 text-sm font-semibold">
                        ✓ Session booked successfully!
                    </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="flex-1"
                        disabled={isLoading}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleBookSession}
                        className="flex-1 shadow-md"
                        isLoading={isLoading}
                        disabled={success}
                    >
                        Book Session
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
