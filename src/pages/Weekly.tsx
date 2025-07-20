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
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import { dailyMetricsService, DailyMetrics } from "@/services/dailyMetricsService";
import { toast } from "sonner";

const Weekly = () => {
  const [selectedWeek, setSelectedWeek] = useState<Date>(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [weeklyAverages, setWeeklyAverages] = useState<DailyMetrics>({});
  const [trendData, setTrendData] = useState<Array<{ weekStart: Date; metrics: DailyMetrics }>>([]);
  
  const weekStart = startOfWeek(selectedWeek, { weekStartsOn: 1 }); // Monday start
  const weekEnd = endOfWeek(selectedWeek, { weekStartsOn: 1 });

  // Load weekly data when selected week changes
  useEffect(() => {
    loadWeeklyData();
  }, [selectedWeek]);

  const loadWeeklyData = async () => {
    try {
      setIsLoading(true);
      
      // Load weekly averages and trend data in parallel
      const [averages, trends] = await Promise.all([
        dailyMetricsService.getWeeklyAverages(weekStart, weekEnd),
        dailyMetricsService.getTrendData(8)
      ]);

      console.log('Weekly averages:', averages);
      console.log('Trend data:', trends);
      console.log('Trend data length:', trends.length);

      setWeeklyAverages(averages);
      setTrendData(trends);
    } catch (error) {
      console.error('Error loading weekly data:', error);
      toast.error('Failed to load weekly data');
      // Set empty defaults
      setWeeklyAverages({});
      setTrendData([]);
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

  // Format trend data for charts
  const trendDataWithDates = trendData.map(d => ({
    ...d.metrics,
    week: format(d.weekStart, 'MMM d'),
    date: format(d.weekStart, 'MMM d')
  }));

  console.log('Raw trend data:', trendData);
  console.log('Formatted trend data for charts:', trendDataWithDates);
  console.log('Trend data with dates length:', trendDataWithDates.length);
  
  // Check if the data has the required fields
  if (trendDataWithDates.length > 0) {
    console.log('First data point:', trendDataWithDates[0]);
    console.log('Has totalSleep:', 'totalSleep' in trendDataWithDates[0]);
    console.log('Has restingHeartRate:', 'restingHeartRate' in trendDataWithDates[0]);
  }

  // Check if real data is sufficient for charts (need at least 2 data points)
  const hasRealData = trendDataWithDates.length >= 2;
  const hasSufficientData = hasRealData && trendDataWithDates.some(d => d.totalSleep || d.restingHeartRate);
  
  // Use real data only - no sample data
  const finalChartData = trendDataWithDates;
  const isUsingSampleData = false;

  console.log('Final chart data:', finalChartData);
  console.log('Chart data length:', finalChartData.length);
  console.log('Using sample data:', trendDataWithDates.length === 0);

  // TEMPORARY DEBUG: Add this to test charts
  console.log('=== CHART DEBUG INFO ===');
  console.log('Real data points:', trendDataWithDates.length);
  console.log('Has sufficient data:', hasSufficientData);
  console.log('Chart data sample:', finalChartData.slice(0, 2));
  console.log('========================');

  const navigateWeek = (direction: 'prev' | 'next') => {
    setSelectedWeek(prev => 
      direction === 'prev' ? subWeeks(prev, 1) : addWeeks(prev, 1)
    );
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background border border-border p-3 rounded-lg shadow-lg">
          <p className="font-medium">{`Week: ${data.week}`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {`${entry.dataKey}: ${entry.value}${entry.dataKey === 'weight' ? 'kg' : entry.dataKey === 'steps' ? ' steps' : entry.dataKey === 'totalSleep' ? 'h' : ' mmHg'}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
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
              <p className="text-muted-foreground">View your weekly average metrics and trends.</p>
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
            <p className="text-muted-foreground">View your weekly average metrics and trends.</p>
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

        {/* Sleep & Heart Rate Trends */}
        {finalChartData.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2">
            {/* Show notice if insufficient data for trends */}
            {!hasSufficientData && (
              <div className="md:col-span-2">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <p className="text-blue-800 text-sm">
                    📊 <strong>Building Your Data:</strong> 
                    {finalChartData.length === 1 
                      ? ' You have data for one week. Continue tracking daily metrics to see trends over time.'
                      : ' You need more sleep and heart rate data to see meaningful trends. Keep tracking daily metrics.'
                    }
                  </p>
                </div>
              </div>
            )}
            
            {/* Total Sleep Trend */}
            <Card>
              <CardHeader>
                <CardTitle>Total Sleep</CardTitle>
                <p className="text-sm text-muted-foreground">Avg. hours per night per week</p>
              </CardHeader>
              <CardContent>
                <div className="h-[220px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={finalChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                      <YAxis stroke="hsl(var(--muted-foreground))" domain={['auto', 'auto']} unit="h"/>
                      <Tooltip content={<CustomTooltip />} />
                      <Line type="monotone" dataKey="totalSleep" stroke="#6366f1" strokeWidth={2} dot={{ fill: '#6366f1' }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            {/* Resting Heart Rate Trend */}
            <Card>
              <CardHeader>
                <CardTitle>Resting Heart Rate</CardTitle>
                <p className="text-sm text-muted-foreground">Avg. bpm per week</p>
              </CardHeader>
              <CardContent>
                <div className="h-[220px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={finalChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                      <YAxis stroke="hsl(var(--muted-foreground))" domain={['auto', 'auto']} unit="bpm"/>
                      <Tooltip content={<CustomTooltip />} />
                      <Line type="monotone" dataKey="restingHeartRate" stroke="#d946ef" strokeWidth={2} dot={{ fill: '#d946ef' }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Trend Data</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <div className="text-muted-foreground mb-4">
                  <svg className="mx-auto h-12 w-12 text-muted-foreground/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">No Trend Data Available</h3>
                <p className="text-muted-foreground mb-4">
                  Start tracking your daily metrics to see your progress over time.
                </p>
                <Button asChild>
                  <a href="/daily">Start Tracking Daily Metrics</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Weekly;
