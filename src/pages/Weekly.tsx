import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { format, startOfWeek, endOfWeek, addWeeks, subWeeks } from "date-fns";
import { cn } from "@/lib/utils";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { dailyMetricsService, DailyMetrics } from "@/services/dailyMetricsService";
import { toast } from "sonner";

const Weekly = () => {
  const [selectedWeek, setSelectedWeek] = useState<Date>(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [weeklyAverages, setWeeklyAverages] = useState<DailyMetrics>({});
  
  const weekStart = startOfWeek(selectedWeek, { weekStartsOn: 1 }); // Monday start
  const weekEnd = endOfWeek(selectedWeek, { weekStartsOn: 1 });

  // Load weekly data when selected week changes
  useEffect(() => {
    loadWeeklyData();
  }, [selectedWeek]);

  const loadWeeklyData = async () => {
    try {
      setIsLoading(true);
      
      // Load only weekly averages
      const averages = await dailyMetricsService.getWeeklyAverages(weekStart, weekEnd);

      console.log('Weekly averages:', averages);

      setWeeklyAverages(averages);
    } catch (error) {
      console.error('Error loading weekly data:', error);
      toast.error('Failed to load weekly data');
      // Set empty defaults
      setWeeklyAverages({});
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate calorie distribution (protein: 4 cal/g, carbs: 4 cal/g, fats: 9 cal/g)
  const proteinCalories = (weeklyAverages.protein || 0) * 4;
  const carbCalories = (weeklyAverages.carbs || 0) * 4;
  const fatCalories = (weeklyAverages.fats || 0) * 9;
  const totalCalories = proteinCalories + carbCalories + fatCalories;

  const calorieDistribution = [
    { name: 'Protein', value: proteinCalories, color: '#3b82f6' },
    { name: 'Carbs', value: carbCalories, color: '#10b981' },
    { name: 'Fats', value: fatCalories, color: '#f59e0b' }
  ].filter(item => item.value > 0); // Only show non-zero values

  const navigateWeek = (direction: 'prev' | 'next') => {
    setSelectedWeek(prev => 
      direction === 'prev' ? subWeeks(prev, 1) : addWeeks(prev, 1)
    );
  };

  const CalorieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const percentage = totalCalories > 0 ? ((data.value / totalCalories) * 100).toFixed(1) : '0';
      return (
        <div className="bg-background border border-border p-3 rounded-lg shadow-lg">
          <p className="font-medium">{data.name}</p>
          <p>{`${data.value} calories (${percentage}%)`}</p>
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <div>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Weekly Overview</h2>
              <p className="text-muted-foreground">View your weekly average metrics.</p>
            </div>
          </div>
          
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading weekly data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Page content only, NO header/hamburger/sidebar here */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Weekly Overview</h2>
            <p className="text-muted-foreground">View your weekly average metrics.</p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => navigateWeek('prev')}
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </Button>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-[280px] justify-start text-left font-normal"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(weekStart, "MMM d")} - {format(weekEnd, "MMM d, yyyy")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={selectedWeek}
                  onSelect={(date) => date && setSelectedWeek(date)}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
            
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => navigateWeek('next')}
            >
              <ChevronRightIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Average Weight</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {weeklyAverages.weight ? `${weeklyAverages.weight.toFixed(1)} kg` : 'No data'}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Average Blood Pressure</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {weeklyAverages.systolicBP && weeklyAverages.diastolicBP 
                  ? `${weeklyAverages.systolicBP}/${weeklyAverages.diastolicBP}`
                  : 'No data'
                }
              </div>
              <p className="text-xs text-muted-foreground">mmHg</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Average Steps</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {weeklyAverages.steps ? weeklyAverages.steps.toLocaleString() : 'No data'}
              </div>
              <p className="text-xs text-muted-foreground">steps per day</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Average Calories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {weeklyAverages.calories ? weeklyAverages.calories.toLocaleString() : 'No data'}
              </div>
              <p className="text-xs text-muted-foreground">kcal per day</p>
            </CardContent>
          </Card>
        </div>

        {/* Additional Metrics Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Average Sleep</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {weeklyAverages.totalSleep ? `${weeklyAverages.totalSleep.toFixed(1)}h` : 'No data'}
              </div>
              <p className="text-xs text-muted-foreground">hours per night</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Average Heart Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {weeklyAverages.restingHeartRate ? `${weeklyAverages.restingHeartRate} bpm` : 'No data'}
              </div>
              <p className="text-xs text-muted-foreground">resting heart rate</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Average Water</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {weeklyAverages.waterIntake ? `${weeklyAverages.waterIntake.toFixed(1)}L` : 'No data'}
              </div>
              <p className="text-xs text-muted-foreground">liters per day</p>
            </CardContent>
          </Card>
        </div>

        {/* Calorie Distribution and Nutrition Summary */}
        {calorieDistribution.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Calorie Distribution</CardTitle>
                <p className="text-sm text-muted-foreground">Weekly average breakdown of macronutrients</p>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-8">
                  <div className="h-[200px] w-[200px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={calorieDistribution}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={80}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {calorieDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip content={<CalorieTooltip />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-3">
                    <div className="text-lg font-semibold">Total Value</div>
                    <div className="text-2xl font-bold">{totalCalories} kcal</div>
                    <div className="space-y-2 mt-4">
                      {calorieDistribution.map((item) => (
                        <div key={item.name} className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-sm" 
                            style={{ backgroundColor: item.color }}
                          />
                          <span className="text-sm font-medium">{item.name}</span>
                          <span className="text-sm text-muted-foreground ml-auto">
                            {item.value} cal
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Nutrition Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Protein:</span>
                  <span className="text-sm">{weeklyAverages.protein?.toFixed(1) || '0'}g</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Carbs:</span>
                  <span className="text-sm">{weeklyAverages.carbs?.toFixed(1) || '0'}g</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Fats:</span>
                  <span className="text-sm">{weeklyAverages.fats?.toFixed(1) || '0'}g</span>
                </div>
                <div className="pt-4 border-t">
                  <p className="text-xs text-muted-foreground">
                    Protein & Carbs: 4 cal/g<br/>
                    Fats: 9 cal/g
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Nutrition Data</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">No nutrition data available for this week. Start tracking your daily metrics to see your weekly averages.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Weekly;
