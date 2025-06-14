
import React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
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
  });

  const handleInputChange = (field: string, value: any) => {
    setNewCyclePlan((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddCompound = () => {
    if (!newCyclePlan.compound) {
      return;
    }

    const newPlan = {
      id: Date.now().toString(),
      compound: newCyclePlan.compound,
      weeklyDose: 0, // Will be set in the dose planning step
      dosingPer1ML: 250, // Default value for internal calculations
      unit: "mg",
      frequency: 2,
      weekNumber: currentWeek,
    };

    onAddCyclePlan(newPlan);
    
    setNewCyclePlan({
      compound: "",
    });
  };

  return (
    <div className="space-y-6">
      {/* Week Plan Display */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>PED To Inject</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cyclePlanEntries.length > 0 ? (
            cyclePlanEntries.map(plan => (
              <TableRow key={plan.id}>
                <TableCell>{plan.compound}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={1} className="text-center py-4 text-muted-foreground">
                No compounds planned for this cycle
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

        <Button type="submit" className="w-full">Add Compound to Cycle</Button>
      </form>
    </div>
  );
};

export default CycleCompoundSelector;
