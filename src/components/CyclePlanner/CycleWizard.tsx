
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Circle, Plus } from "lucide-react";
import { useCycle } from "@/contexts/CycleContext";
import CyclePeriodForm from "./CyclePeriodForm";
import CycleCompoundSelector from "./CycleCompoundSelector";
import WeekByWeekTable from "./WeekByWeekTable";

interface Step {
  id: string;
  title: string;
  description: string;
  completed: boolean;
}

const CycleWizard = () => {
  const { cyclePeriods, cyclePlans, setCyclePeriods, setCyclePlans } = useCycle();
  const [activeStep, setActiveStep] = useState<string>("create-cycle");
  const [showCyclePeriodForm, setShowCyclePeriodForm] = useState(false);
  const [selectedCyclePeriod, setSelectedCyclePeriod] = useState<any>(null);

  const steps: Step[] = [
    {
      id: "create-cycle",
      title: "Create Cycle Period",
      description: "Define your cycle timeline and type",
      completed: cyclePeriods.length > 0
    },
    {
      id: "select-compounds",
      title: "Select Compounds",
      description: "Choose your compounds for this cycle",
      completed: cyclePeriods.length > 0 && cyclePlans.length > 0
    },
    {
      id: "plan-doses",
      title: "Plan Doses Week by Week",
      description: "Set specific doses for each week",
      completed: false // We can add logic to check if doses are planned
    }
  ];

  const handleAddCyclePeriod = (newPeriod: any) => {
    setCyclePeriods([...cyclePeriods, newPeriod]);
    setShowCyclePeriodForm(false);
    // Automatically select the newly created cycle and move to next step
    setSelectedCyclePeriod(newPeriod);
    setActiveStep("select-compounds");
  };

  const handleSelectCycle = (period: any) => {
    setSelectedCyclePeriod(period);
    setActiveStep("select-compounds");
  };

  const handleAddCyclePlan = (newPlan: any) => {
    setCyclePlans([...cyclePlans, newPlan]);
  };

  const handleUpdateCyclePlan = (weekNumber: number, weeklyDose: number, compound: string) => {
    setCyclePlans(prevPlans => {
      const existingPlanIndex = prevPlans.findIndex(
        plan => plan.weekNumber === weekNumber && plan.compound === compound
      );

      if (existingPlanIndex >= 0) {
        // Update existing plan
        const updatedPlans = [...prevPlans];
        updatedPlans[existingPlanIndex] = {
          ...updatedPlans[existingPlanIndex],
          weeklyDose
        };
        return updatedPlans;
      } else {
        // Create new plan
        const newPlan = {
          id: Date.now().toString(),
          compound,
          weeklyDose,
          dosingPer1ML: 250, // Default value for internal calculations
          unit: "mg",
          frequency: 2,
          weekNumber
        };
        return [...prevPlans, newPlan];
      }
    });
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case "create-cycle":
        return (
          <div className="space-y-6">
            {cyclePeriods.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Existing Cycles</h3>
                {cyclePeriods.map((period) => (
                  <Card key={period.id} className="cursor-pointer hover:shadow-md transition-shadow" 
                        onClick={() => handleSelectCycle(period)}>
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{period.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {period.type} • Week {period.startWeek} - {period.endWeek}
                          </p>
                        </div>
                        <Badge variant="outline">{period.type}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
            
            <div className="flex justify-center">
              <Button 
                onClick={() => setShowCyclePeriodForm(!showCyclePeriodForm)}
                variant={cyclePeriods.length === 0 ? "default" : "outline"}
                size="lg"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create New Cycle
              </Button>
            </div>

            {showCyclePeriodForm && (
              <Card>
                <CardHeader>
                  <CardTitle>Create New Cycle Period</CardTitle>
                </CardHeader>
                <CardContent>
                  <CyclePeriodForm 
                    onSubmit={handleAddCyclePeriod}
                    onCancel={() => setShowCyclePeriodForm(false)}
                    selectedDate={new Date()}
                  />
                </CardContent>
              </Card>
            )}
          </div>
        );

      case "select-compounds":
        if (!selectedCyclePeriod) {
          return (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Please select a cycle period first</p>
              <Button 
                onClick={() => setActiveStep("create-cycle")} 
                className="mt-4"
                variant="outline"
              >
                Go Back to Cycles
              </Button>
            </div>
          );
        }
        
        // Filter cycle plans for the selected period
        const periodCyclePlans = cyclePlans.filter(plan => 
          plan.weekNumber >= selectedCyclePeriod.startWeek && 
          plan.weekNumber <= selectedCyclePeriod.endWeek
        );

        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">{selectedCyclePeriod.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {selectedCyclePeriod.type} • Week {selectedCyclePeriod.startWeek} - {selectedCyclePeriod.endWeek}
                </p>
              </div>
              <Button 
                onClick={() => setActiveStep("plan-doses")}
                disabled={periodCyclePlans.length === 0}
              >
                Next: Plan Doses
              </Button>
            </div>
            <CycleCompoundSelector 
              cyclePlanEntries={periodCyclePlans}
              onAddCyclePlan={handleAddCyclePlan}
              currentWeek={selectedCyclePeriod.startWeek}
            />
          </div>
        );

      case "plan-doses":
        if (!selectedCyclePeriod) {
          return (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Please select a cycle period first</p>
              <Button 
                onClick={() => setActiveStep("create-cycle")} 
                className="mt-4"
                variant="outline"
              >
                Go Back to Cycles
              </Button>
            </div>
          );
        }
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">Plan Doses: {selectedCyclePeriod.name}</h3>
                <p className="text-sm text-muted-foreground">
                  Set specific doses for each week of your cycle
                </p>
              </div>
            </div>
            <WeekByWeekTable 
              selectedCyclePeriod={selectedCyclePeriod}
              cyclePlans={cyclePlans}
              onUpdateCyclePlan={handleUpdateCyclePlan}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress Steps */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div 
                  className={`flex items-center cursor-pointer ${
                    activeStep === step.id ? 'text-primary' : step.completed ? 'text-green-600' : 'text-muted-foreground'
                  }`}
                  onClick={() => setActiveStep(step.id)}
                >
                  {step.completed ? (
                    <CheckCircle className="h-6 w-6 mr-3" />
                  ) : (
                    <Circle className={`h-6 w-6 mr-3 ${activeStep === step.id ? 'fill-primary text-primary-foreground' : ''}`} />
                  )}
                  <div>
                    <div className="font-medium">{step.title}</div>
                    <div className="text-sm text-muted-foreground">{step.description}</div>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className="w-16 h-px bg-border mx-4" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Step Content */}
      <Card>
        <CardContent className="pt-6">
          {renderStepContent()}
        </CardContent>
      </Card>
    </div>
  );
};

export default CycleWizard;
