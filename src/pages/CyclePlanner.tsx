
import { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import WeeklyPlanner from "@/components/CyclePlanner/WeeklyPlanner";
import { CycleProvider } from "@/contexts/CycleContext";

const CyclePlanner = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <CycleProvider>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Cycle Planner</h2>
            <p className="text-muted-foreground">
              Plan and track your cycle details week by week
            </p>
          </div>
        </div>
        <Card>
          <CardContent className="pt-6">
            <WeeklyPlanner />
          </CardContent>
        </Card>
      </div>
    </CycleProvider>
  );
};

export default CyclePlanner;
