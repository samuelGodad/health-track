
import { useState } from "react";
import { addWeeks, startOfWeek, endOfWeek, format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface CyclePlanEntry {
  id: string;
  compound: string;
  weeklyDose: number;
  dosingPer1ML: number;
  unit: string;
  frequency: number;
  weekNumber: number;
}

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

const WeeklyPlanner = () => {
  const [currentWeek, setCurrentWeek] = useState(1);
  const [cyclePlans, setCyclePlans] = useState<CyclePlanEntry[]>([]);
  const [newCyclePlan, setNewCyclePlan] = useState<Partial<CyclePlanEntry>>({
    compound: "",
    weeklyDose: 0,
    dosingPer1ML: 0,
    unit: "mg",
    frequency: 2,
    weekNumber: 1,
  });

  const startDate = startOfWeek(new Date(), { weekStartsOn: 1 });
  const weekStart = format(addWeeks(startDate, currentWeek - 1), 'MMM d');
  const weekEnd = format(endOfWeek(addWeeks(startDate, currentWeek - 1), { weekStartsOn: 1 }), 'MMM d, yyyy');

  const handleInputChange = (field: keyof CyclePlanEntry, value: any) => {
    setNewCyclePlan((prev) => ({ ...prev, [field]: value }));
  };

  const addCyclePlan = () => {
    if (!newCyclePlan.compound || !newCyclePlan.weeklyDose || !newCyclePlan.dosingPer1ML) {
      return;
    }

    const newPlan: CyclePlanEntry = {
      id: Date.now().toString(),
      compound: newCyclePlan.compound || "",
      weeklyDose: newCyclePlan.weeklyDose || 0,
      dosingPer1ML: newCyclePlan.dosingPer1ML || 0,
      unit: newCyclePlan.unit || "mg",
      frequency: newCyclePlan.frequency || 2,
      weekNumber: currentWeek,
    };

    setCyclePlans([...cyclePlans, newPlan]);
    
    setNewCyclePlan({
      compound: "",
      weeklyDose: 0,
      dosingPer1ML: 0,
      unit: "mg",
      frequency: 2,
      weekNumber: currentWeek,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Cycle Planner</h2>
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            onClick={() => setCurrentWeek(prev => Math.max(1, prev - 1))}
            disabled={currentWeek === 1}
          >
            Previous Week
          </Button>
          <span className="font-medium">
            Week {currentWeek} ({weekStart} - {weekEnd})
          </span>
          <Button 
            variant="outline" 
            onClick={() => setCurrentWeek(prev => prev + 1)}
          >
            Next Week
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-md">Week {currentWeek} Plan</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>PED To Inject</TableHead>
                <TableHead>Dosing Per 1ML</TableHead>
                <TableHead>Weekly Dose</TableHead>
                <TableHead>ML Per Injection</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cyclePlans
                .filter(plan => plan.weekNumber === currentWeek)
                .map(plan => (
                  <TableRow key={plan.id}>
                    <TableCell>{plan.compound}</TableCell>
                    <TableCell>{plan.dosingPer1ML} {plan.unit}/ml</TableCell>
                    <TableCell>{plan.weeklyDose} {plan.unit}</TableCell>
                    <TableCell>
                      {((plan.weeklyDose / plan.dosingPer1ML) / plan.frequency).toFixed(2)}
                    </TableCell>
                  </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

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

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dosingPer1ML">Dosing Per 1ML</Label>
                <Input
                  id="dosingPer1ML"
                  type="number"
                  value={newCyclePlan.dosingPer1ML || ""}
                  onChange={(e) => handleInputChange("dosingPer1ML", Number(e.target.value))}
                  placeholder="Dosing per 1ML"
                />
              </div>
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
            </div>

            <Button type="submit" className="w-full">Add to Week {currentWeek}</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default WeeklyPlanner;
