
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";

interface PEDEntry {
  name: string;
  dosingPer1ML: number;
  weeklyDose: number;
  mlPerInjection: number;
}

const InjectionPlanner = () => {
  const [selectedDays, setSelectedDays] = useState<string[]>([]);

  const daysOfWeek = [
    { label: "Mon", value: "monday" },
    { label: "Tue", value: "tuesday" },
    { label: "Wed", value: "wednesday" },
    { label: "Thu", value: "thursday" },
    { label: "Fri", value: "friday" },
    { label: "Sat", value: "saturday" },
    { label: "Sun", value: "sunday" },
  ];

  const toggleDay = (day: string) => {
    setSelectedDays(prev => 
      prev.includes(day) 
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  };

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
        <div className="space-y-4">
          <p className="text-sm font-medium">Current Cycle Compounds</p>
          <div className="text-sm text-muted-foreground bg-muted p-4 rounded-md">
            Please add compounds in the Cycle Planner to see their injection schedules here.
          </div>
        </div>
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
