import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Search, UserCheck, Calendar, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        {/* Abstract Background Blobs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full z-0 pointer-events-none">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl animate-[pulse_8s_ease-in-out_infinite]"></div>
          <div className="absolute top-40 right-1/4 w-72 h-72 bg-pink-500/20 rounded-full blur-3xl animate-[pulse_6s_ease-in-out_infinite_1s]"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
              Master New Skills
            </span>
            <br />
            <span className="text-white">With Expert Mentors</span>
          </h1>

          <p className="mt-6 text-xl text-slate-400 max-w-3xl mx-auto mb-10">
            Connect with industry leaders, book 1-on-1 sessions, and accelerate your career growth today.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/mentors">
              <Button size="lg" className="w-full sm:w-auto text-lg shadow-indigo-500/25">
                Find a Mentor
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/signup">
              <Button variant="outline" size="lg" className="w-full sm:w-auto text-lg backdrop-blur-sm bg-white/5 border-white/10">
                Become a Mentor
              </Button>
            </Link>
          </div>

          {/* Floaters */}
          <div className="mt-20 relative h-64 hidden md:block">
            <div className="absolute left-10 top-0 p-4 rounded-2xl glass-card animate-[float_6s_ease-in-out_infinite]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-600"></div>
                <div>
                  <p className="font-semibold">Session Confirmed</p>
                  <p className="text-xs text-slate-400">Today, 2:00 PM</p>
                </div>
              </div>
            </div>

            <div className="absolute right-10 bottom-0 p-4 rounded-2xl glass-card animate-[float_7s_ease-in-out_infinite_2s]">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-slate-700 border-2 border-slate-800"></div>
                  <div className="w-8 h-8 rounded-full bg-slate-600 border-2 border-slate-800"></div>
                  <div className="w-8 h-8 rounded-full bg-slate-500 border-2 border-slate-800"></div>
                </div>
                <p className="text-sm font-medium text-slate-200">500+ Mentors</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-slate-900/50 relative border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              How It Works
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="p-8 rounded-3xl glass-card relative group hover:-translate-y-2 transition-transform duration-300">
              <div className="absolute -top-6 left-8 bg-indigo-600 w-12 h-12 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <Search className="text-white h-6 w-6" />
              </div>
              <h3 className="mt-6 text-xl font-semibold mb-3">1. Search Mentors</h3>
              <p className="text-slate-400">
                Filter by expertise, price, and reviews to find the perfect match for your learning goals.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-8 rounded-3xl glass-card relative group hover:-translate-y-2 transition-transform duration-300 delay-100">
              <div className="absolute -top-6 left-8 bg-pink-500 w-12 h-12 rounded-xl flex items-center justify-center shadow-lg shadow-pink-500/30">
                <Calendar className="text-white h-6 w-6" />
              </div>
              <h3 className="mt-6 text-xl font-semibold mb-3">2. Book a Session</h3>
              <p className="text-slate-400">
                Choose a time that works for you. Our secure platform handles scheduling and payments seamlessly.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-8 rounded-3xl glass-card relative group hover:-translate-y-2 transition-transform duration-300 delay-200">
              <div className="absolute -top-6 left-8 bg-violet-500 w-12 h-12 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/30">
                <UserCheck className="text-white h-6 w-6" />
              </div>
              <h3 className="mt-6 text-xl font-semibold mb-3">3. Level Up</h3>
              <p className="text-slate-400">
                Connect via video call, get personalized guidance, and achieve your career milestones faster.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer (Simple Placeholder) */}
      <footer className="py-12 border-t border-white/5 text-center text-slate-500">
        <p>&copy; {new Date().getFullYear()} Skillify. Built for excellence.</p>
      </footer>
    </div>
  );
}
