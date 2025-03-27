
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
  UtensilsCrossedIcon,
  MoonIcon,
  DropletIcon,
  FootprintsIcon
} from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

// Generate rating options for dropdowns
const ratingOptions = Array.from({ length: 10 }, (_, i) => (
  { value: String(i + 1), label: String(i + 1) }
));

const DailyMetrics = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [activeTab, setActiveTab] = useState("data-entry");

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="pt-24 pb-16 px-4 md:px-6 max-w-screen-xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">Daily Dashboard</h1>
            <p className="text-gray-500">Track your progress and meet your daily targets</p>
          </div>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2 bg-white border-gray-200">
                <CalendarIcon className="h-4 w-4" />
                <span>{format(date, 'MMMM d')}</span>
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
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
          <Card className="bg-white border border-gray-100 shadow-sm">
            <CardContent className="pt-6">
              <h3 className="text-gray-500 text-sm font-medium">Calories</h3>
              <p className="text-3xl font-bold mt-1">3,250</p>
              <p className="text-xs text-gray-500 mt-1">+8% over the last 30 days</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white border border-gray-100 shadow-sm">
            <CardContent className="pt-6">
              <h3 className="text-gray-500 text-sm font-medium">Protein</h3>
              <p className="text-3xl font-bold mt-1">200g</p>
              <p className="text-xs text-gray-500 mt-1">+8% over the last 30 days</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white border border-gray-100 shadow-sm">
            <CardContent className="pt-6">
              <h3 className="text-gray-500 text-sm font-medium">Carbs</h3>
              <p className="text-3xl font-bold mt-1">500g</p>
              <p className="text-xs text-gray-500 mt-1">-5% over the last 30 days</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white border border-gray-100 shadow-sm">
            <CardContent className="pt-6">
              <h3 className="text-gray-500 text-sm font-medium">Fat</h3>
              <p className="text-3xl font-bold mt-1">50g</p>
              <p className="text-xs text-gray-500 mt-1">-6% over the last 30 days</p>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2 bg-white border border-gray-100 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium text-gray-900">Add {format(date, "MMMM d")}'s Data</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2">
                  <div className="text-sm text-gray-500 font-medium">Source</div>
                  <div className="text-sm text-gray-500 font-medium">Input Your Data</div>
                </div>
                
                {/* Entry rows */}
                {Array.from({ length: 7 }).map((_, i) => (
                  <div key={i} className="grid grid-cols-2 items-center">
                    <div className="text-sm text-gray-700">test name</div>
                    <Input className="h-9 bg-gray-100 border-gray-200" />
                  </div>
                ))}
              </div>
              
              <div className="mt-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Supplements</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2">
                    <div className="text-sm text-gray-500 font-medium">Source</div>
                    <div className="text-sm text-gray-500 font-medium">Timing & Dosage</div>
                  </div>
                  
                  {/* Supplement rows */}
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="grid grid-cols-2 items-center">
                      <div className="text-sm text-gray-700">supplement name</div>
                      <div className="text-sm text-gray-700">Timing & dose</div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
          
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
              <div className="inline-flex items-center gap-2 px-4 py-1 bg-black text-white rounded-full text-sm mb-4">
                <span className="h-2 w-2 bg-blue-500 rounded-full"></span>
                Food
                <span className="h-2 w-2 bg-green-500 rounded-full"></span>
                Activity
                <span className="h-2 w-2 bg-purple-500 rounded-full"></span>
                Health
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-gray-500 text-sm font-medium">Weight</h3>
                  <div className="flex items-baseline gap-2 mt-1">
                    <p className="text-2xl font-bold">82.5</p>
                    <p className="text-sm text-gray-500">kg</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-gray-500 text-sm font-medium">Sleep</h3>
                  <div className="flex items-baseline gap-2 mt-1">
                    <p className="text-2xl font-bold">7.5</p>
                    <p className="text-sm text-gray-500">hours</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-gray-500 text-sm font-medium">Steps</h3>
                  <div className="flex items-baseline gap-2 mt-1">
                    <p className="text-2xl font-bold">8,547</p>
                    <p className="text-sm text-gray-500">steps</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-gray-500 text-sm font-medium">Water</h3>
                  <div className="flex items-baseline gap-2 mt-1">
                    <p className="text-2xl font-bold">2.5</p>
                    <p className="text-sm text-gray-500">liters</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-gray-500 text-sm font-medium">Meal Quality</h3>
                  <div className="flex items-baseline gap-2 mt-1">
                    <p className="text-2xl font-bold">8/10</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-gray-500 text-sm font-medium">Recovery</h3>
                  <div className="flex items-baseline gap-2 mt-1">
                    <p className="text-2xl font-bold">7/10</p>
                  </div>
                </div>
                
                <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white mt-4">
                  Save Today's Data
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DailyMetrics;
