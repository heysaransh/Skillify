"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import MentorCard from "@/components/MentorCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, SlidersHorizontal, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";

function MentorsContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [mentors, setMentors] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [meta, setMeta] = useState({ page: 1, totalPages: 1, total: 0 });
    const [showFilters, setShowFilters] = useState(false);

    // Filter States
    const [search, setSearch] = useState(searchParams.get("search") || "");
    const [filters, setFilters] = useState({
        minPrice: searchParams.get("minPrice") || "",
        maxPrice: searchParams.get("maxPrice") || "",
        experience: searchParams.get("experience") || "",
        sort: searchParams.get("sort") || "rating_desc",
    });

    const fetchMentors = useCallback(async () => {
        setIsLoading(true);
        try {
            // Build query string
            const params = new URLSearchParams();
            if (search) params.append("search", search);
            if (filters.minPrice) params.append("minPrice", filters.minPrice);
            if (filters.maxPrice) params.append("maxPrice", filters.maxPrice);
            if (filters.experience) params.append("experience", filters.experience);
            if (filters.sort) params.append("sort", filters.sort);
            params.append("page", meta.page.toString());

            const res = await fetch(`/api/mentors?${params.toString()}`);
            if (res.ok) {
                const data = await res.json();
                setMentors(data.data);
                setMeta(data.meta);
            }
        } catch (error) {
            console.error("Failed to fetch mentors", error);
        } finally {
            setIsLoading(false);
        }
    }, [search, filters, meta.page]);

    useEffect(() => {
        fetchMentors();
    }, [fetchMentors]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setMeta({ ...meta, page: 1 });
        fetchMentors();
    };

    const updateFilter = (key: string, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setMeta({ ...meta, page: 1 });
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header & Search */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Find Your Mentor</h1>
                    <p className="text-slate-400">Browse expert mentors to accelerate your learning.</p>
                </div>

                <form onSubmit={handleSearch} className="flex w-full md:w-auto gap-2">
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                        <input
                            className="w-full h-10 pl-10 pr-4 rounded-xl border border-slate-700 bg-slate-900/50 text-sm focus:border-indigo-500 focus:outline-none"
                            placeholder="Search by name, skill, bio..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                    <Button type="button" variant="outline" onClick={() => setShowFilters(!showFilters)} className="px-3">
                        <SlidersHorizontal className="h-4 w-4" />
                    </Button>
                    <Button type="submit">Search</Button>
                </form>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar Filters */}
                <aside className={`lg:w-64 space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
                    <div className="glass-card p-6 rounded-xl space-y-6">
                        <div>
                            <h3 className="font-semibold mb-3">Sort By</h3>
                            <select
                                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-2 text-sm"
                                value={filters.sort}
                                onChange={e => updateFilter("sort", e.target.value)}
                            >
                                <option value="rating_desc">Highest Rated</option>
                                <option value="price_asc">Lowest Price</option>
                                <option value="price_desc">Highest Price</option>
                                <option value="experience_desc">Most Experienced</option>
                            </select>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-3">Price Range ($)</h3>
                            <div className="flex gap-2">
                                <input
                                    className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-2 text-sm"
                                    placeholder="Min"
                                    type="number"
                                    value={filters.minPrice}
                                    onChange={e => updateFilter("minPrice", e.target.value)}
                                />
                                <input
                                    className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-2 text-sm"
                                    placeholder="Max"
                                    type="number"
                                    value={filters.maxPrice}
                                    onChange={e => updateFilter("maxPrice", e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <h3 className="font-semibold mb-3">Min Experience (Years)</h3>
                            <input
                                className="w-full bg-slate-900/50 border border-slate-700 rounded-lg p-2 text-sm"
                                type="number"
                                value={filters.experience}
                                onChange={e => updateFilter("experience", e.target.value)}
                            />
                        </div>
                    </div>
                </aside>

                {/* Results Grid */}
                <div className="flex-1">
                    {isLoading ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Skeleton loaders */}
                            {[1, 2, 3].map(i => (
                                <div key={i} className="h-64 bg-slate-800/50 rounded-2xl animate-pulse"></div>
                            ))}
                        </div>
                    ) : mentors.length === 0 ? (
                        <div className="text-center py-20 bg-slate-800/30 rounded-2xl border border-slate-700/50">
                            <p className="text-xl font-semibold mb-2">No mentors found</p>
                            <p className="text-slate-400">Try adjusting your filters or search terms.</p>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {mentors.map(mentor => (
                                <MentorCard key={mentor.id} mentor={mentor} />
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {meta.totalPages > 1 && (
                        <div className="flex justify-center mt-12 gap-2">
                            <Button
                                variant="outline"
                                disabled={meta.page === 1}
                                onClick={() => setMeta(prev => ({ ...prev, page: prev.page - 1 }))}
                            >
                                <ChevronLeft className="h-4 w-4 mr-1" /> Prev
                            </Button>
                            <span className="flex items-center px-4 text-slate-400">
                                Page {meta.page} of {meta.totalPages}
                            </span>
                            <Button
                                variant="outline"
                                disabled={meta.page === meta.totalPages}
                                onClick={() => setMeta(prev => ({ ...prev, page: prev.page + 1 }))}
                            >
                                Next <ChevronRight className="h-4 w-4 ml-1" />
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function MentorsPage() {
    return (
        <Suspense fallback={<div className="text-center py-20">Loading mentors...</div>}>
            <MentorsContent />
        </Suspense>
    );
}
