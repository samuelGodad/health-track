
import { useCycle } from "@/contexts/CycleContext";
import PlannerHeader from "./PlannerHeader";
import CycleWizard from "./CycleWizard";
import YearOverviewCard from "./YearOverviewCard";

const WeeklyPlanner = () => {
  const { cyclePeriods, setCurrentWeek } = useCycle();

  return (
    <div className="space-y-6">
      <PlannerHeader />
      <CycleWizard />
      <YearOverviewCard 
        cyclePeriods={cyclePeriods}
        onViewCycle={setCurrentWeek}
      />
    </div>
  );
};

export default WeeklyPlanner;
