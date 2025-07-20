import { useState, useRef, useEffect } from 'react';
import { DatePickerPopover } from "@/components/daily/DatePickerPopover";
import { PhysicalMetricsCard } from "@/components/daily/PhysicalMetricsCard";
import { NutritionCard } from "@/components/daily/NutritionCard";
import { MetricsSavedMessage } from "@/components/daily/MetricsSavedMessage";
import { dailyMetricsService, DailyMetrics } from "@/services/dailyMetricsService";
import { toast } from "sonner";

const Daily = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [metrics, setMetrics] = useState({
    weight: '',
    systolicBP: '',
    diastolicBP: '',
    steps: '',
    totalSleep: '',
    restingHeartRate: '',
    protein: '',
    carbs: '',
    fats: '',
    calories: ''
  });
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);

  // Ref to track if calories were autofilled or edited by user
  const caloriesAutofilled = useRef(true);

  // Load existing data when date changes
  useEffect(() => {
    loadMetricsForDate(selectedDate);
  }, [selectedDate]);

  const loadMetricsForDate = async (date: Date) => {
    try {
      setIsLoadingData(true);
      const existingMetrics = await dailyMetricsService.loadDailyMetrics(date);
      
      // Convert numbers back to strings for form inputs
      const stringMetrics = {
        weight: existingMetrics.weight?.toString() || '',
        systolicBP: existingMetrics.systolicBP?.toString() || '',
        diastolicBP: existingMetrics.diastolicBP?.toString() || '',
        steps: existingMetrics.steps?.toString() || '',
        totalSleep: existingMetrics.totalSleep?.toString() || '',
        restingHeartRate: existingMetrics.restingHeartRate?.toString() || '',
        protein: existingMetrics.protein?.toString() || '',
        carbs: existingMetrics.carbs?.toString() || '',
        fats: existingMetrics.fats?.toString() || '',
        calories: existingMetrics.calories?.toString() || ''
      };

      setMetrics(stringMetrics);
      
      // Check if data exists for this date
      const hasData = await dailyMetricsService.hasMetricsForDate(date);
      setIsSaved(hasData);
      
      // Reset calories autofill flag if user has data
      if (hasData) {
        caloriesAutofilled.current = false;
      }
    } catch (error) {
      console.error('Error loading metrics:', error);
      // Don't show error toast for loading - just log it
      // Reset to empty state
      setMetrics({
        weight: '',
        systolicBP: '',
        diastolicBP: '',
        steps: '',
        totalSleep: '',
        restingHeartRate: '',
        protein: '',
        carbs: '',
        fats: '',
        calories: ''
      });
      setIsSaved(false);
    } finally {
      setIsLoadingData(false);
    }
  };

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

  const handleSave = async () => {
    try {
      setIsLoading(true);
      
      // Convert string values to numbers and filter out empty values
      const metricsToSave: DailyMetrics = {};
      
      Object.entries(metrics).forEach(([key, value]) => {
        if (value && value.trim() !== '') {
          const numValue = parseFloat(value);
          if (!isNaN(numValue)) {
            metricsToSave[key as keyof DailyMetrics] = numValue;
          }
        }
      });

      if (Object.keys(metricsToSave).length === 0) {
        toast.error('Please enter at least one metric before saving');
        return;
      }

      await dailyMetricsService.saveDailyMetrics(selectedDate, metricsToSave);
      
      setIsSaved(true);
      toast.success('Daily metrics saved successfully!');
    } catch (error) {
      console.error('Error saving metrics:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to save metrics');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = () => {
    setIsSaved(false);
  };

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
    // Reset calories autofill when changing dates
    caloriesAutofilled.current = true;
  };

  return (
    <div>
      {/* Page content only, NO header/hamburger/sidebar here */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Daily Tracking</h2>
            <p className="text-muted-foreground">Track your daily health metrics.</p>
          </div>
          <DatePickerPopover
            selectedDate={selectedDate}
            onChange={handleDateChange}
            disabled={isSaved}
          />
        </div>

        {isLoadingData ? (
          <div className="flex items-center justify-center min-h-[200px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading metrics...</p>
            </div>
          </div>
        ) : isSaved ? (
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
                  totalSleep: metrics.totalSleep,
                  restingHeartRate: metrics.restingHeartRate,
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
                disabled={isLoading}
                className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium bg-blue-500 text-white hover:bg-blue-600 h-11 rounded-md px-8 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                style={{ minWidth: "180px" }}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Saving...
                  </>
                ) : (
                  'Save Daily Metrics'
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Daily;
