
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCycle } from "@/contexts/CycleContext";

const InjectionPlanner = () => {
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const { cyclePlans, currentWeek, cyclePeriods } = useCycle();

  const daysOfWeek = [
    { label: "Mon", value: "monday" },
    { label: "Tue", value: "tuesday" },
    { label: "Wed", value: "wednesday" },
    { label: "Thu", value: "thursday" },
    { label: "Fri", value: "friday" },
    { label: "Sat", value: "saturday" },
    { label: "Sun", value: "sunday" },
  ];

  // Get the current cycle period based on the week
  const getCurrentCyclePeriod = () => {
    return cyclePeriods.find(
      period => currentWeek >= period.startWeek && currentWeek <= period.endWeek
    );
  };

  // Set default injection days
  useEffect(() => {
    // Default to Monday and Thursday if no days are specified
    setSelectedDays(["monday", "thursday"]);
  }, [currentWeek, cyclePeriods]);

  const toggleDay = (day: string) => {
    setSelectedDays(prev => 
      prev.includes(day) 
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  };

  // Get current week's compounds
  const currentWeekCompounds = cyclePlans.filter(plan => plan.weekNumber === currentWeek);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">
          Choose which days of the week you take your injections ({selectedDays.length} selected)
        </p>
        <div className="flex flex-wrap gap-2">
          {daysOfWeek.map(day => (
            <Button
              key={day.value}
              variant={selectedDays.includes(day.value) ? "default" : "outline"}
              onClick={() => toggleDay(day.value)}
              className="w-[70px]"
            >
              {day.label}
            </Button>
          ))}
        </div>
      </div>

      <Card className="p-4">
        <CardHeader className="p-0 pb-4">
          <CardTitle className="text-md">Week {currentWeek} Compounds</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {currentWeekCompounds.length > 0 ? (
            <div className="space-y-4">
              {currentWeekCompounds.map(compound => (
                <div key={compound.id} className="bg-muted p-4 rounded-md">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{compound.compound}</p>
                      <p className="text-sm text-muted-foreground">
                        {compound.weeklyDose} {compound.unit} per week ({compound.frequency}x frequency)
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {((compound.weeklyDose / compound.dosingPer1ML) / compound.frequency).toFixed(2)} ml
                      </p>
                      <p className="text-xs text-muted-foreground">per injection</p>
                    </div>
                  </div>
                  
                  {selectedDays.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-dashed">
                      <p className="text-sm mb-2">Injection schedule:</p>
                      <div className="grid grid-cols-7 gap-1">
                        {daysOfWeek.map(day => (
                          <div 
                            key={day.value}
                            className={`text-center text-xs py-1 rounded ${
                              selectedDays.includes(day.value) 
                                ? 'bg-primary/20 text-primary-foreground' 
                                : 'bg-transparent text-muted-foreground'
                            }`}
                          >
                            {day.label}
                            {selectedDays.includes(day.value) && (
                              <p className="font-medium mt-1">
                                {((compound.weeklyDose / compound.dosingPer1ML) / selectedDays.length).toFixed(2)} ml
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-muted-foreground bg-muted p-4 rounded-md">
              Please add compounds in the Cycle Planner to see their injection schedules here.
            </div>
          )}
        </CardContent>
      </Card>

      <div className="text-sm text-muted-foreground">
        <p>Formula for "ML Per Injection":</p>
        <p className="font-mono bg-muted p-2 rounded mt-1">
          ML/inj = Weekly Dose / (Dosing per 1ML × Weekly Injections)
        </p>
      </div>
    </div>
  );
};

export default InjectionPlanner;
