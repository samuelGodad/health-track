import { useState, useRef, useEffect } from 'react';
import { DatePickerPopover } from "@/components/daily/DatePickerPopover";
import { PhysicalMetricsCard } from "@/components/daily/PhysicalMetricsCard";
import { NutritionCard } from "@/components/daily/NutritionCard";
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
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Ref to track if calories were autofilled or edited by user
  const caloriesAutofilled = useRef(true);

  // Smart debounce timer for autosave
  const autosaveTimer = useRef<NodeJS.Timeout>();
  
  // Track which fields have changed since last save
  const changedFields = useRef<Set<string>>(new Set());

  // Load existing data when date changes
  useEffect(() => {
    loadMetricsForDate(selectedDate);
  }, [selectedDate]);

  // Cleanup autosave timer on unmount
  useEffect(() => {
    return () => {
      if (autosaveTimer.current) {
        clearTimeout(autosaveTimer.current);
      }
    };
  }, []);

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
      
      // Reset calories autofill flag if user has data
      if (Object.values(stringMetrics).some(value => value !== '')) {
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
    
    // Mark this field as changed
    changedFields.current.add(field);
    setHasUnsavedChanges(true);
    
    // Smart autosave: only save after user stops typing for 2 seconds
    if (autosaveTimer.current) {
      clearTimeout(autosaveTimer.current);
    }
    
    autosaveTimer.current = setTimeout(() => {
      // Only save if there are actual changes and user has stopped typing
      if (changedFields.current.size > 0) {
        autosaveMetrics(newMetrics);
      }
    }, 2000); // 2 second delay - more reasonable for autosave
  };



  const autosaveMetrics = async (metricsToSave: typeof metrics) => {
    try {
      // Convert string values to numbers and filter out empty values
      const metricsData: DailyMetrics = {};
      
      Object.entries(metricsToSave).forEach(([key, value]) => {
        if (value && value.trim() !== '') {
          const numValue = parseFloat(value);
          if (!isNaN(numValue)) {
            metricsData[key as keyof DailyMetrics] = numValue;
          }
        }
      });

      // Only save if there are metrics to save
      if (Object.keys(metricsData).length > 0) {
        await dailyMetricsService.saveDailyMetrics(selectedDate, metricsData);
        setLastSaved(new Date());
        
        // Clear changed fields and update UI
        changedFields.current.clear();
        setHasUnsavedChanges(false);
      }
    } catch (error) {
      console.error('Autosave error:', error);
      // Don't show error toast for autosave - just log it
    }
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
      
      setLastSaved(new Date());
      toast.success('Daily metrics saved successfully!');
      
      // Clear changed fields after manual save
      changedFields.current.clear();
      setHasUnsavedChanges(false);
    } catch (error) {
      console.error('Error saving metrics:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to save metrics');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
    // Reset calories autofill when changing dates
    caloriesAutofilled.current = true;
    // Clear last saved timestamp when changing dates
    setLastSaved(null);
    // Clear changed fields when changing dates
    changedFields.current.clear();
    setHasUnsavedChanges(false);
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
          />
        </div>

        {isLoadingData ? (
          <div className="flex items-center justify-center min-h-[200px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading metrics...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Autosave status indicator */}
            {lastSaved && !hasUnsavedChanges && (
              <div className="flex items-center justify-center p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span className="text-sm text-green-700">
                  Last saved: {lastSaved.toLocaleTimeString()}
                </span>
              </div>
            )}
            
            {/* Unsaved changes indicator */}
            {hasUnsavedChanges && (
              <div className="flex items-center justify-center p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2 animate-pulse"></div>
                <span className="text-sm text-yellow-700">
                  Saving changes automatically... ({changedFields.current.size} field{changedFields.current.size !== 1 ? 's' : ''} modified)
                </span>
              </div>
            )}

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

            <div className="flex justify-between items-center">
              <div className="text-sm text-muted-foreground">
                Data saves automatically 2 seconds after you stop typing
              </div>
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
                  'Save Now'
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
