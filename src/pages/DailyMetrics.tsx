
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
        
        <Tabs defaultValue="data-entry" onValueChange={setActiveTab} className="mb-8">
          <TabsList className="mb-4">
            <TabsTrigger value="data-entry">Data Entry</TabsTrigger>
            <TabsTrigger value="health-markers">Health Markers</TabsTrigger>
          </TabsList>
          
          <TabsContent value="data-entry" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="md:col-span-2 border border-border/50 bg-card/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Daily Data Overview</CardTitle>
                </CardHeader>
                <CardContent className="px-2">
                  <Tabs defaultValue="weight">
                    <TabsList className="mb-4">
                      <TabsTrigger value="weight">Weight</TabsTrigger>
                      <TabsTrigger value="calories">Calories</TabsTrigger>
                      <TabsTrigger value="macros">Macros</TabsTrigger>
                      <TabsTrigger value="water">Water</TabsTrigger>
                      <TabsTrigger value="steps">Steps</TabsTrigger>
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
                    
                    <TabsContent value="macros" className="mt-0">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card className="border border-border/50 bg-card/90 p-4">
                          <h3 className="text-lg font-medium mb-2">Protein</h3>
                          <div className="text-3xl font-bold">180g</div>
                          <div className="text-muted-foreground">Target: 200g</div>
                        </Card>
                        <Card className="border border-border/50 bg-card/90 p-4">
                          <h3 className="text-lg font-medium mb-2">Carbs</h3>
                          <div className="text-3xl font-bold">250g</div>
                          <div className="text-muted-foreground">Target: 300g</div>
                        </Card>
                        <Card className="border border-border/50 bg-card/90 p-4">
                          <h3 className="text-lg font-medium mb-2">Fats</h3>
                          <div className="text-3xl font-bold">65g</div>
                          <div className="text-muted-foreground">Target: 70g</div>
                        </Card>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="water" className="mt-0">
                      <div className="grid grid-cols-1 gap-4">
                        <Card className="border border-border/50 bg-card/90 p-4">
                          <h3 className="text-lg font-medium mb-2">Water Intake</h3>
                          <div className="text-3xl font-bold">2.5L</div>
                          <div className="text-muted-foreground">Target: 3L</div>
                        </Card>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="steps" className="mt-0">
                      <div className="grid grid-cols-1 gap-4">
                        <Card className="border border-border/50 bg-card/90 p-4">
                          <h3 className="text-lg font-medium mb-2">Steps</h3>
                          <div className="text-3xl font-bold">8,547</div>
                          <div className="text-muted-foreground">Target: 10,000</div>
                        </Card>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
              
              <div className="space-y-6">
                <Card className="border border-border/50 bg-card/90 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PlusIcon className="h-4 w-4" />
                      Add Today's Data
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
                      
                      <div className="grid grid-cols-2 items-end gap-3">
                        <div>
                          <Label htmlFor="sleep" className="flex items-center gap-1 text-sm mb-1.5">
                            <MoonIcon className="h-3.5 w-3.5" />
                            Sleep
                          </Label>
                          <Input id="sleep" type="number" placeholder="0.0" />
                        </div>
                        <div>
                          <Label htmlFor="unit-sleep" className="text-sm">Unit</Label>
                          <Input id="unit-sleep" value="hours" readOnly />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 items-end gap-3">
                        <div>
                          <Label htmlFor="calories" className="flex items-center gap-1 text-sm mb-1.5">
                            <UtensilsCrossedIcon className="h-3.5 w-3.5" />
                            Calories
                          </Label>
                          <Input id="calories" type="number" placeholder="0" />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 items-end gap-3">
                        <div>
                          <Label htmlFor="protein" className="text-sm mb-1.5">
                            Protein
                          </Label>
                          <Input id="protein" type="number" placeholder="0" />
                        </div>
                        <div>
                          <Label htmlFor="carbs" className="text-sm mb-1.5">
                            Carbs
                          </Label>
                          <Input id="carbs" type="number" placeholder="0" />
                        </div>
                        <div>
                          <Label htmlFor="fats" className="text-sm mb-1.5">
                            Fats
                          </Label>
                          <Input id="fats" type="number" placeholder="0" />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 items-end gap-3">
                        <div>
                          <Label htmlFor="water" className="flex items-center gap-1 text-sm mb-1.5">
                            <DropletIcon className="h-3.5 w-3.5" />
                            Water
                          </Label>
                          <Input id="water" type="number" placeholder="0.0" />
                        </div>
                        <div>
                          <Label htmlFor="unit-water" className="text-sm">Unit</Label>
                          <Input id="unit-water" value="liters" readOnly />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 items-end gap-3">
                        <div>
                          <Label htmlFor="steps" className="flex items-center gap-1 text-sm mb-1.5">
                            <FootprintsIcon className="h-3.5 w-3.5" />
                            Steps
                          </Label>
                          <Input id="steps" type="number" placeholder="0" />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-3">
                        <Label className="text-sm mb-1.5">Cardio Performed?</Label>
                        <div className="flex gap-2">
                          <Button type="button" variant="outline" className="flex-1">Yes</Button>
                          <Button type="button" variant="outline" className="flex-1">No</Button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 items-end gap-3">
                        <div>
                          <Label htmlFor="cardio-type" className="text-sm mb-1.5">
                            Cardio Type
                          </Label>
                          <Select>
                            <SelectTrigger id="cardio-type">
                              <SelectValue placeholder="Select cardio type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="none">None</SelectItem>
                              <SelectItem value="walking">Walking</SelectItem>
                              <SelectItem value="running">Running</SelectItem>
                              <SelectItem value="cycling">Cycling</SelectItem>
                              <SelectItem value="swimming">Swimming</SelectItem>
                              <SelectItem value="elliptical">Elliptical</SelectItem>
                              <SelectItem value="rowing">Rowing</SelectItem>
                              <SelectItem value="stairs">Stair Machine</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <Button className="w-full mt-4" type="button">
                        <Save className="h-4 w-4 mr-2" />
                        Save Data
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="health-markers" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="md:col-span-2 border border-border/50 bg-card/90 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Health Markers Overview</CardTitle>
                </CardHeader>
                <CardContent className="px-2">
                  <Tabs defaultValue="blood-pressure">
                    <TabsList className="mb-4">
                      <TabsTrigger value="blood-pressure">Blood Pressure</TabsTrigger>
                      <TabsTrigger value="heart-rate">Heart Rate</TabsTrigger>
                      <TabsTrigger value="sleep-quality">Sleep Quality</TabsTrigger>
                      <TabsTrigger value="wellbeing">Wellbeing</TabsTrigger>
                    </TabsList>
                    
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
                    
                    <TabsContent value="heart-rate" className="mt-0">
                      <LineChart 
                        title="Resting Heart Rate (bpm)"
                        data={mockHeartRateData}
                        dataKey="value"
                        color="hsl(350, 70%, 60%)"
                        tooltipLabel="Heart Rate"
                        valueFormatter={(value) => `${value} bpm`}
                      />
                    </TabsContent>
                    
                    <TabsContent value="sleep-quality" className="mt-0">
                      <div className="grid grid-cols-1 gap-4">
                        <Card className="border border-border/50 bg-card/90 p-4">
                          <h3 className="text-lg font-medium mb-2">Sleep Quality</h3>
                          <div className="text-3xl font-bold">7/10</div>
                          <div className="text-muted-foreground">Last 7 day average: 6.8/10</div>
                        </Card>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="wellbeing" className="mt-0">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card className="border border-border/50 bg-card/90 p-4">
                          <h3 className="text-lg font-medium mb-2">Fatigue/Soreness</h3>
                          <div className="text-3xl font-bold">4/10</div>
                        </Card>
                        <Card className="border border-border/50 bg-card/90 p-4">
                          <h3 className="text-lg font-medium mb-2">Mental Health</h3>
                          <div className="text-3xl font-bold">8/10</div>
                        </Card>
                        <Card className="border border-border/50 bg-card/90 p-4">
                          <h3 className="text-lg font-medium mb-2">Motivation</h3>
                          <div className="text-3xl font-bold">7/10</div>
                        </Card>
                        <Card className="border border-border/50 bg-card/90 p-4">
                          <h3 className="text-lg font-medium mb-2">General Wellbeing</h3>
                          <div className="text-3xl font-bold">8/10</div>
                        </Card>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
              
              <div className="space-y-6">
                <Card className="border border-border/50 bg-card/90 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PlusIcon className="h-4 w-4" />
                      Add Health Markers
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-4">
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
                          <Label htmlFor="heart-rate" className="flex items-center gap-1 text-sm mb-1.5">
                            <HeartPulseIcon className="h-3.5 w-3.5" />
                            Resting Heart Rate
                          </Label>
                          <Input id="heart-rate" type="number" placeholder="0" />
                        </div>
                        <div>
                          <Label htmlFor="unit-hr" className="text-sm">Unit</Label>
                          <Input id="unit-hr" value="bpm" readOnly />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 items-end gap-3">
                        <div>
                          <Label htmlFor="sleep-quality" className="text-sm mb-1.5">
                            Sleep Quality
                          </Label>
                          <Select>
                            <SelectTrigger id="sleep-quality">
                              <SelectValue placeholder="Select rating (1-10)" />
                            </SelectTrigger>
                            <SelectContent>
                              {ratingOptions.map(option => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 items-end gap-3">
                        <div>
                          <Label htmlFor="fatigue" className="text-sm mb-1.5">
                            Fatigue/Soreness
                          </Label>
                          <Select>
                            <SelectTrigger id="fatigue">
                              <SelectValue placeholder="Select rating (1-10)" />
                            </SelectTrigger>
                            <SelectContent>
                              {ratingOptions.map(option => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 items-end gap-3">
                        <div>
                          <Label htmlFor="nutrition-quality" className="text-sm mb-1.5">
                            Nutrition Quality
                          </Label>
                          <Select>
                            <SelectTrigger id="nutrition-quality">
                              <SelectValue placeholder="Select rating (1-10)" />
                            </SelectTrigger>
                            <SelectContent>
                              {ratingOptions.map(option => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 items-end gap-3">
                        <div>
                          <Label htmlFor="appetite" className="text-sm mb-1.5">
                            Appetite
                          </Label>
                          <Select>
                            <SelectTrigger id="appetite">
                              <SelectValue placeholder="Select rating (1-10)" />
                            </SelectTrigger>
                            <SelectContent>
                              {ratingOptions.map(option => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 items-end gap-3">
                        <div>
                          <Label htmlFor="digestion" className="text-sm mb-1.5">
                            Digestion
                          </Label>
                          <Select>
                            <SelectTrigger id="digestion">
                              <SelectValue placeholder="Select rating (1-10)" />
                            </SelectTrigger>
                            <SelectContent>
                              {ratingOptions.map(option => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 items-end gap-3">
                        <div>
                          <Label htmlFor="training-performance" className="text-sm mb-1.5">
                            Training Performance
                          </Label>
                          <Select>
                            <SelectTrigger id="training-performance">
                              <SelectValue placeholder="Select rating (1-10)" />
                            </SelectTrigger>
                            <SelectContent>
                              {ratingOptions.map(option => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 items-end gap-3">
                        <div>
                          <Label htmlFor="motivation" className="text-sm mb-1.5">
                            Motivation
                          </Label>
                          <Select>
                            <SelectTrigger id="motivation">
                              <SelectValue placeholder="Select rating (1-10)" />
                            </SelectTrigger>
                            <SelectContent>
                              {ratingOptions.map(option => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 items-end gap-3">
                        <div>
                          <Label htmlFor="mental-health" className="text-sm mb-1.5">
                            Mental Health
                          </Label>
                          <Select>
                            <SelectTrigger id="mental-health">
                              <SelectValue placeholder="Select rating (1-10)" />
                            </SelectTrigger>
                            <SelectContent>
                              {ratingOptions.map(option => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 items-end gap-3">
                        <div>
                          <Label htmlFor="wellbeing" className="text-sm mb-1.5">
                            General Sense of Wellbeing
                          </Label>
                          <Select>
                            <SelectTrigger id="wellbeing">
                              <SelectValue placeholder="Select rating (1-10)" />
                            </SelectTrigger>
                            <SelectContent>
                              {ratingOptions.map(option => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 items-end gap-3">
                        <div>
                          <Label htmlFor="targets-difficulty" className="text-sm mb-1.5">
                            Difficulty of Hitting Targets
                          </Label>
                          <Select>
                            <SelectTrigger id="targets-difficulty">
                              <SelectValue placeholder="Select rating (1-10)" />
                            </SelectTrigger>
                            <SelectContent>
                              {ratingOptions.map(option => (
                                <SelectItem key={option.value} value={option.value}>
                                  {option.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <Button className="w-full mt-4" type="button">
                        <Save className="h-4 w-4 mr-2" />
                        Save Health Markers
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default DailyMetrics;
