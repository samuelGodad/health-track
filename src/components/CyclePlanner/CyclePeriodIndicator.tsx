
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCycle, CycleType } from "@/contexts/CycleContext";

interface Props {
  showForm: boolean;
  setShowForm: (type: boolean) => void;
  getCurrentCycleType: () => CycleType | null;
  getCurrentCycleName: () => string | null;
}

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

const CyclePeriodIndicator = ({
  showForm,
  setShowForm,
  getCurrentCycleType,
  getCurrentCycleName,
}: Props) => {
  const type = getCurrentCycleType();
  return (
    <Card className={cn(
      "border-2",
      type ? getCycleTypeColor(type) : "border-dashed border-gray-300"
    )}>
      <CardContent className="p-4 flex justify-between items-center">
        {type ? (
          <div>
            <p className="font-semibold">{getCurrentCycleName()}</p>
            <p className="text-sm text-muted-foreground">{type} Cycle</p>
          </div>
        ) : (
          <p className="text-muted-foreground">No cycle defined for this week</p>
        )}
        <Button 
          variant="outline" 
          onClick={() => setShowForm(!showForm)}
        >
          <Plus className="h-4 w-4 mr-2" />
          {showForm ? "Cancel" : "Define Cycle"}
        </Button>
      </CardContent>
    </Card>
  );
};

export default CyclePeriodIndicator;
