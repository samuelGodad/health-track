import { useState } from "react";
import { addWeeks, startOfWeek, endOfWeek, format, addDays, getISOWeek, parseISO } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon, Plus } from "lucide-react";
import { CycleType, useCycle, dateToWeekNumber } from "@/contexts/CycleContext";
import { Textarea } from "@/components/ui/textarea";

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

const WeeklyPlanner = () => {
  // Use the enhanced CycleContext
  const { 
    cyclePlans, 
    setCyclePlans,
    cyclePeriods,
    setCyclePeriods,
    currentWeek,
    setCurrentWeek,
    selectedDate,
    setSelectedDate 
  } = useCycle();
  
  const [showCyclePeriodForm, setShowCyclePeriodForm] = useState(false);
  
  // State for new cycle plan entry
  const [newCyclePlan, setNewCyclePlan] = useState({
    compound: "",
    weeklyDose: 0,
    dosingPer1ML: 0,
    unit: "mg",
    frequency: 2,
  });
  
  // State for new cycle period with dates
  const [newCyclePeriod, setNewCyclePeriod] = useState({
    type: CycleType.BLAST,
    startDate: selectedDate,
    endDate: addWeeks(selectedDate, 12),
    name: "",
    notes: "",
  });

  const startDate = startOfWeek(selectedDate, { weekStartsOn: 1 });
  const weekStart = format(addWeeks(startDate, currentWeek - 1), 'MMM d');
  const weekEnd = format(endOfWeek(addWeeks(startDate, currentWeek - 1), { weekStartsOn: 1 }), 'MMM d, yyyy');

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      const weekNumber = dateToWeekNumber(date);
      setCurrentWeek(weekNumber);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setNewCyclePlan((prev) => ({ ...prev, [field]: value }));
  };

  const handleCyclePeriodChange = (field: string, value: any) => {
    setNewCyclePeriod((prev) => ({ ...prev, [field]: value }));
  };

  const addCyclePlan = () => {
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

    setCyclePlans([...cyclePlans, newPlan]);
    
    setNewCyclePlan({
      compound: "",
      weeklyDose: 0,
      dosingPer1ML: 0,
      unit: "mg",
      frequency: 2,
    });
  };

  const addCyclePeriod = () => {
    if (!newCyclePeriod.name || !newCyclePeriod.startDate || !newCyclePeriod.endDate) {
      return;
    }
    
    // Calculate the week numbers for compatibility
    const startWeek = dateToWeekNumber(newCyclePeriod.startDate);
    const endWeek = dateToWeekNumber(newCyclePeriod.endDate);

    const newPeriod = {
      id: Date.now().toString(),
      type: newCyclePeriod.type,
      startDate: newCyclePeriod.startDate,
      endDate: newCyclePeriod.endDate,
      startWeek: startWeek,
      endWeek: endWeek,
      name: newCyclePeriod.name,
      notes: newCyclePeriod.notes,
    };

    setCyclePeriods([...cyclePeriods, newPeriod]);
    setShowCyclePeriodForm(false);
    
    // Reset form
    setNewCyclePeriod({
      type: CycleType.BLAST,
      startDate: selectedDate,
      endDate: addWeeks(selectedDate, 12),
      name: "",
      notes: "",
    });
  };

  // Get the current cycle type based on the week
  const getCurrentCycleType = () => {
    const currentPeriod = cyclePeriods.find(
      period => currentWeek >= period.startWeek && currentWeek <= period.endWeek
    );
    
    return currentPeriod?.type || null;
  };

  // Get the current cycle name based on the week
  const getCurrentCycleName = () => {
    const currentPeriod = cyclePeriods.find(
      period => currentWeek >= period.startWeek && currentWeek <= period.endWeek
    );
    
    return currentPeriod?.name || null;
  };

  // Get background color based on cycle type
  const getCycleTypeColor = (type: CycleType) => {
    switch (type) {
      case CycleType.BLAST:
        return "bg-red-100 border-red-300";
      case CycleType.CRUISE:
        return "bg-blue-100 border-blue-300";
      case CycleType.TRT:
        return "bg-green-100 border-green-300";
      case CycleType.OFF:
        return "bg-gray-100 border-gray-300";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  // Calculate cycle length in weeks
  const calculateCycleLength = () => {
    if (!newCyclePeriod.startDate || !newCyclePeriod.endDate) {
      return 0;
    }
    
    const startWeek = dateToWeekNumber(newCyclePeriod.startDate);
    const endWeek = dateToWeekNumber(newCyclePeriod.endDate);
    
    // Handle year boundary
    if (endWeek >= startWeek) {
      return endWeek - startWeek + 1;
    } else {
      return (52 - startWeek) + endWeek + 1;
    }
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
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="min-w-[240px] justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                Week {currentWeek} ({weekStart} - {weekEnd})
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="center">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>

          <Button 
            variant="outline" 
            onClick={() => setCurrentWeek(prev => Math.min(52, prev + 1))}
          >
            Next Week
          </Button>
        </div>
      </div>

      {/* Cycle Period Indicator */}
      <Card className={cn(
        "border-2",
        getCurrentCycleType() ? getCycleTypeColor(getCurrentCycleType()!) : "border-dashed border-gray-300"
      )}>
        <CardContent className="p-4 flex justify-between items-center">
          {getCurrentCycleType() ? (
            <div>
              <p className="font-semibold">{getCurrentCycleName()}</p>
              <p className="text-sm text-muted-foreground">{getCurrentCycleType()} Cycle</p>
            </div>
          ) : (
            <p className="text-muted-foreground">No cycle defined for this week</p>
          )}
          
          <Button 
            variant="outline" 
            onClick={() => setShowCyclePeriodForm(!showCyclePeriodForm)}
          >
            <Plus className="h-4 w-4 mr-2" />
            {showCyclePeriodForm ? "Cancel" : "Define Cycle"}
          </Button>
        </CardContent>
      </Card>
      
      {/* Cycle Period Form */}
      {showCyclePeriodForm && (
        <Card>
          <CardHeader>
            <CardTitle className="text-md">Create New Cycle</CardTitle>
          </CardHeader>
          <CardContent>
            <form 
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                addCyclePeriod();
              }}
            >
              <div className="space-y-2">
                <Label htmlFor="cycleName">Cycle Name</Label>
                <Input
                  id="cycleName"
                  value={newCyclePeriod.name}
                  onChange={(e) => handleCyclePeriodChange("name", e.target.value)}
                  placeholder="e.g. Summer Blast 2025"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="cycleType">Cycle Type</Label>
                  <Select
                    value={newCyclePeriod.type}
                    onValueChange={(value) => handleCyclePeriodChange("type", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={CycleType.BLAST}>Blast</SelectItem>
                      <SelectItem value={CycleType.CRUISE}>Cruise</SelectItem>
                      <SelectItem value={CycleType.TRT}>TRT</SelectItem>
                      <SelectItem value={CycleType.OFF}>Off Cycle</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {newCyclePeriod.startDate ? format(newCyclePeriod.startDate, 'PPP') : 'Select date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={newCyclePeriod.startDate}
                        onSelect={(date) => date && handleCyclePeriodChange("startDate", date)}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {newCyclePeriod.endDate ? format(newCyclePeriod.endDate, 'PPP') : 'Select date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={newCyclePeriod.endDate}
                        onSelect={(date) => date && handleCyclePeriodChange("endDate", date)}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cycleLength">Length</Label>
                  <Input
                    id="cycleLength"
                    value={`${calculateCycleLength()} weeks`}
                    disabled
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cycleNotes">Notes (Optional)</Label>
                <Textarea
                  id="cycleNotes"
                  value={newCyclePeriod.notes}
                  onChange={(e) => handleCyclePeriodChange("notes", e.target.value)}
                  placeholder="Add any notes about this cycle period"
                  rows={3}
                />
              </div>

              <Button type="submit" className="w-full">Create Cycle</Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Week Plan Card */}
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
              {cyclePlans.filter(plan => plan.weekNumber === currentWeek).length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                    No compounds planned for this week
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add Compound Card */}
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
                  value={newCyclePlan.frequency.toString()}
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
      
      {/* Cycle Periods Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-md">Year Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {cyclePeriods.length > 0 ? (
              cyclePeriods.map(period => (
                <div 
                  key={period.id} 
                  className={cn(
                    "p-4 rounded-md border-2", 
                    getCycleTypeColor(period.type)
                  )}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">{period.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {period.type} · {format(period.startDate, 'MMM d')} - {format(period.endDate, 'MMM d, yyyy')} 
                        ({period.endWeek - period.startWeek + 1} weeks)
                      </p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setCurrentWeek(period.startWeek)}
                    >
                      View
                    </Button>
                  </div>
                  {period.notes && (
                    <p className="mt-2 text-sm border-t pt-2 border-dashed">{period.notes}</p>
                  )}
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-4">
                No cycle periods defined yet. Use the "Define Cycle" button to create one.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WeeklyPlanner;
