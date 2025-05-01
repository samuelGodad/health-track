
import { useState } from "react";
import { addWeeks, startOfWeek, endOfWeek, format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CalendarIcon, Plus } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CycleType, useCycle, dateToWeekNumber } from "@/contexts/CycleContext";
import CycleCompoundSelector from "./CycleCompoundSelector";
import CyclePeriodForm from "./CyclePeriodForm";
import CyclePeriodOverview from "./CyclePeriodOverview";

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

  const handleAddCyclePlan = (newPlan: any) => {
    setCyclePlans([...cyclePlans, newPlan]);
  };

  const handleAddCyclePeriod = (newPeriod: any) => {
    setCyclePeriods([...cyclePeriods, newPeriod]);
    setShowCyclePeriodForm(false);
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

  // Get the current cycle's injection information
  const getCurrentCycleInjectionInfo = () => {
    const currentPeriod = cyclePeriods.find(
      period => currentWeek >= period.startWeek && currentWeek <= period.endWeek
    );
    
    if (!currentPeriod || !currentPeriod.injectionDays) {
      return null;
    }
    
    return {
      frequency: currentPeriod.injectionsPerWeek,
      days: currentPeriod.injectionDays
    };
  };

  const injectionInfo = getCurrentCycleInjectionInfo();

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
              {injectionInfo && (
                <p className="text-xs text-muted-foreground mt-1">
                  Injections: {injectionInfo.frequency}x/week on{' '}
                  {injectionInfo.days.map(day => day.charAt(0).toUpperCase() + day.slice(1, 3)).join(', ')}
                </p>
              )}
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
            <CyclePeriodForm 
              onSubmit={handleAddCyclePeriod}
              onCancel={() => setShowCyclePeriodForm(false)}
              selectedDate={selectedDate}
            />
          </CardContent>
        </Card>
      )}

      {/* Week Plan Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-md">Week {currentWeek} Plan</CardTitle>
        </CardHeader>
        <CardContent>
          <CycleCompoundSelector 
            cyclePlanEntries={cyclePlans.filter(plan => plan.weekNumber === currentWeek)}
            onAddCyclePlan={handleAddCyclePlan}
            currentWeek={currentWeek}
          />
        </CardContent>
      </Card>
      
      {/* Cycle Periods Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-md">Year Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <CyclePeriodOverview 
            cyclePeriods={cyclePeriods}
            onViewCycle={(weekNumber) => setCurrentWeek(weekNumber)}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default WeeklyPlanner;
