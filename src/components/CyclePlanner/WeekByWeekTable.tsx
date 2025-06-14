
import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { format, addWeeks, getISOWeek } from "date-fns";
import { ChevronDown, ChevronRight, Copy, Plus } from "lucide-react";
import { useCycle, CyclePeriod, CyclePlanEntry } from "@/contexts/CycleContext";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

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
  const [expandedWeeks, setExpandedWeeks] = useState<Set<number>>(new Set());

  if (!selectedCyclePeriod) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        Select a cycle period to view the week-by-week plan
      </div>
    );
  }
  
  // Helper function to check if a week is within the cycle period (handles year crossing)
  const isWeekInCyclePeriod = (weekNumber: number, startWeek: number, endWeek: number) => {
    if (startWeek <= endWeek) {
      // Normal case: cycle doesn't cross years
      return weekNumber >= startWeek && weekNumber <= endWeek;
    } else {
      // Year crossing case: cycle spans across year boundary
      return weekNumber >= startWeek || weekNumber <= endWeek;
    }
  };

  // Generate weeks for the selected cycle period (handles year crossing)
  const weeks = [];
  if (selectedCyclePeriod.startWeek <= selectedCyclePeriod.endWeek) {
    // Normal case: cycle doesn't cross years
    for (let weekNum = selectedCyclePeriod.startWeek; weekNum <= selectedCyclePeriod.endWeek; weekNum++) {
      weeks.push(weekNum);
    }
  } else {
    // Year crossing case: cycle spans across year boundary
    // Add weeks from start week to end of year (week 52)
    for (let weekNum = selectedCyclePeriod.startWeek; weekNum <= 52; weekNum++) {
      weeks.push(weekNum);
    }
    // Add weeks from beginning of year to end week
    for (let weekNum = 1; weekNum <= selectedCyclePeriod.endWeek; weekNum++) {
      weeks.push(weekNum);
    }
  }

  // Get Monday date for each week
  const getWeekStartDate = (weekNumber: number) => {
    let weeksDiff;
    if (selectedCyclePeriod.startWeek <= selectedCyclePeriod.endWeek) {
      // Normal case
      weeksDiff = weekNumber - selectedCyclePeriod.startWeek;
    } else {
      // Year crossing case
      if (weekNumber >= selectedCyclePeriod.startWeek) {
        weeksDiff = weekNumber - selectedCyclePeriod.startWeek;
      } else {
        // Week in the next year
        weeksDiff = (52 - selectedCyclePeriod.startWeek + 1) + (weekNumber - 1);
      }
    }
    return addWeeks(selectedCyclePeriod.startDate, weeksDiff);
  };

  // Get week of year
  const getWeekOfYear = (weekNumber: number) => {
    const weekDate = getWeekStartDate(weekNumber);
    return getISOWeek(weekDate);
  };

  // Get week of cycle (1-based)
  const getWeekOfCycle = (weekNumber: number) => {
    if (selectedCyclePeriod.startWeek <= selectedCyclePeriod.endWeek) {
      // Normal case
      return weekNumber - selectedCyclePeriod.startWeek + 1;
    } else {
      // Year crossing case
      if (weekNumber >= selectedCyclePeriod.startWeek) {
        return weekNumber - selectedCyclePeriod.startWeek + 1;
      } else {
        // Week in the next year
        return (52 - selectedCyclePeriod.startWeek + 1) + weekNumber;
      }
    }
  };

  // Find unique compounds in the cycle (accounting for year crossing)
  const uniqueCompounds = [...new Set(
    cyclePlans
      .filter(plan => isWeekInCyclePeriod(plan.weekNumber, selectedCyclePeriod.startWeek, selectedCyclePeriod.endWeek))
      .map(plan => plan.compound)
  )];

  // Toggle week expansion
  const toggleWeek = (weekNumber: number) => {
    const newExpanded = new Set(expandedWeeks);
    if (newExpanded.has(weekNumber)) {
      newExpanded.delete(weekNumber);
    } else {
      newExpanded.add(weekNumber);
    }
    setExpandedWeeks(newExpanded);
  };

  // Function to get the previous week's dose for a compound
  const getPreviousWeekDose = (weekNumber: number, compound: string) => {
    const currentWeekIndex = weeks.indexOf(weekNumber);
    if (currentWeekIndex <= 0) return 0;
    
    const previousWeek = weeks[currentWeekIndex - 1];
    const prevWeekPlan = cyclePlans.find(
      plan => plan.weekNumber === previousWeek && plan.compound === compound
    );
    
    return prevWeekPlan?.weeklyDose || 0;
  };

  // Function to duplicate all doses from previous week
  const duplicateFromPreviousWeek = (weekNumber: number) => {
    const currentWeekIndex = weeks.indexOf(weekNumber);
    if (currentWeekIndex <= 0) return;
    
    uniqueCompounds.forEach(compound => {
      const previousDose = getPreviousWeekDose(weekNumber, compound);
      if (previousDose > 0) {
        onUpdateCyclePlan(weekNumber, previousDose, compound);
      }
    });
  };

  // Function to increment dose by 10%
  const incrementDose = (weekNumber: number, compound: string, currentDose: number) => {
    const newDose = Math.round(currentDose * 1.1);
    onUpdateCyclePlan(weekNumber, newDose, compound);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">
        {selectedCyclePeriod.name}: Week-by-Week Plan
      </h3>
      
      {uniqueCompounds.length > 0 ? (
        <div className="space-y-2">
          {weeks.map(weekNumber => {
            const weekDate = getWeekStartDate(weekNumber);
            const weekOfYear = getWeekOfYear(weekNumber);
            const weekOfCycle = getWeekOfCycle(weekNumber);
            const isExpanded = expandedWeeks.has(weekNumber);
            const currentWeekIndex = weeks.indexOf(weekNumber);
            
            return (
              <Collapsible 
                key={weekNumber} 
                open={isExpanded} 
                onOpenChange={() => toggleWeek(weekNumber)}
              >
                <div className="border rounded-md">
                  <CollapsibleTrigger asChild>
                    <div className="flex items-center justify-between p-4 hover:bg-muted/50 cursor-pointer">
                      <div className="flex items-center space-x-3">
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                        <div>
                          <h4 className="font-medium">Week {weekOfCycle} (Week {weekOfYear} of year)</h4>
                          <p className="text-sm text-muted-foreground">
                            {format(weekDate, 'MMM d, yyyy')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            duplicateFromPreviousWeek(weekNumber);
                          }}
                          disabled={currentWeekIndex <= 0}
                          title="Duplicate doses from previous week"
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Duplicate Previous Week
                        </Button>
                      </div>
                    </div>
                  </CollapsibleTrigger>
                  
                  <CollapsibleContent>
                    <div className="border-t p-4">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Compound</TableHead>
                            <TableHead>Weekly Dose (mg)</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {uniqueCompounds.map(compound => {
                            const plan = cyclePlans.find(
                              p => p.weekNumber === weekNumber && p.compound === compound
                            );
                            const weeklyDose = plan?.weeklyDose || 0;
                            
                            return (
                              <TableRow key={`${compound}-week-${weekNumber}`}>
                                <TableCell className="font-medium">{compound}</TableCell>
                                <TableCell>
                                  <Input
                                    type="number"
                                    value={weeklyDose || ''}
                                    onChange={(e) => {
                                      const value = e.target.value === '' ? 0 : Number(e.target.value);
                                      onUpdateCyclePlan(weekNumber, value, compound);
                                    }}
                                    className="w-24"
                                    placeholder="0"
                                  />
                                </TableCell>
                                <TableCell>
                                  <Button 
                                    variant="outline" 
                                    size="icon" 
                                    className="h-8 w-8"
                                    onClick={() => incrementDose(weekNumber, compound, weeklyDose)}
                                    title="Increase by 10%"
                                  >
                                    <Plus className="h-3 w-3" />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  </CollapsibleContent>
                </div>
              </Collapsible>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground border rounded-md">
          No compounds added to this cycle yet. Add compounds in step 2 first.
        </div>
      )}
    </div>
  );
};

export default WeekByWeekTable;
