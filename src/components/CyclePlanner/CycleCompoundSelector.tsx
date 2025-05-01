
import React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

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

interface CycleCompoundSelectorProps {
  cyclePlanEntries: any[];
  onAddCyclePlan: (plan: any) => void;
  currentWeek: number;
}

const CycleCompoundSelector = ({ 
  cyclePlanEntries, 
  onAddCyclePlan, 
  currentWeek 
}: CycleCompoundSelectorProps) => {
  const [newCyclePlan, setNewCyclePlan] = React.useState({
    compound: "",
    weeklyDose: 0,
    dosingPer1ML: 0,
    unit: "mg",
    frequency: 2, // Default to 2 injections per week
  });

  const handleInputChange = (field: string, value: any) => {
    setNewCyclePlan((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddCompound = () => {
    if (!newCyclePlan.compound || !newCyclePlan.weeklyDose || !newCyclePlan.dosingPer1ML) {
      return;
    }

    const newPlan = {
      id: Date.now().toString(),
      compound: newCyclePlan.compound,
      weeklyDose: newCyclePlan.weeklyDose,
      dosingPer1ML: newCyclePlan.dosingPer1ML,
      unit: newCyclePlan.unit,
      frequency: newCyclePlan.frequency,
      weekNumber: currentWeek,
    };

    onAddCyclePlan(newPlan);
    
    setNewCyclePlan({
      compound: "",
      weeklyDose: 0,
      dosingPer1ML: 0,
      unit: "mg",
      frequency: 2,
    });
  };

  return (
    <div className="space-y-6">
      {/* Week Plan Display */}
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
          {cyclePlanEntries.length > 0 ? (
            cyclePlanEntries.map(plan => (
              <TableRow key={plan.id}>
                <TableCell>{plan.compound}</TableCell>
                <TableCell>{plan.dosingPer1ML} {plan.unit}/ml</TableCell>
                <TableCell>{plan.weeklyDose} {plan.unit}</TableCell>
                <TableCell>
                  {((plan.weeklyDose / plan.dosingPer1ML) / plan.frequency).toFixed(2)}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                No compounds planned for this week
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Add Compound Form */}
      <form 
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          handleAddCompound();
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
        </div>

        <Button type="submit" className="w-full">Add to Week {currentWeek}</Button>
      </form>
    </div>
  );
};

export default CycleCompoundSelector;
