
import { useEffect } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import Navbar from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import WeeklyPlanner from "@/components/CyclePlanner/WeeklyPlanner";
import { CycleProvider } from "@/contexts/CycleContext";

const CyclePlanner = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <CycleProvider>
      <SidebarProvider>
        <div className="min-h-screen bg-background flex w-full">
          <AppSidebar />
          <div className="flex-1 flex flex-col">
            <Navbar />
            <main className="container mx-auto px-4 pt-20 pb-10">
              <div className="mb-6">
                <h1 className="text-2xl font-bold">Cycle Planner</h1>
                <p className="text-muted-foreground">
                  Plan and track your cycle details week by week
                </p>
              </div>
              <Card>
                <CardContent className="pt-6">
                  <WeeklyPlanner />
                </CardContent>
              </Card>
            </main>
          </div>
        </div>
      </SidebarProvider>
    </CycleProvider>
  );
};

export default CyclePlanner;
