
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { format, addWeeks } from "date-fns";
import { Input } from "@/components/ui/input";
import { useCycle, CyclePeriod, CyclePlanEntry } from "@/contexts/CycleContext";

interface WeekByWeekTableProps {
  selectedCyclePeriod: CyclePeriod | null;
  cyclePlans: CyclePlanEntry[];
  onUpdateCyclePlan: (weekNumber: number, weeklyDose: number) => void;
}

const WeekByWeekTable = ({ 
  selectedCyclePeriod,
  cyclePlans,
  onUpdateCyclePlan
}: WeekByWeekTableProps) => {
  if (!selectedCyclePeriod) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        Select a cycle period to view the week-by-week plan
      </div>
    );
  }
  
  // Generate weeks for the selected cycle period
  const weeks = [];
  for (
    let weekNum = selectedCyclePeriod.startWeek; 
    weekNum <= selectedCyclePeriod.endWeek; 
    weekNum++
  ) {
    weeks.push(weekNum);
  }

  // Get Monday date for each week
  const getWeekStartDate = (weekNumber: number) => {
    // Calculate weeks difference from the cycle start week
    const weeksDiff = weekNumber - selectedCyclePeriod.startWeek;
    // Add that many weeks to the cycle start date to get the Monday of that week
    return addWeeks(selectedCyclePeriod.startDate, weeksDiff);
  };

  // Find compound entries for the cycle
  const uniqueCompounds = [...new Set(
    cyclePlans
      .filter(plan => plan.weekNumber >= selectedCyclePeriod.startWeek && 
                    plan.weekNumber <= selectedCyclePeriod.endWeek)
      .map(plan => plan.compound)
  )];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">
        {selectedCyclePeriod.name}: Week-by-Week Plan
      </h3>
      
      {uniqueCompounds.length > 0 ? (
        uniqueCompounds.map(compound => (
          <div key={compound} className="border rounded-md p-4">
            <h4 className="font-medium mb-3">{compound}</h4>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Week</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Weekly Dose</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {weeks.map(weekNumber => {
                  const plan = cyclePlans.find(
                    p => p.weekNumber === weekNumber && p.compound === compound
                  );
                  const weekDate = getWeekStartDate(weekNumber);
                  
                  return (
                    <TableRow key={`${compound}-week-${weekNumber}`}>
                      <TableCell>Week {weekNumber}</TableCell>
                      <TableCell>{format(weekDate, 'MMM d, yyyy')}</TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={plan?.weeklyDose || 0}
                          onChange={(e) => onUpdateCyclePlan(weekNumber, Number(e.target.value))}
                          className="w-28"
                        />
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          Update
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        ))
      ) : (
        <div className="text-center py-8 text-muted-foreground border rounded-md">
          No compounds added to this cycle yet. Add compounds on the Week Plan tab.
        </div>
      )}
    </div>
  );
};

export default WeekByWeekTable;
