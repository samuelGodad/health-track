
import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { format, addWeeks } from "date-fns";
import { Plus, Copy } from "lucide-react";
import { useCycle, CyclePeriod, CyclePlanEntry } from "@/contexts/CycleContext";

interface WeekByWeekTableProps {
  selectedCyclePeriod: CyclePeriod | null;
  cyclePlans: CyclePlanEntry[];
  onUpdateCyclePlan: (weekNumber: number, weeklyDose: number, compound: string) => void;
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

  // Find unique compounds in the cycle
  const uniqueCompounds = [...new Set(
    cyclePlans
      .filter(plan => plan.weekNumber >= selectedCyclePeriod.startWeek && 
                    plan.weekNumber <= selectedCyclePeriod.endWeek)
      .map(plan => plan.compound)
  )];

  // Function to get the previous week's dose for a compound
  const getPreviousWeekDose = (weekNumber: number, compound: string) => {
    if (weekNumber <= selectedCyclePeriod.startWeek) return 0;
    
    const prevWeekPlan = cyclePlans.find(
      plan => plan.weekNumber === (weekNumber - 1) && plan.compound === compound
    );
    
    return prevWeekPlan?.weeklyDose || 0;
  };

  // Function to copy dose from previous week
  const copyFromPreviousWeek = (weekNumber: number, compound: string) => {
    const previousDose = getPreviousWeekDose(weekNumber, compound);
    onUpdateCyclePlan(weekNumber, previousDose, compound);
  };

  // Function to increment dose by 10%
  const incrementDose = (weekNumber: number, compound: string, currentDose: number) => {
    const newDose = Math.round(currentDose * 1.1); // Increase by 10%
    onUpdateCyclePlan(weekNumber, newDose, compound);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">
        {selectedCyclePeriod.name}: Week-by-Week Plan
      </h3>
      
      {uniqueCompounds.length > 0 ? (
        uniqueCompounds.map(compound => {
          // Find the dosing per 1ML for this compound
          const dosageInfo = cyclePlans.find(plan => plan.compound === compound);
          
          return (
            <div key={compound} className="border rounded-md p-2 mb-4">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium">{compound}</h4>
                <div className="text-sm text-muted-foreground">
                  {dosageInfo ? `${dosageInfo.dosingPer1ML} ${dosageInfo.unit}/ml` : ''}
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <Table className="w-full">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-16">Week</TableHead>
                      <TableHead className="w-32">Date</TableHead>
                      <TableHead className="w-28">Weekly Dose</TableHead>
                      <TableHead className="w-24">ML/Week</TableHead>
                      <TableHead className="w-28">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {weeks.map(weekNumber => {
                      const plan = cyclePlans.find(
                        p => p.weekNumber === weekNumber && p.compound === compound
                      );
                      const weekDate = getWeekStartDate(weekNumber);
                      const weeklyDose = plan?.weeklyDose || 0;
                      const mlPerWeek = plan?.dosingPer1ML && plan.dosingPer1ML > 0 
                        ? (weeklyDose / plan.dosingPer1ML).toFixed(1) 
                        : '0';
                      
                      return (
                        <TableRow key={`${compound}-week-${weekNumber}`} className="h-10">
                          <TableCell className="py-1">{weekNumber}</TableCell>
                          <TableCell className="py-1 text-xs">{format(weekDate, 'MMM d, yyyy')}</TableCell>
                          <TableCell className="py-1">
                            <Input
                              type="number"
                              value={weeklyDose}
                              onChange={(e) => onUpdateCyclePlan(weekNumber, Number(e.target.value), compound)}
                              className="h-8 w-24 text-sm"
                            />
                          </TableCell>
                          <TableCell className="py-1 text-sm">{mlPerWeek}</TableCell>
                          <TableCell className="py-1">
                            <div className="flex space-x-1">
                              <Button 
                                variant="outline" 
                                size="icon" 
                                className="h-7 w-7"
                                onClick={() => copyFromPreviousWeek(weekNumber, compound)}
                                disabled={weekNumber <= selectedCyclePeriod.startWeek}
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="icon" 
                                className="h-7 w-7"
                                onClick={() => incrementDose(weekNumber, compound, weeklyDose)}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </div>
          );
        })
      ) : (
        <div className="text-center py-8 text-muted-foreground border rounded-md">
          No compounds added to this cycle yet. Add compounds on the Week Plan tab.
        </div>
      )}
    </div>
  );
};

export default WeekByWeekTable;
