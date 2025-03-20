
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  PlusIcon, 
  Save, 
  Trash2, 
  PencilIcon, 
  TargetIcon, 
  CalendarIcon,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Mock data for targets
const mockTargets = [
  { 
    id: 1, 
    metric: 'weight', 
    target: '80kg', 
    currentValue: '83.5kg',
    deadline: '2023-12-31',
    notes: 'Reduce body fat while maintaining muscle mass',
    status: 'in-progress'
  },
  { 
    id: 2, 
    metric: 'blood-pressure', 
    target: '120/80', 
    currentValue: '130/85',
    deadline: '2023-10-15',
    notes: 'Focus on cardio and reduce sodium intake',
    status: 'in-progress'
  },
  { 
    id: 3, 
    metric: 'protein', 
    target: '180g daily', 
    currentValue: '150g daily',
    deadline: '2023-09-30',
    notes: 'Increase lean protein sources in diet',
    status: 'in-progress'
  },
  { 
    id: 4, 
    metric: 'steps', 
    target: '10,000 daily', 
    currentValue: '7,500 daily',
    deadline: '2023-09-15',
    notes: 'Add morning walk to routine',
    status: 'in-progress'
  },
  { 
    id: 5, 
    metric: 'sleep', 
    target: '8 hours', 
    currentValue: '6.5 hours',
    deadline: '2023-09-30',
    notes: 'Establish consistent sleep/wake schedule',
    status: 'in-progress'
  },
];

const metricOptions = [
  { value: 'weight', label: 'Weight' },
  { value: 'body-fat', label: 'Body Fat %' },
  { value: 'blood-pressure', label: 'Blood Pressure' },
  { value: 'resting-heart-rate', label: 'Resting Heart Rate' },
  { value: 'steps', label: 'Steps' },
  { value: 'sleep', label: 'Sleep Duration' },
  { value: 'calories', label: 'Daily Calories' },
  { value: 'protein', label: 'Protein Intake' },
  { value: 'carbs', label: 'Carbs Intake' },
  { value: 'fats', label: 'Fats Intake' },
  { value: 'water', label: 'Water Intake' },
];

const statusOptions = [
  { value: 'not-started', label: 'Not Started' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
  { value: 'on-hold', label: 'On Hold' },
];

const Targets = () => {
  const [targets, setTargets] = useState(mockTargets);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingTargetId, setEditingTargetId] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

  const handleAddNew = () => {
    setIsAddingNew(true);
    setEditingTargetId(null);
  };

  const handleEditTargetToggle = (id: number) => {
    if (editingTargetId === id) {
      setEditingTargetId(null);
    } else {
      setEditingTargetId(id);
      setIsAddingNew(false);
    }
  };

  const getStatusClass = (status: string) => {
    switch(status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'on-hold':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800/60 dark:text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16 px-4 md:px-6 max-w-screen-xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Targets</h1>
            <p className="text-muted-foreground">Set and track your fitness and health goals</p>
          </div>
          
          <Button onClick={handleAddNew} className="flex items-center gap-2">
            <PlusIcon className="h-4 w-4" />
            Add New Target
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card className="border border-border/50 bg-card/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TargetIcon className="h-5 w-5" />
                  Your Current Targets
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {targets.length === 0 ? (
                    <div className="text-center p-6 text-muted-foreground">
                      No targets set yet. Add your first target to get started.
                    </div>
                  ) : (
                    targets.map((target) => (
                      <Card 
                        key={target.id} 
                        className="p-4 border border-border"
                      >
                        <div className="flex justify-between items-start">
                          <div className="w-full">
                            <div className="flex justify-between">
                              <h3 className="font-medium text-lg">
                                {metricOptions.find(opt => opt.value === target.metric)?.label || target.metric}
                              </h3>
                              <div className={cn("px-2.5 py-0.5 rounded-full text-xs font-medium", getStatusClass(target.status))}>
                                {statusOptions.find(opt => opt.value === target.status)?.label}
                              </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                              <div>
                                <div className="text-sm text-muted-foreground">Target</div>
                                <div className="font-medium">{target.target}</div>
                              </div>
                              <div>
                                <div className="text-sm text-muted-foreground">Current</div>
                                <div>{target.currentValue}</div>
                              </div>
                              <div>
                                <div className="text-sm text-muted-foreground">Deadline</div>
                                <div className="flex items-center gap-1">
                                  <CalendarIcon className="h-3.5 w-3.5 text-muted-foreground" />
                                  {target.deadline}
                                </div>
                              </div>
                            </div>
                            {target.notes && (
                              <div className="mt-3 text-sm text-muted-foreground">
                                {target.notes}
                              </div>
                            )}
                          </div>
                          <div className="flex gap-2 ml-4 shrink-0">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              onClick={() => handleEditTargetToggle(target.id)}
                            >
                              <PencilIcon className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </div>

                        {editingTargetId === target.id && (
                          <div className="mt-4 pt-4 border-t">
                            <form className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label htmlFor={`edit-metric-${target.id}`}>Metric</Label>
                                  <Select defaultValue={target.metric}>
                                    <SelectTrigger id={`edit-metric-${target.id}`}>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {metricOptions.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                          {option.label}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <Label htmlFor={`edit-status-${target.id}`}>Status</Label>
                                  <Select defaultValue={target.status}>
                                    <SelectTrigger id={`edit-status-${target.id}`}>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {statusOptions.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                          {option.label}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label htmlFor={`edit-target-${target.id}`}>Target Value</Label>
                                  <Input 
                                    id={`edit-target-${target.id}`} 
                                    defaultValue={target.target} 
                                  />
                                </div>
                                <div>
                                  <Label htmlFor={`edit-current-${target.id}`}>Current Value</Label>
                                  <Input 
                                    id={`edit-current-${target.id}`} 
                                    defaultValue={target.currentValue} 
                                  />
                                </div>
                              </div>
                              <div>
                                <Label htmlFor={`edit-deadline-${target.id}`}>Deadline</Label>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <Button
                                      variant="outline"
                                      className="w-full justify-start text-left font-normal"
                                    >
                                      <CalendarIcon className="mr-2 h-4 w-4" />
                                      {target.deadline ? (
                                        format(new Date(target.deadline), 'PPP')
                                      ) : (
                                        <span>Pick a date</span>
                                      )}
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent className="w-auto p-0">
                                    <Calendar
                                      mode="single"
                                      selected={target.deadline ? new Date(target.deadline) : undefined}
                                      initialFocus
                                    />
                                  </PopoverContent>
                                </Popover>
                              </div>
                              <div>
                                <Label htmlFor={`edit-notes-${target.id}`}>Notes</Label>
                                <Textarea 
                                  id={`edit-notes-${target.id}`} 
                                  defaultValue={target.notes} 
                                />
                              </div>
                              <div className="flex justify-end gap-2">
                                <Button 
                                  type="button" 
                                  variant="outline" 
                                  onClick={() => setEditingTargetId(null)}
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
                  <CardTitle>Add New Target</CardTitle>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4">
                    <div>
                      <Label htmlFor="metric">Metric</Label>
                      <Select>
                        <SelectTrigger id="metric">
                          <SelectValue placeholder="Select metric" />
                        </SelectTrigger>
                        <SelectContent>
                          {metricOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="target-value">Target Value</Label>
                      <Input id="target-value" placeholder="e.g., 80kg, 120/80, 8 hours" />
                    </div>
                    
                    <div>
                      <Label htmlFor="current-value">Current Value</Label>
                      <Input id="current-value" placeholder="Your current measurement" />
                    </div>
                    
                    <div>
                      <Label htmlFor="status">Status</Label>
                      <Select>
                        <SelectTrigger id="status">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          {statusOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label>Deadline</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {selectedDate ? (
                              format(selectedDate, 'PPP')
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={setSelectedDate}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    
                    <div>
                      <Label htmlFor="notes">Notes (Optional)</Label>
                      <Textarea id="notes" placeholder="Additional details or strategies" />
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
                        Save Target
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
                  <CardTitle>Targets Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 p-3 bg-secondary/50 rounded-lg">
                      <CheckCircle2 className="h-5 w-5 text-green-500 mt-1" />
                      <div>
                        <h3 className="font-medium">Targets Completed</h3>
                        <p className="text-2xl font-bold mt-1">1</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 p-3 bg-secondary/50 rounded-lg">
                      <Clock className="h-5 w-5 text-blue-500 mt-1" />
                      <div>
                        <h3 className="font-medium">In Progress</h3>
                        <p className="text-2xl font-bold mt-1">5</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 p-3 bg-secondary/50 rounded-lg">
                      <TargetIcon className="h-5 w-5 text-primary mt-1" />
                      <div>
                        <h3 className="font-medium">Total Targets</h3>
                        <p className="text-2xl font-bold mt-1">6</p>
                      </div>
                    </div>
                    
                    <Button 
                      onClick={handleAddNew} 
                      className="w-full mt-2"
                    >
                      <PlusIcon className="h-4 w-4 mr-2" />
                      Add New Target
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

export default Targets;
