
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Edit2, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { CyclePeriod, CycleType } from "@/contexts/CycleContext";

interface CyclePeriodOverviewProps {
  cyclePeriods: CyclePeriod[];
  onEdit?: (period: CyclePeriod) => void;
  onDelete?: (periodId: string) => void;
}

const CyclePeriodOverview = ({ cyclePeriods, onEdit, onDelete }: CyclePeriodOverviewProps) => {
  const getCycleTypeColor = (type: CycleType) => {
    switch (type) {
      case CycleType.BLAST:
        return "bg-red-100 text-red-800 border-red-300";
      case CycleType.CRUISE:
        return "bg-blue-100 text-blue-800 border-blue-300";
      case CycleType.TRT:
        return "bg-green-100 text-green-800 border-green-300";
      case CycleType.OFF:
        return "bg-gray-100 text-gray-800 border-gray-300";
      default:
        return "bg-gray-50 text-gray-600 border-gray-200";
    }
  };

  if (cyclePeriods.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">
            No cycle periods defined yet. Create your first cycle period to get started.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {cyclePeriods.map((period) => (
        <Card key={period.id} className={`border-l-4 ${getCycleTypeColor(period.type)}`}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CardTitle className="text-lg">{period.name}</CardTitle>
                <Badge variant="outline" className={getCycleTypeColor(period.type)}>
                  {period.type}
                </Badge>
              </div>
              <div className="flex gap-2">
                {onEdit && (
                  <Button variant="ghost" size="sm" onClick={() => onEdit(period)}>
                    <Edit2 className="h-4 w-4" />
                  </Button>
                )}
                {onDelete && (
                  <Button variant="ghost" size="sm" onClick={() => onDelete(period.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>
                  {format(period.startDate, "MMM d")} - {format(period.endDate, "MMM d, yyyy")}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Week:</span> {period.startWeek} - {period.endWeek}
              </div>
            </div>
            {period.notes && (
              <div className="mt-3 pt-3 border-t text-sm text-muted-foreground">
                {period.notes}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default CyclePeriodOverview;
