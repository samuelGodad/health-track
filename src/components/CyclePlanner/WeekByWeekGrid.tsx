import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format, addWeeks } from "date-fns";
import { Copy } from "lucide-react";
import { CyclePeriod, CyclePlanEntry } from "@/contexts/CycleContext";

// List of available compounds
const compounds = [
  "Testosterone Enanthate",
  "Testosterone Cypionate", 
  "Testosterone Propionate",
  "Nandrolone Decanoate",
  "Trenbolone Acetate",
  "Trenbolone Enanthate",
  "Boldenone Undecylenate",
  "Methenolone Enanthate",
  "Stanozolol",
  "Oxandrolone",
];

interface WeekByWeekGridProps {
  selectedCyclePeriod: CyclePeriod | null;
  cyclePlans: CyclePlanEntry[];
  onAddCyclePlan: (plan: any) => void;
  onUpdateCyclePlan: (weekNumber: number, weeklyDose: number, compound: string) => void;
}

const WeekByWeekGrid = ({ 
  selectedCyclePeriod,
  cyclePlans,
  onAddCyclePlan,
  onUpdateCyclePlan
}: WeekByWeekGridProps) => {
  const [selectedCompounds, setSelectedCompounds] = useState<string[]>([]);

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
    const weeksDiff = weekNumber - selectedCyclePeriod.startWeek;
    return addWeeks(selectedCyclePeriod.startDate, weeksDiff);
  };

  // Find unique compounds that have been added to this cycle
  const uniqueCompounds = [...new Set(
    cyclePlans
      .filter(plan => plan.weekNumber >= selectedCyclePeriod.startWeek && 
                    plan.weekNumber <= selectedCyclePeriod.endWeek)
      .map(plan => plan.compound)
  )];

  // Add a new compound column
  const addCompound = (compound: string) => {
    if (!selectedCompounds.includes(compound) && !uniqueCompounds.includes(compound)) {
      setSelectedCompounds([...selectedCompounds, compound]);
      
      // Add this compound to the first week with default values
      const newPlan = {
        id: Date.now().toString(),
        compound: compound,
        weeklyDose: 0,
        dosingPer1ML: 250, // Default dosing
        unit: "mg",
        frequency: 2,
        weekNumber: selectedCyclePeriod.startWeek,
      };
      onAddCyclePlan(newPlan);
    }
  };

  // Copy dose from previous week
  const copyFromPreviousWeek = (weekNumber: number, compound: string) => {
    if (weekNumber <= selectedCyclePeriod.startWeek) return;
    
    const prevWeekPlan = cyclePlans.find(
      plan => plan.weekNumber === (weekNumber - 1) && plan.compound === compound
    );
    
    if (prevWeekPlan) {
      onUpdateCyclePlan(weekNumber, prevWeekPlan.weeklyDose, compound);
    }
  };

  // Get plan for specific week and compound
  const getPlanForWeekAndCompound = (weekNumber: number, compound: string) => {
    return cyclePlans.find(
      plan => plan.weekNumber === weekNumber && plan.compound === compound
    );
  };

  // Calculate ML per week
  const calculateMLPerWeek = (weeklyDose: number, dosingPer1ML: number) => {
    return dosingPer1ML > 0 ? (weeklyDose / dosingPer1ML).toFixed(1) : '0';
  };

  const allCompounds = [...uniqueCompounds, ...selectedCompounds];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <h3 className="text-lg font-medium">
          {selectedCyclePeriod.name}: Week-by-Week Grid
        </h3>
        <Select onValueChange={addCompound}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Add compound" />
          </SelectTrigger>
          <SelectContent>
            {compounds
              .filter(compound => !allCompounds.includes(compound))
              .map(compound => (
                <SelectItem key={compound} value={compound}>
                  {compound}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>

      {allCompounds.length > 0 ? (
        <div className="border rounded-md overflow-hidden">
          <div className="overflow-x-auto">
            <Table className="min-w-full">
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-16 font-semibold">Week</TableHead>
                  <TableHead className="w-24 font-semibold">Date</TableHead>
                  {allCompounds.map(compound => (
                    <TableHead key={compound} className="text-center font-semibold min-w-32">
                      <div className="text-xs">{compound}</div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {weeks.map(weekNumber => {
                  const weekDate = getWeekStartDate(weekNumber);
                  
                  return (
                    <TableRow key={weekNumber} className="hover:bg-muted/25">
                      <TableCell className="font-medium text-center">{weekNumber}</TableCell>
                      <TableCell className="text-xs">{format(weekDate, 'MMM d')}</TableCell>
                      {allCompounds.map(compound => {
                        const plan = getPlanForWeekAndCompound(weekNumber, compound);
                        const weeklyDose = plan?.weeklyDose || 0;
                        
                        return (
                          <TableCell key={`${weekNumber}-${compound}`} className="p-1">
                            <div className="space-y-1">
                              <div className="flex items-center gap-1">
                                <Input
                                  type="number"
                                  value={weeklyDose}
                                  onChange={(e) => onUpdateCyclePlan(weekNumber, Number(e.target.value), compound)}
                                  className="h-7 w-16 text-xs"
                                  placeholder="0"
                                />
                                <span className="text-xs text-muted-foreground">mg</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Button 
                                  variant="outline" 
                                  size="icon" 
                                  className="h-6 w-6"
                                  onClick={() => copyFromPreviousWeek(weekNumber, compound)}
                                  disabled={weekNumber <= selectedCyclePeriod.startWeek}
                                  title="Copy from previous week"
                                >
                                  <Copy className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground border rounded-md">
          Add compounds to start planning your cycle doses week by week.
        </div>
      )}
    </div>
  );
};

export default WeekByWeekGrid;
