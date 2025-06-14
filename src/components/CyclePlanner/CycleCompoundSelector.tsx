
import React from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2 } from "lucide-react";

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
  onDeleteCompound?: (compound: string) => void;
  currentWeek: number;
  selectedCyclePeriod: any;
}

const CycleCompoundSelector = ({ 
  cyclePlanEntries, 
  onAddCyclePlan, 
  onDeleteCompound,
  currentWeek,
  selectedCyclePeriod
}: CycleCompoundSelectorProps) => {
  const [newCyclePlan, setNewCyclePlan] = React.useState({
    compound: "",
  });

  const handleInputChange = (field: string, value: any) => {
    setNewCyclePlan((prev) => ({ ...prev, [field]: value }));
  };

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

  // Get unique compounds that have been added to this cycle
  const uniqueCompounds = React.useMemo(() => {
    if (!selectedCyclePeriod) return [];
    
    const compoundsInCycle = cyclePlanEntries
      .filter(plan => isWeekInCyclePeriod(plan.weekNumber, selectedCyclePeriod.startWeek, selectedCyclePeriod.endWeek))
      .map(plan => plan.compound);
    
    return [...new Set(compoundsInCycle)];
  }, [cyclePlanEntries, selectedCyclePeriod]);

  const handleAddCompound = () => {
    if (!newCyclePlan.compound || !selectedCyclePeriod) {
      return;
    }

    // Check if compound already exists in this cycle
    const compoundExists = uniqueCompounds.includes(newCyclePlan.compound);
    if (compoundExists) {
      return; // Don't add duplicate compounds
    }

    const newPlan = {
      id: Date.now().toString(),
      compound: newCyclePlan.compound,
      weeklyDose: 0,
      dosingPer1ML: 250,
      unit: "mg",
      frequency: 2,
      weekNumber: selectedCyclePeriod.startWeek,
    };

    onAddCyclePlan(newPlan);
    
    setNewCyclePlan({
      compound: "",
    });
  };

  const handleDeleteCompound = (compound: string) => {
    if (onDeleteCompound) {
      onDeleteCompound(compound);
    }
  };

  // Filter out compounds that are already added to this cycle
  const availableCompounds = compounds.filter(compound => !uniqueCompounds.includes(compound));

  return (
    <div className="space-y-6">
      {/* Compounds Display */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>PED To Inject</TableHead>
            <TableHead className="w-[50px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {uniqueCompounds.length > 0 ? (
            uniqueCompounds.map(compound => (
              <TableRow key={compound}>
                <TableCell>{compound}</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteCompound(compound)}
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={2} className="text-center py-4 text-muted-foreground">
                No compounds planned for this cycle
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Add Compound Form */}
      {availableCompounds.length > 0 && (
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
                {availableCompounds.map(compound => (
                  <SelectItem key={compound} value={compound}>
                    {compound}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button type="submit" className="w-full" disabled={!newCyclePlan.compound}>
            Add Compound to Cycle
          </Button>
        </form>
      )}

      {availableCompounds.length === 0 && uniqueCompounds.length > 0 && (
        <div className="text-center py-4 text-muted-foreground border rounded-md">
          All available compounds have been added to this cycle
        </div>
      )}
    </div>
  );
};

export default CycleCompoundSelector;
