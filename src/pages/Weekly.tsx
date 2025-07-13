import { useState } from 'react';
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

const Weekly = () => {
  const [selectedWeek, setSelectedWeek] = useState<Date>(new Date());
  
  const weekStart = startOfWeek(selectedWeek, { weekStartsOn: 1 }); // Monday start
  const weekEnd = endOfWeek(selectedWeek, { weekStartsOn: 1 });

  // Mock data - TODO: Replace with actual data from database
  const weeklyAverages = {
    weight: 75.2,
    systolicBP: 122,
    diastolicBP: 78,
    steps: 8547,
    protein: 145.5,
    carbs: 285.3,
    fats: 65.8,
    calories: 2245
  };

  // Calculate calorie distribution (protein: 4 cal/g, carbs: 4 cal/g, fats: 9 cal/g)
  const proteinCalories = weeklyAverages.protein * 4;
  const carbCalories = weeklyAverages.carbs * 4;
  const fatCalories = weeklyAverages.fats * 9;

  const calorieDistribution = [
    { name: 'Protein', value: proteinCalories, color: '#3b82f6' },
    { name: 'Carbs', value: carbCalories, color: '#10b981' },
    { name: 'Fats', value: fatCalories, color: '#f59e0b' }
  ];

  // Mock trend data for the last 8 weeks
  const trendData = [
    { weekStart: startOfWeek(addWeeks(new Date(), -7), { weekStartsOn: 1 }), weight: 76.5, steps: 7500, systolic: 125, diastolic: 80, totalSleep: 6.7, restingHeartRate: 56 },
    { weekStart: startOfWeek(addWeeks(new Date(), -6), { weekStartsOn: 1 }), weight: 76.1, steps: 8200, systolic: 123, diastolic: 79, totalSleep: 7.0, restingHeartRate: 55 },
    { weekStart: startOfWeek(addWeeks(new Date(), -5), { weekStartsOn: 1 }), weight: 75.8, steps: 8100, systolic: 124, diastolic: 81, totalSleep: 7.1, restingHeartRate: 57 },
    { weekStart: startOfWeek(addWeeks(new Date(), -4), { weekStartsOn: 1 }), weight: 75.5, steps: 8300, systolic: 122, diastolic: 78, totalSleep: 6.8, restingHeartRate: 58 },
    { weekStart: startOfWeek(addWeeks(new Date(), -3), { weekStartsOn: 1 }), weight: 75.3, steps: 8600, systolic: 121, diastolic: 77, totalSleep: 7.3, restingHeartRate: 54 },
    { weekStart: startOfWeek(addWeeks(new Date(), -2), { weekStartsOn: 1 }), weight: 75.1, steps: 8400, systolic: 123, diastolic: 79, totalSleep: 7.0, restingHeartRate: 55 },
    { weekStart: startOfWeek(addWeeks(new Date(), -1), { weekStartsOn: 1 }), weight: 75.0, steps: 8500, systolic: 122, diastolic: 78, totalSleep: 7.2, restingHeartRate: 56 },
    { weekStart: startOfWeek(new Date(), { weekStartsOn: 1 }), weight: 75.2, steps: 8547, systolic: 122, diastolic: 78, totalSleep: 7.4, restingHeartRate: 55 }
  ];

  // Use a formatted weekStart string, e.g. "Jun 10"
  const trendDataWithDates = trendData.map(d => ({
    ...d,
    week: format(d.weekStart, 'MMM d'),
    date: format(d.weekStart, 'MMM d')
  }));

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
              {`${entry.dataKey}: ${entry.value}${entry.dataKey === 'weight' ? 'kg' : entry.dataKey === 'steps' ? ' steps' : ' mmHg'}`}
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
      const percentage = ((data.value / weeklyAverages.calories) * 100).toFixed(1);
      return (
        <div className="bg-background border border-border p-3 rounded-lg shadow-lg">
          <p className="font-medium">{data.name}</p>
          <p>{`${data.value} calories (${percentage}%)`}</p>
        </div>
      );
    }
    return null;
  };

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
              <div className="text-2xl font-bold">{weeklyAverages.weight.toFixed(1)} kg</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Average Blood Pressure</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{weeklyAverages.systolicBP}/{weeklyAverages.diastolicBP}</div>
              <p className="text-xs text-muted-foreground">mmHg</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Average Steps</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{weeklyAverages.steps.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">steps per day</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Average Calories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{weeklyAverages.calories.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">kcal per day</p>
            </CardContent>
          </Card>
        </div>

        {/* Calorie Distribution and Nutrition Summary */}
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
                  <div className="text-2xl font-bold">{weeklyAverages.calories} kcal</div>
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
                <span className="text-sm">{weeklyAverages.protein.toFixed(1)}g</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Carbs:</span>
                <span className="text-sm">{weeklyAverages.carbs.toFixed(1)}g</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Fats:</span>
                <span className="text-sm">{weeklyAverages.fats.toFixed(1)}g</span>
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

        {/* Sleep & Heart Rate Trends */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Total Sleep Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Total Sleep</CardTitle>
              <p className="text-sm text-muted-foreground">Avg. hours per night per week</p>
            </CardHeader>
            <CardContent>
              <div className="h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trendDataWithDates}>
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
                  <LineChart data={trendDataWithDates}>
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
      </div>
    </div>
  );
};

export default Weekly;
