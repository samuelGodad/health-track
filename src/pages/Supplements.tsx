
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PlusIcon, Save, Trash2, PencilIcon, PillIcon } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const frequencyOptions = [
  { value: 'daily', label: 'Daily' },
  { value: 'twice-daily', label: 'Twice Daily' },
  { value: 'three-times-daily', label: 'Three Times Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'as-needed', label: 'As Needed' },
];

const timingOptions = [
  { value: 'morning', label: 'Morning' },
  { value: 'pre-workout', label: 'Pre-Workout' },
  { value: 'post-workout', label: 'Post-Workout' },
  { value: 'with-meal', label: 'With Meal' },
  { value: 'before-bed', label: 'Before Bed' },
];

// Mock data for supplements
const mockSupplements = [
  { 
    id: 1, 
    name: 'Creatine Monohydrate', 
    dosage: '5g', 
    timing: 'post-workout', 
    frequency: 'daily',
    notes: 'Take with water or protein shake'
  },
  { 
    id: 2, 
    name: 'Vitamin D3', 
    dosage: '5000 IU', 
    timing: 'morning', 
    frequency: 'daily',
    notes: 'Take with fatty meal for better absorption'
  },
  { 
    id: 3, 
    name: 'Fish Oil', 
    dosage: '2000mg', 
    timing: 'with-meal', 
    frequency: 'daily',
    notes: 'Store in refrigerator'
  },
  { 
    id: 4, 
    name: 'ZMA', 
    dosage: '30mg Zinc, 450mg Magnesium, 10mg B6', 
    timing: 'before-bed', 
    frequency: 'daily',
    notes: 'Take on empty stomach'
  },
  { 
    id: 5, 
    name: 'Whey Protein', 
    dosage: '25g', 
    timing: 'post-workout', 
    frequency: 'daily',
    notes: 'Mix with water or milk'
  },
];

const Supplements = () => {
  const [supplements, setSupplements] = useState(mockSupplements);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingSupplementId, setEditingSupplementId] = useState<number | null>(null);

  const handleAddNew = () => {
    setIsAddingNew(true);
    setEditingSupplementId(null);
  };

  const handleEditSupplementToggle = (id: number) => {
    if (editingSupplementId === id) {
      setEditingSupplementId(null);
    } else {
      setEditingSupplementId(id);
      setIsAddingNew(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16 px-4 md:px-6 max-w-screen-xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Supplements</h1>
            <p className="text-muted-foreground">Track your supplement regimen and dosages</p>
          </div>
          
          <Button onClick={handleAddNew} className="flex items-center gap-2">
            <PlusIcon className="h-4 w-4" />
            Add New Supplement
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card className="border border-border/50 bg-card/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PillIcon className="h-5 w-5" />
                  Your Supplement Stack
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {supplements.length === 0 ? (
                    <div className="text-center p-6 text-muted-foreground">
                      No supplements added yet. Add your first supplement to get started.
                    </div>
                  ) : (
                    supplements.map((supplement) => (
                      <Card 
                        key={supplement.id} 
                        className="p-4 border border-border"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-lg">{supplement.name}</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                              <div>
                                <div className="text-sm text-muted-foreground">Dosage</div>
                                <div>{supplement.dosage}</div>
                              </div>
                              <div>
                                <div className="text-sm text-muted-foreground">Timing</div>
                                <div>{frequencyOptions.find(opt => opt.value === supplement.frequency)?.label}</div>
                              </div>
                              <div>
                                <div className="text-sm text-muted-foreground">When</div>
                                <div>{timingOptions.find(opt => opt.value === supplement.timing)?.label}</div>
                              </div>
                            </div>
                            {supplement.notes && (
                              <div className="mt-3 text-sm text-muted-foreground italic">
                                Note: {supplement.notes}
                              </div>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleEditSupplementToggle(supplement.id)}
                            >
                              <PencilIcon className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </div>

                        {editingSupplementId === supplement.id && (
                          <div className="mt-4 pt-4 border-t">
                            <form className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label htmlFor={`edit-name-${supplement.id}`}>Supplement Name</Label>
                                  <Input 
                                    id={`edit-name-${supplement.id}`} 
                                    defaultValue={supplement.name} 
                                  />
                                </div>
                                <div>
                                  <Label htmlFor={`edit-dosage-${supplement.id}`}>Dosage</Label>
                                  <Input 
                                    id={`edit-dosage-${supplement.id}`} 
                                    defaultValue={supplement.dosage} 
                                  />
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label htmlFor={`edit-frequency-${supplement.id}`}>Frequency</Label>
                                  <Select defaultValue={supplement.frequency}>
                                    <SelectTrigger id={`edit-frequency-${supplement.id}`}>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {frequencyOptions.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                          {option.label}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <Label htmlFor={`edit-timing-${supplement.id}`}>Timing</Label>
                                  <Select defaultValue={supplement.timing}>
                                    <SelectTrigger id={`edit-timing-${supplement.id}`}>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {timingOptions.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                          {option.label}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                              <div>
                                <Label htmlFor={`edit-notes-${supplement.id}`}>Notes</Label>
                                <Input 
                                  id={`edit-notes-${supplement.id}`} 
                                  defaultValue={supplement.notes} 
                                />
                              </div>
                              <div className="flex justify-end gap-2">
                                <Button 
                                  type="button" 
                                  variant="outline" 
                                  onClick={() => setEditingSupplementId(null)}
                                >
                                  Cancel
                                </Button>
                                <Button type="button">
                                  <Save className="h-4 w-4 mr-2" />
                                  Save Changes
                                </Button>
                              </div>
                            </form>
                          </div>
                        )}
                      </Card>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          
          {isAddingNew && (
            <div>
              <Card className="border border-border/50 bg-card/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Add New Supplement</CardTitle>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4">
                    <div>
                      <Label htmlFor="supplement-name">Supplement Name</Label>
                      <Input id="supplement-name" placeholder="e.g., Creatine Monohydrate" />
                    </div>
                    
                    <div>
                      <Label htmlFor="dosage">Dosage</Label>
                      <Input id="dosage" placeholder="e.g., 5g, 1000mg, etc." />
                    </div>
                    
                    <div>
                      <Label htmlFor="frequency">Frequency</Label>
                      <Select>
                        <SelectTrigger id="frequency">
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          {frequencyOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="timing">Timing</Label>
                      <Select>
                        <SelectTrigger id="timing">
                          <SelectValue placeholder="Select timing" />
                        </SelectTrigger>
                        <SelectContent>
                          {timingOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="notes">Notes (Optional)</Label>
                      <Input id="notes" placeholder="Any additional information" />
                    </div>
                    
                    <div className="flex justify-end gap-2">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setIsAddingNew(false)}
                      >
                        Cancel
                      </Button>
                      <Button type="button">
                        <Save className="h-4 w-4 mr-2" />
                        Save Supplement
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          )}
          
          {!isAddingNew && (
            <div>
              <Card className="border border-border/50 bg-card/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Supplements Info</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p>
                      Track all your supplements in one place. Add details about dosage, 
                      timing, and frequency to maintain your regimen effectively.
                    </p>
                    <p>
                      Remember to consult with a healthcare professional before starting 
                      any new supplement routine.
                    </p>
                    <Button 
                      onClick={handleAddNew} 
                      className="w-full"
                    >
                      <PlusIcon className="h-4 w-4 mr-2" />
                      Add New Supplement
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Supplements;
