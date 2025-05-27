
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CyclePeriod, CyclePlanEntry } from "@/contexts/CycleContext";
import WeekByWeekTable from "./WeekByWeekTable";
import CycleCompounds from "./CycleCompounds";

interface CycleDetailsProps {
  currentWeek: number;
  cyclePeriods: CyclePeriod[];
  cyclePlans: CyclePlanEntry[];
  onAddCyclePlan: (plan: any) => void;
  onUpdateCyclePlan: (weekNumber: number, weeklyDose: number, compound: string) => void;
}

const CycleDetails = ({ 
  currentWeek, 
  cyclePeriods, 
  cyclePlans,
  onAddCyclePlan,
  onUpdateCyclePlan
}: CycleDetailsProps) => {
  // Find the current cycle period based on the week
  const currentCyclePeriod = cyclePeriods.find(
    period => currentWeek >= period.startWeek && currentWeek <= period.endWeek
  ) || null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-md">Cycle Planning</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="cycle-compounds">
          <TabsList className="mb-4">
            <TabsTrigger value="cycle-compounds">Cycle Compounds</TabsTrigger>
            <TabsTrigger value="week-table">Week by Week Table</TabsTrigger>
          </TabsList>
          
          <TabsContent value="cycle-compounds">
            <CycleCompounds 
              selectedCyclePeriod={currentCyclePeriod}
              cyclePlans={cyclePlans}
              onAddCyclePlan={onAddCyclePlan}
            />
          </TabsContent>
          
          <TabsContent value="week-table">
            <WeekByWeekTable 
              selectedCyclePeriod={currentCyclePeriod}
              cyclePlans={cyclePlans}
              onUpdateCyclePlan={onUpdateCyclePlan}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default CycleDetails;
