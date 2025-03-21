
import { useState } from 'react';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { CalendarDaysIcon, CalendarIcon } from "lucide-react";

interface TrendToggleProps {
  onChange: (value: 'daily' | 'weekly') => void;
  value: 'daily' | 'weekly';
}

export function TrendToggle({ onChange, value }: TrendToggleProps) {
  return (
    <div className="flex items-center">
      <span className="text-sm font-medium mr-2 text-muted-foreground">View:</span>
      <ToggleGroup 
        type="single" 
        value={value}
        onValueChange={(val) => {
          if (val) onChange(val as 'daily' | 'weekly');
        }}
        className="border rounded-md"
      >
        <ToggleGroupItem value="daily">
          <CalendarIcon className="h-4 w-4 mr-1" />
          <span>Daily</span>
        </ToggleGroupItem>
        <ToggleGroupItem value="weekly">
          <CalendarDaysIcon className="h-4 w-4 mr-1" />
          <span>Weekly</span>
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}

export default TrendToggle;
