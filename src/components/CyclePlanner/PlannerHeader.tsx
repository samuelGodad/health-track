
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { addWeeks, startOfWeek, endOfWeek, format } from "date-fns";
import { useCycle } from "@/contexts/CycleContext";

interface PlannerHeaderProps {
  onChangeShowCycleForm: () => void;
}

const PlannerHeader = () => {
  const { 
    currentWeek,
    setCurrentWeek,
    selectedDate,
    setSelectedDate,
  } = useCycle();

  const startDate = startOfWeek(selectedDate, { weekStartsOn: 1 });
  const weekStart = format(addWeeks(startDate, currentWeek - 1), 'MMM d');
  const weekEnd = format(endOfWeek(addWeeks(startDate, currentWeek - 1), { weekStartsOn: 1 }), 'MMM d, yyyy');

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;
    setSelectedDate(date);
    // Week update logic is in WeeklyPlanner
  };

  return (
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
  );
};

export default PlannerHeader;
