import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import DashboardPreview from "@/components/DashboardPreview";
import { CheckIcon, ShieldIcon, TrendingUpIcon, BrainIcon, HeartPulseIcon } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col overflow-hidden bg-background">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="flex items-center gap-2 font-bold text-xl text-primary">
            <span>Enhanced Health</span>
            <img src="/logo.svg" alt="Enhanced Health" className="h-6 w-6 flex-shrink-0" />
            <HeartPulseIcon className="h-5 w-5 text-primary flex-shrink-0" />
          </div>
          <div className="flex flex-1 items-center justify-end space-x-2">
            <Button 
              variant="ghost"
              onClick={() => navigate("/sign-in")}
            >
              Sign In
            </Button>
          </div>
        </div>
      </header>
      
      <main className="flex-1">
        {/* Hero Section */}
        <ContainerScroll
          titleComponent={
            <div className="space-y-6 pt-16 md:pt-24 text-center">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight">
                The First Health App Built for Enhanced Athletes
              </h1>
              <p className="mx-auto max-w-[700px] text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed">
                Bodybuilding's silent killer isn't overtraining — it's untracked bloodwork. Get peace of mind and push your limits safely.
              </p>
              <div className="pt-4">
                <Button 
                  size="lg"
                  className="px-8 py-6 text-lg font-semibold"
                  onClick={() => navigate("/sign-up")}
                >
                  Sign Up Free Today
                </Button>
              </div>
            </div>
          }
        >
          <DashboardPreview />
        </ContainerScroll>
        
        {/* The Villain Section */}
        <section className="w-full py-16 md:py-24 bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-6 leading-tight">
                Until now, enhanced athletes tracked health in messy spreadsheets, emails, and half-baked notes.
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                Critical risks went unnoticed. Careers and lives cut short.
              </p>
            </div>
          </div>
        </section>

        {/* The Hero Section (Unique Mechanism) */}
        <section className="w-full py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-6 leading-tight">
                Enhanced Health brings all your bloodwork into one clean, AI-powered dashboard.
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
                No more digging through files. No more guessing. Just clarity and control.
              </p>
              <div className="mx-auto max-w-3xl">
                <div className="aspect-video bg-muted rounded-lg border shadow-lg flex items-center justify-center">
                  <p className="text-muted-foreground">Dashboard Mockup Preview</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Transformation Section */}
        <section className="w-full py-16 md:py-24 bg-muted/30">
          <div className="container px-4 md:px-6">
            <div className="grid gap-12 md:grid-cols-2 items-stretch max-w-6xl mx-auto">
              <div className="text-center bg-primary/5 rounded-2xl p-8 border border-primary/10 hover-scale flex flex-col justify-center min-h-[300px]">
                <ShieldIcon className="h-16 w-16 text-primary mx-auto mb-6 flex-shrink-0" />
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 leading-tight">Peace of Mind</h3>
                <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                  Know what's happening inside your body before it's too late.
                </p>
              </div>
              <div className="text-center bg-primary/5 rounded-2xl p-8 border border-primary/10 hover-scale flex flex-col justify-center min-h-[300px]">
                <TrendingUpIcon className="h-16 w-16 text-primary mx-auto mb-6 flex-shrink-0" />
                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 leading-tight">Performance Longevity</h3>
                <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                  Push harder, longer — without pushing your luck.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Key Features Section */}
        <section className="w-full py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-12 leading-tight">
                Everything you need, nothing you don't
              </h2>
              <div className="grid gap-8 md:grid-cols-2">
                <div className="flex gap-4">
                  <BrainIcon className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold mb-2 leading-tight">AI-Powered Insights</h3>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">Your labs, translated into clear, actionable health signals.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <CheckIcon className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold mb-2 leading-tight">One Dashboard</h3>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">All results in one place. No more spreadsheets.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <ShieldIcon className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold mb-2 leading-tight">Risk Alerts</h3>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">Get flagged before small problems become career-ending.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <TrendingUpIcon className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-lg sm:text-xl font-semibold mb-2 leading-tight">Performance Tracking</h3>
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">See trends across cycles, off-seasons, and peak prep.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Social Proof Section */}
        <section className="w-full py-20 md:py-28 bg-primary text-primary-foreground">
          <div className="container px-4 md:px-6">
            <div className="text-center">
              <p className="text-2xl md:text-4xl lg:text-5xl font-bold tracking-wide">
                Built by athletes, for athletes.
              </p>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="w-full py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                Sign up free today. Gain clarity. Extend your career.
              </h2>
              <div className="mb-6">
                <Button 
                  size="lg"
                  className="px-12 py-8 text-xl font-semibold"
                  onClick={() => navigate("/sign-up")}
                >
                  → Create Your Account
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                No downloads. Instant access.
              </p>
            </div>
          </div>
        </section>

        {/* Closing Section */}
        <section className="w-full py-16 md:py-24 bg-primary text-primary-foreground">
          <div className="container px-4 md:px-6">
            <div className="text-center max-w-3xl mx-auto space-y-8">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold leading-tight">
                One more thing...
              </h2>
              <p className="text-base sm:text-lg md:text-xl opacity-90 leading-relaxed">
                This isn't just about bloodwork. It's about giving enhanced athletes the chance to live longer, perform better, and control their health like never before. The future of bodybuilding health starts here.
              </p>
              <Button 
                size="lg"
                variant="secondary"
                className="px-8 py-6 text-lg font-semibold"
                onClick={() => navigate("/sign-up")}
              >
                Start Your Journey
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;