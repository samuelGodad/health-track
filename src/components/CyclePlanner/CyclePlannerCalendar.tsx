
import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format, addDays } from "date-fns";

// Types for the cycle plan entries
interface CyclePlanEntry {
  id: string;
  compound: string;
  weeklyDose: number;
  unit: string;
  frequency: number; // Injections per week
  startDate: Date;
  endDate: Date;
}

// Default compounds for selection
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

const CyclePlannerCalendar = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [cyclePlans, setCyclePlans] = useState<CyclePlanEntry[]>([]);
  const [newCyclePlan, setNewCyclePlan] = useState<Partial<CyclePlanEntry>>({
    compound: "",
    weeklyDose: 0,
    unit: "mg",
    frequency: 2,
    startDate: new Date(),
    endDate: addDays(new Date(), 84), // Default to 12 weeks
  });

  const handleInputChange = (field: keyof CyclePlanEntry, value: any) => {
    setNewCyclePlan((prev) => ({ ...prev, [field]: value }));
  };

  const addCyclePlan = () => {
    if (!newCyclePlan.compound || !newCyclePlan.weeklyDose) {
      return;
    }

    const newPlan: CyclePlanEntry = {
      id: Date.now().toString(),
      compound: newCyclePlan.compound || "",
      weeklyDose: newCyclePlan.weeklyDose || 0,
      unit: newCyclePlan.unit || "mg",
      frequency: newCyclePlan.frequency || 2,
      startDate: newCyclePlan.startDate || new Date(),
      endDate: newCyclePlan.endDate || addDays(new Date(), 84),
    };

    setCyclePlans([...cyclePlans, newPlan]);
    
    // Reset form
    setNewCyclePlan({
      compound: "",
      weeklyDose: 0,
      unit: "mg",
      frequency: 2,
      startDate: new Date(),
      endDate: addDays(new Date(), 84),
    });
  };

  const currentWeekPlans = cyclePlans.filter(plan => {
    // Check if the selected date falls between start and end dates
    if (!date) return false;
    return date >= plan.startDate && date <= plan.endDate;
  });

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Cycle Planner</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-md">Select Cycle Week</CardTitle>
            </CardHeader>
            <CardContent>
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border"
                showOutsideDays
              />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-md">Add Compound</CardTitle>
            </CardHeader>
            <CardContent>
              <form 
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  addCyclePlan();
                }}
              >
                <div className="space-y-2">
                  <Label htmlFor="compound">Compound</Label>
                  <Select 
                    value={newCyclePlan.compound}
                    onValueChange={(value) => handleInputChange("compound", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select compound" />
                    </SelectTrigger>
                    <SelectContent>
                      {compounds.map(compound => (
                        <SelectItem key={compound} value={compound}>
                          {compound}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="weeklyDose">Weekly Dose</Label>
                    <Input
                      id="weeklyDose"
                      type="number"
                      value={newCyclePlan.weeklyDose || ""}
                      onChange={(e) => handleInputChange("weeklyDose", Number(e.target.value))}
                      placeholder="Weekly dose"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="unit">Unit</Label>
                    <Select
                      value={newCyclePlan.unit || "mg"}
                      onValueChange={(value) => handleInputChange("unit", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Unit" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mg">mg</SelectItem>
                        <SelectItem value="ml">ml</SelectItem>
                        <SelectItem value="iu">IU</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="frequency">Injections Per Week</Label>
                  <Select
                    value={newCyclePlan.frequency?.toString() || "2"}
                    onValueChange={(value) => handleInputChange("frequency", Number(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7].map(num => (
                        <SelectItem key={num} value={num.toString()}>
                          {num} {num === 1 ? "time" : "times"} per week
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button type="submit" className="w-full">Add to Cycle</Button>
              </form>
            </CardContent>
          </Card>

          {date && (
            <Card>
              <CardHeader>
                <CardTitle className="text-md">Week of {format(date, "MMMM d, yyyy")}</CardTitle>
              </CardHeader>
              <CardContent>
                {currentWeekPlans.length > 0 ? (
                  <div className="space-y-4">
                    {currentWeekPlans.map(plan => (
                      <div key={plan.id} className="flex justify-between items-center p-3 bg-secondary/10 rounded-lg">
                        <div>
                          <p className="font-medium">{plan.compound}</p>
                          <p className="text-sm text-muted-foreground">
                            {plan.weeklyDose} {plan.unit} per week ({plan.weeklyDose / plan.frequency} {plan.unit} × {plan.frequency}/week)
                          </p>
                        </div>
                        <Button variant="outline" size="sm">Edit</Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-4">No compounds scheduled for this week</p>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-md">Current Cycle Plan</CardTitle>
        </CardHeader>
        <CardContent>
          {cyclePlans.length > 0 ? (
            <div className="space-y-2">
              {cyclePlans.map(plan => (
                <div key={plan.id} className="flex flex-wrap justify-between items-center p-3 bg-secondary/10 rounded-lg">
                  <div>
                    <p className="font-medium">{plan.compound}</p>
                    <p className="text-sm text-muted-foreground">
                      {plan.weeklyDose} {plan.unit}/week • {plan.frequency}x weekly
                    </p>
                  </div>
                  <div className="text-sm">
                    <p>{format(plan.startDate, "MMM d")} - {format(plan.endDate, "MMM d, yyyy")}</p>
                    <p className="text-muted-foreground">
                      {Math.ceil((plan.endDate.getTime() - plan.startDate.getTime()) / (1000 * 60 * 60 * 24 * 7))} weeks
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-4">No active cycle plans</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CyclePlannerCalendar;
