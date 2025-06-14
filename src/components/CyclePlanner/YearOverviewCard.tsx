
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CyclePeriodOverview from "./CyclePeriodOverview";
import { useCycle } from "@/contexts/CycleContext";

const YearOverviewCard = () => {
  const { cyclePeriods, setCurrentWeek } = useCycle();
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-md">Year Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <CyclePeriodOverview 
          cyclePeriods={cyclePeriods}
        />
      </CardContent>
    </Card>
  );
};

export default YearOverviewCard;
