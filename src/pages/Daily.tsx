
import { useState, useRef } from 'react';
import { DashboardLayout } from "@/components/DashboardLayout";
import { DatePickerPopover } from "@/components/daily/DatePickerPopover";
import { PhysicalMetricsCard } from "@/components/daily/PhysicalMetricsCard";
import { NutritionCard } from "@/components/daily/NutritionCard";
import { MetricsSavedMessage } from "@/components/daily/MetricsSavedMessage";

const Daily = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [metrics, setMetrics] = useState({
    weight: '',
    systolicBP: '',
    diastolicBP: '',
    steps: '',
    protein: '',
    carbs: '',
    fats: '',
    calories: ''
  });
  const [isSaved, setIsSaved] = useState(false);

  // Ref to track if calories were autofilled or edited by user
  const caloriesAutofilled = useRef(true);

  const handleInputChange = (field: string, value: string) => {
    let newMetrics = { ...metrics, [field]: value };

    // If user edits calories, mark as NOT autofilled, else continue as normal
    if (field === 'calories') {
      caloriesAutofilled.current = false;
      setMetrics(newMetrics);
      return;
    }

    // Handle macros logic:
    if (['protein', 'carbs', 'fats'].includes(field)) {
      // Only auto-calculate if all macros have a value (and are valid numbers)
      const protein = parseFloat(field === 'protein' ? value : newMetrics.protein);
      const carbs = parseFloat(field === 'carbs' ? value : newMetrics.carbs);
      const fats = parseFloat(field === 'fats' ? value : newMetrics.fats);

      if (
        !isNaN(protein) && protein !== null &&
        !isNaN(carbs) && carbs !== null &&
        !isNaN(fats) && fats !== null &&
        caloriesAutofilled.current // Only auto-fill if user hasn't manually edited
      ) {
        const calcCalories = (protein * 4) + (carbs * 4) + (fats * 9);
        newMetrics.calories = calcCalories ? calcCalories.toString() : '';
      }
    }

    // If user clears any macro field, resume autofill for calories
    if (
      (field === 'protein' && value === '') ||
      (field === 'carbs' && value === '') ||
      (field === 'fats' && value === '')
    ) {
      caloriesAutofilled.current = true;
      newMetrics.calories = '';
    }

    setMetrics(newMetrics);
  };

  const handleSave = () => {
    // TODO: Save to database
    console.log('Saving daily metrics:', { date: selectedDate, ...metrics });
    setIsSaved(true);
  };

  const handleEdit = () => {
    setIsSaved(false);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Daily Tracking</h2>
            <p className="text-muted-foreground">Track your daily health metrics.</p>
          </div>
          <DatePickerPopover
            selectedDate={selectedDate}
            onChange={setSelectedDate}
            disabled={isSaved}
          />
        </div>

        {isSaved ? (
          <MetricsSavedMessage selectedDate={selectedDate} onEdit={handleEdit} />
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-2">
              <PhysicalMetricsCard
                metrics={{
                  weight: metrics.weight,
                  systolicBP: metrics.systolicBP,
                  diastolicBP: metrics.diastolicBP,
                  steps: metrics.steps,
                }}
                onChange={handleInputChange}
              />
              <NutritionCard
                metrics={{
                  protein: metrics.protein,
                  carbs: metrics.carbs,
                  fats: metrics.fats,
                  calories: metrics.calories,
                }}
                onChange={handleInputChange}
              />
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleSave}
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium bg-blue-500 text-white hover:bg-blue-600 h-11 rounded-md px-8 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                style={{ minWidth: "180px" }}
              >
                Save Daily Metrics
              </button>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Daily;
