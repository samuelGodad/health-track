
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

interface PEDEntry {
  name: string;
  dosingPer1ML: number;
  weeklyDose: number;
  mlPerInjection: number;
}

const InjectionPlanner = () => {
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [peds, setPeds] = useState<PEDEntry[]>([]);

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

  const calculateMLPerInjection = (dosingPer1ML: number, weeklyDose: number): number => {
    if (!dosingPer1ML || !weeklyDose || selectedDays.length === 0) return 0;
    const injectionsPerWeek = selectedDays.length;
    return Number(((weeklyDose / dosingPer1ML) / injectionsPerWeek).toFixed(2));
  };

  const addPED = () => {
    setPeds(prev => [...prev, {
      name: "",
      dosingPer1ML: 0,
      weeklyDose: 0,
      mlPerInjection: 0
    }]);
  };

  const updatePED = (index: number, field: keyof PEDEntry, value: string | number) => {
    setPeds(prev => {
      const newPeds = [...prev];
      newPeds[index] = {
        ...newPeds[index],
        [field]: field === 'name' ? value : Number(value),
        mlPerInjection: field !== 'name' ? 
          calculateMLPerInjection(
            field === 'dosingPer1ML' ? Number(value) : prev[index].dosingPer1ML,
            field === 'weeklyDose' ? Number(value) : prev[index].weeklyDose
          ) : prev[index].mlPerInjection
      };
      return newPeds;
    });
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

      <div className="space-y-4">
        {peds.map((ped, index) => (
          <Card key={index} className="p-4">
            <div className="grid grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium mb-1 block">PED To Inject</label>
                <Input
                  value={ped.name}
                  onChange={e => updatePED(index, 'name', e.target.value)}
                  placeholder="Enter PED name"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Dosing Per 1ML</label>
                <Input
                  type="number"
                  value={ped.dosingPer1ML || ''}
                  onChange={e => updatePED(index, 'dosingPer1ML', e.target.value)}
                  placeholder="mg/ml"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Weekly Dose</label>
                <Input
                  type="number"
                  value={ped.weeklyDose || ''}
                  onChange={e => updatePED(index, 'weeklyDose', e.target.value)}
                  placeholder="mg/week"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">ML Per Injection</label>
                <Input
                  value={ped.mlPerInjection}
                  readOnly
                  className="bg-muted"
                />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Button onClick={addPED} className="w-full">
        + Add Injectable PED
      </Button>

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
