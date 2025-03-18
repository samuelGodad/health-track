
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import { LineChart } from '@/components/LineChart';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  CalendarIcon,
  PlusIcon,
  Save,
  ArrowUpDownIcon,
  HeartPulseIcon,
  WeightIcon,
  Gauge,
  UtensilsCrossedIcon
} from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

// Mock data for metrics
const mockWeightData = [
  { date: '2023-06-01', value: 85 },
  { date: '2023-06-08', value: 84.5 },
  { date: '2023-06-15', value: 84.2 },
  { date: '2023-06-22', value: 83.8 },
  { date: '2023-06-29', value: 83.5 },
  { date: '2023-07-06', value: 83.1 },
  { date: '2023-07-13', value: 82.8 },
];

// Changed to include both systolic and diastolic values with 'value' for LineChart compatibility
const mockBPSystolicData = [
  { date: '2023-06-01', value: 124, diastolic: 84 },
  { date: '2023-06-08', value: 122, diastolic: 82 },
  { date: '2023-06-15', value: 120, diastolic: 80 },
  { date: '2023-06-22', value: 118, diastolic: 78 },
  { date: '2023-06-29', value: 120, diastolic: 80 },
  { date: '2023-07-06', value: 122, diastolic: 80 },
  { date: '2023-07-13', value: 120, diastolic: 78 },
];

const mockBPDiastolicData = [
  { date: '2023-06-01', value: 84, systolic: 124 },
  { date: '2023-06-08', value: 82, systolic: 122 },
  { date: '2023-06-15', value: 80, systolic: 120 },
  { date: '2023-06-22', value: 78, systolic: 118 },
  { date: '2023-06-29', value: 80, systolic: 120 },
  { date: '2023-07-06', value: 80, systolic: 122 },
  { date: '2023-07-13', value: 78, systolic: 120 },
];

const mockGlucoseData = [
  { date: '2023-06-01', value: 89 },
  { date: '2023-06-08', value: 92 },
  { date: '2023-06-15', value: 90 },
  { date: '2023-06-22', value: 88 },
  { date: '2023-06-29', value: 91 },
  { date: '2023-07-06', value: 87 },
  { date: '2023-07-13', value: 89 },
];

const mockHeartRateData = [
  { date: '2023-06-01', value: 68 },
  { date: '2023-06-08', value: 72 },
  { date: '2023-06-15', value: 70 },
  { date: '2023-06-22', value: 74 },
  { date: '2023-06-29', value: 72 },
  { date: '2023-07-06', value: 75 },
  { date: '2023-07-13', value: 71 },
];

const mockCaloriesData = [
  { date: '2023-06-01', value: 2200 },
  { date: '2023-06-08', value: 2300 },
  { date: '2023-06-15', value: 2250 },
  { date: '2023-06-22', value: 2400 },
  { date: '2023-06-29', value: 2350 },
  { date: '2023-07-06', value: 2450 },
  { date: '2023-07-13', value: 2400 },
];

const DailyMetrics = () => {
  const [date, setDate] = useState<Date>(new Date());

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16 px-4 md:px-6 max-w-screen-xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Daily Metrics</h1>
            <p className="text-muted-foreground">Record and track your daily health metrics</p>
          </div>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                <span>{format(date, 'PPP')}</span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(date) => date && setDate(date)}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="md:col-span-2 border border-border/50 bg-card/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Metrics Overview</CardTitle>
            </CardHeader>
            <CardContent className="px-2">
              <Tabs defaultValue="weight">
                <TabsList className="mb-4">
                  <TabsTrigger value="weight">Weight</TabsTrigger>
                  <TabsTrigger value="blood-pressure">Blood Pressure</TabsTrigger>
                  <TabsTrigger value="glucose">Glucose</TabsTrigger>
                  <TabsTrigger value="heart-rate">Heart Rate</TabsTrigger>
                  <TabsTrigger value="calories">Calories</TabsTrigger>
                </TabsList>
                
                <TabsContent value="weight" className="mt-0">
                  <LineChart 
                    title="Weight (kg)"
                    data={mockWeightData}
                    dataKey="value"
                    tooltipLabel="Weight"
                    valueFormatter={(value) => `${value} kg`}
                  />
                </TabsContent>
                
                <TabsContent value="blood-pressure" className="mt-0">
                  <LineChart 
                    title="Blood Pressure - Systolic (mmHg)"
                    data={mockBPSystolicData}
                    dataKey="value"
                    color="hsl(0, 70%, 60%)"
                    tooltipLabel="Systolic"
                    valueFormatter={(value) => `${value} mmHg`}
                  />
                </TabsContent>
                
                <TabsContent value="glucose" className="mt-0">
                  <LineChart 
                    title="Blood Glucose (mg/dL)"
                    data={mockGlucoseData}
                    dataKey="value"
                    color="hsl(35, 70%, 50%)"
                    tooltipLabel="Glucose"
                    valueFormatter={(value) => `${value} mg/dL`}
                  />
                </TabsContent>
                
                <TabsContent value="heart-rate" className="mt-0">
                  <LineChart 
                    title="Heart Rate (bpm)"
                    data={mockHeartRateData}
                    dataKey="value"
                    color="hsl(350, 70%, 60%)"
                    tooltipLabel="Heart Rate"
                    valueFormatter={(value) => `${value} bpm`}
                  />
                </TabsContent>
                
                <TabsContent value="calories" className="mt-0">
                  <LineChart 
                    title="Daily Calories"
                    data={mockCaloriesData}
                    dataKey="value"
                    color="hsl(220, 70%, 60%)"
                    tooltipLabel="Calories"
                    valueFormatter={(value) => `${value} kcal`}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          
          <div className="space-y-6">
            <Card className="border border-border/50 bg-card/90 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PlusIcon className="h-4 w-4" />
                  Add Today's Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-4">
                  <div className="grid grid-cols-2 items-end gap-3">
                    <div>
                      <Label htmlFor="weight" className="flex items-center gap-1 text-sm mb-1.5">
                        <WeightIcon className="h-3.5 w-3.5" />
                        Weight
                      </Label>
                      <Input id="weight" type="number" placeholder="0.0" />
                    </div>
                    <div>
                      <Label htmlFor="unit-weight" className="text-sm">Unit</Label>
                      <Input id="unit-weight" value="kg" readOnly />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 items-end gap-3">
                    <div className="col-span-2">
                      <Label htmlFor="bp" className="flex items-center gap-1 text-sm mb-1.5">
                        <Gauge className="h-3.5 w-3.5" />
                        Blood Pressure
                      </Label>
                      <div className="flex items-center gap-2">
                        <Input id="systolic" type="number" placeholder="120" />
                        <span>/</span>
                        <Input id="diastolic" type="number" placeholder="80" />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="unit-bp" className="text-sm">Unit</Label>
                      <Input id="unit-bp" value="mmHg" readOnly />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 items-end gap-3">
                    <div>
                      <Label htmlFor="glucose" className="flex items-center gap-1 text-sm mb-1.5">
                        <ArrowUpDownIcon className="h-3.5 w-3.5" />
                        Glucose
                      </Label>
                      <Input id="glucose" type="number" placeholder="0" />
                    </div>
                    <div>
                      <Label htmlFor="unit-glucose" className="text-sm">Unit</Label>
                      <Input id="unit-glucose" value="mg/dL" readOnly />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 items-end gap-3">
                    <div>
                      <Label htmlFor="heart-rate" className="flex items-center gap-1 text-sm mb-1.5">
                        <HeartPulseIcon className="h-3.5 w-3.5" />
                        Heart Rate
                      </Label>
                      <Input id="heart-rate" type="number" placeholder="0" />
                    </div>
                    <div>
                      <Label htmlFor="unit-hr" className="text-sm">Unit</Label>
                      <Input id="unit-hr" value="bpm" readOnly />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 items-end gap-3">
                    <div>
                      <Label htmlFor="calories" className="flex items-center gap-1 text-sm mb-1.5">
                        <UtensilsCrossedIcon className="h-3.5 w-3.5" />
                        Calories
                      </Label>
                      <Input id="calories" type="number" placeholder="0" />
                    </div>
                    <div>
                      <Label htmlFor="unit-cal" className="text-sm">Unit</Label>
                      <Input id="unit-cal" value="kcal" readOnly />
                    </div>
                  </div>
                  
                  <Button className="w-full mt-4" type="button">
                    <Save className="h-4 w-4 mr-2" />
                    Save Metrics
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DailyMetrics;
