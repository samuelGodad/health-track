
import React from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { CycleType, dateToWeekNumber, ensureStartOfWeek } from "@/contexts/CycleContext";
import { endOfWeek } from "date-fns";

const daysOfWeek = [
  { label: "Mon", value: "monday" },
  { label: "Tue", value: "tuesday" },
  { label: "Wed", value: "wednesday" },
  { label: "Thu", value: "thursday" },
  { label: "Fri", value: "friday" },
  { label: "Sat", value: "saturday" },
  { label: "Sun", value: "sunday" },
];

interface CyclePeriodFormProps {
  onSubmit: (cyclePeriod: any) => void;
  onCancel: () => void;
  selectedDate: Date;
}

const CyclePeriodForm = ({ onSubmit, onCancel, selectedDate }: CyclePeriodFormProps) => {
  const [cyclePeriod, setCyclePeriod] = React.useState({
    type: CycleType.BLAST,
    startDate: ensureStartOfWeek(selectedDate),
    endDate: endOfWeek(ensureStartOfWeek(selectedDate), { weekStartsOn: 1 }),
    name: "",
    notes: "",
    injectionsPerWeek: 2,
    injectionDays: ["monday", "thursday"],
  });

  const handleCyclePeriodChange = (field: string, value: any) => {
    if (field === "startDate") {
      // Ensure start date is always a Monday (start of week)
      const adjustedDate = ensureStartOfWeek(value);
      
      // Also update end date to maintain the same duration from the new start date
      const currentDuration = cyclePeriod.endDate.getTime() - cyclePeriod.startDate.getTime();
      const newEndDate = new Date(adjustedDate.getTime() + currentDuration);
      
      setCyclePeriod((prev) => ({ 
        ...prev, 
        startDate: adjustedDate,
        endDate: newEndDate
      }));
    } else if (field === "endDate") {
      // Ensure end date is always a Sunday (end of week)
      const adjustedDate = endOfWeek(value, { weekStartsOn: 1 });
      setCyclePeriod((prev) => ({ ...prev, endDate: adjustedDate }));
    } else if (field === "injectionsPerWeek") {
      // Update the injection frequency and reset the days if needed
      const numInjections = Number(value);
      let injectionDays = [...cyclePeriod.injectionDays];
      
      // Limit the number of selected days to the injection frequency
      if (injectionDays.length > numInjections) {
        injectionDays = injectionDays.slice(0, numInjections);
      }
      
      setCyclePeriod((prev) => ({ 
        ...prev, 
        injectionsPerWeek: numInjections,
        injectionDays
      }));
    } else {
      setCyclePeriod((prev) => ({ ...prev, [field]: value }));
    }
  };

  const toggleInjectionDay = (day: string) => {
    const currentDays = [...cyclePeriod.injectionDays];
    
    // If day is already selected, remove it
    if (currentDays.includes(day)) {
      setCyclePeriod((prev) => ({
        ...prev,
        injectionDays: prev.injectionDays.filter(d => d !== day)
      }));
      return;
    }
    
    // Check if adding would exceed the frequency
    if (currentDays.length >= cyclePeriod.injectionsPerWeek) {
      return;
    }
    
    // Add the day
    setCyclePeriod((prev) => ({
      ...prev,
      injectionDays: [...prev.injectionDays, day]
    }));
  };

  // Calculate cycle length in weeks
  const calculateCycleLength = () => {
    if (!cyclePeriod.startDate || !cyclePeriod.endDate) {
      return 0;
    }
    
    const startWeek = dateToWeekNumber(cyclePeriod.startDate);
    const endWeek = dateToWeekNumber(cyclePeriod.endDate);
    
    // Handle year boundary
    if (endWeek >= startWeek) {
      return endWeek - startWeek + 1;
    } else {
      return (52 - startWeek) + endWeek + 1;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Calculate the week numbers for compatibility
    const startWeek = dateToWeekNumber(cyclePeriod.startDate);
    const endWeek = dateToWeekNumber(cyclePeriod.endDate);
    
    const newCyclePeriod = {
      ...cyclePeriod,
      id: Date.now().toString(),
      startWeek,
      endWeek,
    };
    
    onSubmit(newCyclePeriod);
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <Label htmlFor="cycleName">Cycle Name</Label>
        <Input
          id="cycleName"
          value={cyclePeriod.name}
          onChange={(e) => handleCyclePeriodChange("name", e.target.value)}
          placeholder="e.g. Summer Blast 2025"
          required
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="cycleType">Cycle Type</Label>
          <Select
            value={cyclePeriod.type}
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
          <Label>Start Date (Monday)</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {cyclePeriod.startDate ? format(cyclePeriod.startDate, 'PPP') : 'Select date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={cyclePeriod.startDate}
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
          <Label>End Date (Sunday)</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full justify-start text-left">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {cyclePeriod.endDate ? format(cyclePeriod.endDate, 'PPP') : 'Select date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={cyclePeriod.endDate}
                onSelect={(date) => date && handleCyclePeriodChange("endDate", date)}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="space-y-2">
          <Label htmlFor="cycleLength">Length</Label>
          <div className="flex items-center">
            <Input
              id="cycleLength"
              value={`${calculateCycleLength()} weeks`}
              disabled
              className="bg-gray-100"
            />
            <span className="ml-2 text-sm text-muted-foreground">
              Week {dateToWeekNumber(cyclePeriod.startDate)} - {dateToWeekNumber(cyclePeriod.endDate)}
            </span>
          </div>
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="injectionsPerWeek">Injections Per Week</Label>
        <Select
          value={cyclePeriod.injectionsPerWeek.toString()}
          onValueChange={(value) => handleCyclePeriodChange("injectionsPerWeek", Number(value))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select frequency" />
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
      
      <div className="space-y-2">
        <Label>Injection Days ({cyclePeriod.injectionDays.length}/{cyclePeriod.injectionsPerWeek} selected)</Label>
        <div className="flex flex-wrap gap-2">
          {daysOfWeek.map(day => (
            <Button
              key={day.value}
              type="button"
              variant={cyclePeriod.injectionDays.includes(day.value) ? "default" : "outline"}
              onClick={() => toggleInjectionDay(day.value)}
              className="w-[70px]"
              disabled={
                !cyclePeriod.injectionDays.includes(day.value) && 
                cyclePeriod.injectionDays.length >= cyclePeriod.injectionsPerWeek
              }
            >
              {day.label}
            </Button>
          ))}
        </div>
        {cyclePeriod.injectionDays.length < cyclePeriod.injectionsPerWeek && (
          <p className="text-sm text-amber-600">
            Please select {cyclePeriod.injectionsPerWeek - cyclePeriod.injectionDays.length} more day(s)
          </p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="cycleNotes">Notes (Optional)</Label>
        <Textarea
          id="cycleNotes"
          value={cyclePeriod.notes}
          onChange={(e) => handleCyclePeriodChange("notes", e.target.value)}
          placeholder="Add any notes about this cycle period"
          rows={3}
        />
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={
            !cyclePeriod.name || 
            !cyclePeriod.startDate || 
            !cyclePeriod.endDate ||
            cyclePeriod.injectionDays.length !== cyclePeriod.injectionsPerWeek
          }
        >
          Create Cycle
        </Button>
      </div>
    </form>
  );
};

export default CyclePeriodForm;
