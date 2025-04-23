
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import DashboardPreview from "@/components/DashboardPreview";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col overflow-hidden">
      <header className="fixed top-0 left-0 right-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="flex items-center gap-2 font-bold text-xl text-primary">
            Your Beta Health
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
        <ContainerScroll
          titleComponent={
            <div className="space-y-2 pt-16 md:pt-24">
              <h1 className="text-3xl md:text-5xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                Your Beta Health
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                Mastering Health Through Intelligent Insights
              </p>
            </div>
          }
        >
          <DashboardPreview />
        </ContainerScroll>
        
        <div className="flex justify-center -mt-32 md:-mt-48 mb-20 relative z-10">
          <Button 
            className="px-8 py-6 text-lg shadow-lg"
            onClick={() => navigate("/sign-up")}
          >
            Sign Up
          </Button>
        </div>
        
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-3 lg:gap-12 items-start">
              <div className="space-y-4">
                <div className="inline-block rounded-lg bg-primary p-2 text-white">
                  <svg
                    className=" h-6 w-6"
                    fill="none"
                    height="24"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Track Your Progress</h3>
                <p className="text-muted-foreground">
                  Monitor all your health metrics in one place, from weight and sleep to blood tests and supplements.
                </p>
              </div>
              <div className="space-y-4">
                <div className="inline-block rounded-lg bg-primary p-2 text-white">
                  <svg
                    className=" h-6 w-6"
                    fill="none"
                    height="24"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M2.97 12.92A2 2 0 0 0 2 14.63v3.24a2 2 0 0 0 .97 1.71l3 1.8a2 2 0 0 0 2.06 0L12 19v-5.5l-5-3-4.03 2.42Z" />
                    <path d="m7 16.5-4.74-2.85" />
                    <path d="m7 16.5 5-3" />
                    <path d="M7 16.5V21" />
                    <path d="M12 13.5V19l3.97 2.38a2 2 0 0 0 2.06 0l3-1.8a2 2 0 0 0 .97-1.71v-3.24a2 2 0 0 0-.97-1.71L17 10.5l-5 3Z" />
                    <path d="m17 16.5-5-3" />
                    <path d="m17 16.5 4.74-2.85" />
                    <path d="M17 16.5V21" />
                    <path d="M7.97 5.3A2 2 0 0 1 9.7 4.6l4.3 2.6 4.3-2.6a2 2 0 0 1 1.73-.1l-5 3-2.03-1.2-2.03 1.2-5-3a2 2 0 0 1 1.73.1Z" />
                    <path d="m12 8-2.03-1.2a2 2 0 0 0-2.03 0l-3 1.8A2 2 0 0 0 4 10.24v.76l5 3 5-3v-.76a2 2 0 0 0-.94-1.64l-3-1.8a2 2 0 0 0-2.06 0" />
                    <path d="M12 8v2.5" />
                    <path d="m4 11 5 3" />
                    <path d="m15 11 5 3" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Personalized Insights</h3>
                <p className="text-muted-foreground">
                  Get tailored recommendations based on your unique health profile and goals.
                </p>
              </div>
              <div className="space-y-4">
                <div className="inline-block rounded-lg bg-primary p-2 text-white">
                  <svg
                    className=" h-6 w-6"
                    fill="none"
                    height="24"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    width="24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Achieve Your Goals</h3>
                <p className="text-muted-foreground">
                  Whether it's weight management, better sleep, or optimizing your health markers, we help you reach your targets.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;
