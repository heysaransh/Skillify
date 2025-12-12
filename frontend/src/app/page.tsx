import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Search, UserCheck, Calendar, ArrowRight, Star, Sparkles, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section - Premium Purple Design */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        {/* Purple Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-muted to-accent -z-10" />

        {/* Floating Orbs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-[pulse_8s_ease-in-out_infinite]" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-[pulse_6s_ease-in-out_infinite_2s]" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold text-primary">Trusted by 10,000+ learners</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight">
              <span className="text-gradient">Master New Skills</span>
              <br />
              <span className="text-foreground">With Expert Mentors</span>
            </h1>

            {/* Subtitle */}
            <p className="mt-6 text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              Connect with industry leaders, book personalized 1-on-1 sessions, and accelerate your career growth with expert guidance.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
              <Link href="/mentors">
                <Button size="lg" className="w-full sm:w-auto text-lg px-8 shadow-lg hover:shadow-xl">
                  Find Your Mentor
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/signup">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto text-lg px-8">
                  Become a Mentor
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-1">500+</div>
                <div className="text-sm text-muted-foreground">Expert Mentors</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-1">10K+</div>
                <div className="text-sm text-muted-foreground">Sessions Completed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-1">4.9</div>
                <div className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                  Average Rating
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get started in three simple steps and transform your career
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="relative group">
              <div className="p-8 rounded-2xl bg-white border-2 border-border hover:border-primary transition-all duration-300 purple-shadow hover:purple-shadow-lg h-full">
                <div className="w-14 h-14 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center mb-6 shadow-md">
                  <Search className="text-white h-7 w-7" />
                </div>
                <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-bold">1</span>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-foreground">Search Mentors</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Browse through our curated list of expert mentors. Filter by skills, experience, price, and reviews to find your perfect match.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative group">
              <div className="p-8 rounded-2xl bg-white border-2 border-border hover:border-primary transition-all duration-300 purple-shadow hover:purple-shadow-lg h-full">
                <div className="w-14 h-14 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center mb-6 shadow-md">
                  <Calendar className="text-white h-7 w-7" />
                </div>
                <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-bold">2</span>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-foreground">Book a Session</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Choose a convenient time slot that works for you. Our platform handles scheduling, reminders, and secure payments seamlessly.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative group">
              <div className="p-8 rounded-2xl bg-white border-2 border-border hover:border-primary transition-all duration-300 purple-shadow hover:purple-shadow-lg h-full">
                <div className="w-14 h-14 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center mb-6 shadow-md">
                  <Zap className="text-white h-7 w-7" />
                </div>
                <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-bold">3</span>
                </div>
                <h3 className="text-2xl font-bold mb-4 text-foreground">Level Up</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Connect via video call, receive personalized guidance, and achieve your career milestones faster with expert mentorship.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-primary to-secondary relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjEiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-20" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Career?
          </h2>
          <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
            Join thousands of learners who are already growing with expert mentorship
          </p>
          <Link href="/signup">
            <Button size="lg" variant="secondary" className="text-lg px-10 shadow-2xl bg-white hover:bg-white/90 text-primary">
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-white border-t border-border text-center">
        <p className="text-muted-foreground">&copy; {new Date().getFullYear()} Skillify. Empowering growth through mentorship.</p>
      </footer>
    </div>
  );
}
