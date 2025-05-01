
import React from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CyclePeriod, CycleType } from "@/contexts/CycleContext";

interface CyclePeriodOverviewProps {
  cyclePeriods: CyclePeriod[];
  onViewCycle: (weekNumber: number) => void;
}

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

const CyclePeriodOverview = ({ cyclePeriods, onViewCycle }: CyclePeriodOverviewProps) => {
  return (
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
                  {period.type} · Week {period.startWeek} - Week {period.endWeek} 
                  ({period.endWeek - period.startWeek + 1} weeks)
                </p>
                <p className="text-xs text-muted-foreground">
                  {format(period.startDate, 'MMM d')} - {format(period.endDate, 'MMM d, yyyy')}
                </p>
                
                {/* Injection Schedule */}
                {period.injectionDays && period.injectionDays.length > 0 && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Injections: {period.injectionsPerWeek}x/week on{' '}
                    {period.injectionDays.map(day => day.charAt(0).toUpperCase() + day.slice(1, 3)).join(', ')}
                  </p>
                )}
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onViewCycle(period.startWeek)}
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
  );
};

export default CyclePeriodOverview;
