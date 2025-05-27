
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Edit2, Check, X } from "lucide-react";
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

interface CycleCompoundsProps {
  selectedCyclePeriod: CyclePeriod | null;
  cyclePlans: CyclePlanEntry[];
  onAddCyclePlan: (plan: any) => void;
  onUpdateCyclePlan?: (weekNumber: number, weeklyDose: number, compound: string) => void;
  onRemoveCompound?: (compound: string, cyclePeriod: CyclePeriod) => void;
}

const CycleCompounds = ({ 
  selectedCyclePeriod,
  cyclePlans,
  onAddCyclePlan,
  onUpdateCyclePlan,
  onRemoveCompound
}: CycleCompoundsProps) => {
  const [newCompound, setNewCompound] = useState({
    compound: "",
    dosingPer1ML: 250,
    unit: "mg"
  });

  const [editingCompound, setEditingCompound] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<{
    dosingPer1ML: number;
    unit: string;
  }>({
    dosingPer1ML: 250,
    unit: "mg"
  });

  if (!selectedCyclePeriod) {
    return (
      <div className="text-center py-4 text-muted-foreground">
        Select a cycle period to manage compounds
      </div>
    );
  }

  // Find unique compounds that have been added to this cycle
  const uniqueCompounds = [...new Set(
    cyclePlans
      .filter(plan => plan.weekNumber >= selectedCyclePeriod.startWeek && 
                    plan.weekNumber <= selectedCyclePeriod.endWeek)
      .map(plan => plan.compound)
  )];

  // Get compound details
  const getCompoundDetails = (compound: string) => {
    const plan = cyclePlans.find(
      p => p.compound === compound && 
           p.weekNumber >= selectedCyclePeriod.startWeek && 
           p.weekNumber <= selectedCyclePeriod.endWeek
    );
    return plan;
  };

  const handleAddCompound = () => {
    if (!newCompound.compound || uniqueCompounds.includes(newCompound.compound)) {
      return;
    }

    // Add this compound to all weeks of the cycle with default values
    for (let week = selectedCyclePeriod.startWeek; week <= selectedCyclePeriod.endWeek; week++) {
      const newPlan = {
        id: `${Date.now()}-${week}`,
        compound: newCompound.compound,
        weeklyDose: 0,
        dosingPer1ML: newCompound.dosingPer1ML,
        unit: newCompound.unit,
        frequency: 2,
        weekNumber: week,
      };
      
      onAddCyclePlan(newPlan);
    }
    
    // Reset form
    setNewCompound({
      compound: "",
      dosingPer1ML: 250,
      unit: "mg"
    });
  };

  const handleRemoveCompound = (compound: string) => {
    if (onRemoveCompound && selectedCyclePeriod) {
      onRemoveCompound(compound, selectedCyclePeriod);
    }
  };

  const handleEditCompound = (compound: string) => {
    const details = getCompoundDetails(compound);
    if (details) {
      setEditValues({
        dosingPer1ML: details.dosingPer1ML,
        unit: details.unit
      });
      setEditingCompound(compound);
    }
  };

  const handleSaveEdit = (compound: string) => {
    // Update all instances of this compound in the cycle with new values
    if (onUpdateCyclePlan) {
      cyclePlans
        .filter(plan => 
          plan.compound === compound && 
          plan.weekNumber >= selectedCyclePeriod.startWeek && 
          plan.weekNumber <= selectedCyclePeriod.endWeek
        )
        .forEach(plan => {
          // We need a way to update the compound details, not just the weekly dose
          // For now, we'll use the existing onUpdateCyclePlan but we may need to extend it
          onUpdateCyclePlan(plan.weekNumber, plan.weeklyDose, compound);
        });
    }
    setEditingCompound(null);
  };

  const handleCancelEdit = () => {
    setEditingCompound(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">
          {selectedCyclePeriod.name}: Cycle Compounds
        </h3>
        
        {/* Current Compounds */}
        {uniqueCompounds.length > 0 ? (
          <div className="space-y-3 mb-6">
            {uniqueCompounds.map(compound => {
              const details = getCompoundDetails(compound);
              const isEditing = editingCompound === compound;
              
              return (
                <Card key={compound}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium mb-2">{compound}</h4>
                        {isEditing ? (
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-2">
                              <Label className="text-xs">Dosing Per 1ml:</Label>
                              <Input
                                type="number"
                                value={editValues.dosingPer1ML}
                                onChange={(e) => setEditValues(prev => ({
                                  ...prev,
                                  dosingPer1ML: Number(e.target.value)
                                }))}
                                className="w-20 h-8 text-sm"
                              />
                              <Select
                                value={editValues.unit}
                                onValueChange={(value) => setEditValues(prev => ({
                                  ...prev,
                                  unit: value
                                }))}
                              >
                                <SelectTrigger className="w-16 h-8">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="mg">mg</SelectItem>
                                  <SelectItem value="mcg">mcg</SelectItem>
                                  <SelectItem value="iu">IU</SelectItem>
                                </SelectContent>
                              </Select>
                              <span className="text-sm">/ml</span>
                            </div>
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            Dosing Per 1ml: {details?.dosingPer1ML || 250} {details?.unit || 'mg'}/ml
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        {isEditing ? (
                          <>
                            <Button 
                              variant="outline" 
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleSaveEdit(compound)}
                              title="Save changes"
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="icon"
                              className="h-8 w-8"
                              onClick={handleCancelEdit}
                              title="Cancel editing"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button 
                              variant="outline" 
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleEditCompound(compound)}
                              title="Edit compound"
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => handleRemoveCompound(compound)}
                              title="Remove compound"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground border rounded-md mb-6">
            No compounds added to this cycle yet. Add compounds below to start planning.
          </div>
        )}

        {/* Add New Compound */}
        <Card>
          <CardHeader>
            <CardTitle className="text-md">Add Compound</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="compound">Compound</Label>
                <Select 
                  value={newCompound.compound}
                  onValueChange={(value) => setNewCompound(prev => ({ ...prev, compound: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select compound" />
                  </SelectTrigger>
                  <SelectContent>
                    {compounds
                      .filter(compound => !uniqueCompounds.includes(compound))
                      .map(compound => (
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
                    value={newCompound.dosingPer1ML}
                    onChange={(e) => setNewCompound(prev => ({ 
                      ...prev, 
                      dosingPer1ML: Number(e.target.value) 
                    }))}
                    placeholder="250"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unit">Unit</Label>
                  <Select 
                    value={newCompound.unit}
                    onValueChange={(value) => setNewCompound(prev => ({ ...prev, unit: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mg">mg</SelectItem>
                      <SelectItem value="mcg">mcg</SelectItem>
                      <SelectItem value="iu">IU</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button 
                onClick={handleAddCompound} 
                className="w-full"
                disabled={!newCompound.compound || uniqueCompounds.includes(newCompound.compound)}
              >
                Add Compound to Cycle
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CycleCompounds;
