import { useState, useRef } from 'react';
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format, isSameDay } from "date-fns";
import { cn } from "@/lib/utils";

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

  // Show the correct message on save:
  const getMetricsSavedMessage = () => {
    const today = new Date();
    if (isSameDay(selectedDate, today)) {
      return "Great job! Your metrics for today have been saved.";
    }
    return `Great job! Your metrics for ${format(selectedDate, "PPP")} have been saved.`;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Daily Tracking</h2>
            <p className="text-muted-foreground">Track your daily health metrics.</p>
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-[240px] justify-start text-left font-normal",
                  !selectedDate && "text-muted-foreground"
                )}
                disabled={isSaved}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && !isSaved && setSelectedDate(date)}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
        </div>

        {isSaved ? (
          <div className="flex flex-col items-center justify-center min-h-[200px] animate-fade-in">
            <div className="text-lg font-semibold mb-4 text-green-600">
              {getMetricsSavedMessage()}
            </div>
            <Button onClick={handleEdit} size="lg" variant="outline">
              Change Daily Metrics
            </Button>
          </div>
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Physical Metrics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="weight">Weight (kg)</Label>
                    <Input
                      id="weight"
                      type="number"
                      step="0.1"
                      value={metrics.weight}
                      onChange={(e) => handleInputChange('weight', e.target.value)}
                      placeholder="Enter weight"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="systolic">Systolic BP</Label>
                      <Input
                        id="systolic"
                        type="number"
                        value={metrics.systolicBP}
                        onChange={(e) => handleInputChange('systolicBP', e.target.value)}
                        placeholder="120"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="diastolic">Diastolic BP</Label>
                      <Input
                        id="diastolic"
                        type="number"
                        value={metrics.diastolicBP}
                        onChange={(e) => handleInputChange('diastolicBP', e.target.value)}
                        placeholder="80"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="steps">Step Count</Label>
                    <Input
                      id="steps"
                      type="number"
                      value={metrics.steps}
                      onChange={(e) => handleInputChange('steps', e.target.value)}
                      placeholder="Enter step count"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Nutrition</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="protein">Protein (g)</Label>
                    <Input
                      id="protein"
                      type="number"
                      step="0.1"
                      value={metrics.protein}
                      onChange={(e) => handleInputChange('protein', e.target.value)}
                      placeholder="Enter protein intake"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="carbs">Carbs (g)</Label>
                    <Input
                      id="carbs"
                      type="number"
                      step="0.1"
                      value={metrics.carbs}
                      onChange={(e) => handleInputChange('carbs', e.target.value)}
                      placeholder="Enter carb intake"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="fats">Fats (g)</Label>
                    <Input
                      id="fats"
                      type="number"
                      step="0.1"
                      value={metrics.fats}
                      onChange={(e) => handleInputChange('fats', e.target.value)}
                      placeholder="Enter fat intake"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="calories">Calories</Label>
                    <Input
                      id="calories"
                      type="number"
                      value={metrics.calories}
                      onChange={(e) => handleInputChange('calories', e.target.value)}
                      placeholder="Enter Macros and your calories will be estimated here"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-end">
              <Button onClick={handleSave} size="lg">
                Save Daily Metrics
              </Button>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Daily;
