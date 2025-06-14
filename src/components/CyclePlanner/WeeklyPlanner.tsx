import { useState } from "react";
import { addWeeks, startOfWeek, endOfWeek, format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CalendarIcon, Plus } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CycleType, useCycle, dateToWeekNumber } from "@/contexts/CycleContext";
import CyclePeriodForm from "./CyclePeriodForm";
import CyclePeriodOverview from "./CyclePeriodOverview";
import CycleDetails from "./CycleDetails";
import PlannerHeader from "./PlannerHeader";
import CyclePeriodIndicator from "./CyclePeriodIndicator";
import YearOverviewCard from "./YearOverviewCard";

const WeeklyPlanner = () => {
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

  const handleUpdateCyclePlan = (weekNumber: number, weeklyDose: number, compound: string) => {
    setCyclePlans(prev => {
      const existingPlanIndex = prev.findIndex(
        plan => plan.weekNumber === weekNumber && plan.compound === compound
      );
      
      if (existingPlanIndex >= 0) {
        const updated = [...prev];
        updated[existingPlanIndex] = {
          ...updated[existingPlanIndex],
          weeklyDose
        };
        return updated;
      } else {
        const newPlan = {
          id: Date.now().toString(),
          compound,
          weeklyDose,
          dosingPer1ML: 250,
          unit: "mg",
          frequency: 2,
          weekNumber,
        };
        return [...prev, newPlan];
      }
    });
  };

  const handleAddCyclePeriod = (newPeriod: any) => {
    setCyclePeriods([...cyclePeriods, newPeriod]);
    setShowCyclePeriodForm(false);
  };

  const handleRemoveCompound = (compound: string, cyclePeriod: any) => {
    setCyclePlans(prev => 
      prev.filter(plan => 
        !(plan.compound === compound && 
          plan.weekNumber >= cyclePeriod.startWeek && 
          plan.weekNumber <= cyclePeriod.endWeek)
      )
    );
  };

  const getCurrentCyclePeriod = () => {
    return cyclePeriods.find(
      period => currentWeek >= period.startWeek && currentWeek <= period.endWeek
    );
  };

  const getCurrentCycleType = () => {
    const currentPeriod = getCurrentCyclePeriod();
    return currentPeriod?.type || null;
  };

  const getCurrentCycleName = () => {
    const currentPeriod = getCurrentCyclePeriod();
    return currentPeriod?.name || null;
  };

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

  // UI section begins
  return (
    <div className="space-y-6">
      <PlannerHeader />
      <CyclePeriodIndicator
        showForm={showCyclePeriodForm}
        setShowForm={setShowCyclePeriodForm}
        getCurrentCycleType={getCurrentCycleType}
        getCurrentCycleName={getCurrentCycleName}
      />
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
      <CycleDetails 
        currentWeek={currentWeek}
        cyclePeriods={cyclePeriods}
        cyclePlans={cyclePlans}
        onAddCyclePlan={handleAddCyclePlan}
        onUpdateCyclePlan={handleUpdateCyclePlan}
        onRemoveCompound={handleRemoveCompound}
      />
      <YearOverviewCard />
    </div>
  );
};

export default WeeklyPlanner;
