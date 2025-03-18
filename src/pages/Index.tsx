
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import { MetricCard } from '@/components/MetricCard';
import { LineChart } from '@/components/LineChart';
import { 
  ActivityIcon, 
  DropletIcon, 
  HeartPulseIcon, 
  WeightIcon,
  BarChart3Icon,
  GaugeIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

// Mock data for recent blood test results
const mockBloodTests = [
  { date: '2023-01-15', value: 4.2, type: 'Testosterone' },
  { date: '2023-02-15', value: 4.1, type: 'Testosterone' },
  { date: '2023-03-15', value: 4.4, type: 'Testosterone' },
  { date: '2023-04-15', value: 4.5, type: 'Testosterone' },
  { date: '2023-05-15', value: 4.7, type: 'Testosterone' },
  { date: '2023-06-15', value: 4.9, type: 'Testosterone' },
];

// Mock data for weight trend
const mockWeightData = [
  { date: '2023-06-01', value: 85 },
  { date: '2023-06-08', value: 84.5 },
  { date: '2023-06-15', value: 84.2 },
  { date: '2023-06-22', value: 83.8 },
  { date: '2023-06-29', value: 83.5 },
  { date: '2023-07-06', value: 83.1 },
  { date: '2023-07-13', value: 82.8 },
];

const Index = () => {
  const [animateIn] = useState(true);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className={`pt-24 pb-16 px-4 md:px-6 max-w-screen-xl mx-auto transition-opacity duration-500 ${animateIn ? 'opacity-100' : 'opacity-0'}`}>
        <div className="flex flex-col gap-2 mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Welcome back</h1>
          <p className="text-muted-foreground">
            Track your fitness journey and monitor your health metrics
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 animate-fade-in" style={{ animationDelay: '100ms' }}>
          <MetricCard
            title="Weight"
            value="83.1 kg"
            icon={<WeightIcon className="h-full w-full" />}
            trend={{ value: 2.3, isPositive: false }}
          />
          <MetricCard
            title="Blood Pressure"
            value="120/80"
            icon={<GaugeIcon className="h-full w-full" />}
          />
          <MetricCard
            title="Heart Rate"
            value="72 bpm"
            icon={<HeartPulseIcon className="h-full w-full" />}
            trend={{ value: 1.5, isPositive: true }}
          />
          <MetricCard
            title="Daily Calories"
            value="2,450"
            icon={<BarChart3Icon className="h-full w-full" />}
            trend={{ value: 5, isPositive: true }}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8 animate-fade-in" style={{ animationDelay: '200ms' }}>
          <LineChart 
            title="Weight Trend (kg)"
            data={mockWeightData}
            dataKey="value"
            tooltipLabel="Weight"
            valueFormatter={(value) => `${value} kg`}
          />
          <LineChart 
            title="Testosterone Level (ng/mL)"
            data={mockBloodTests}
            dataKey="value"
            color="hsl(250, 60%, 60%)"
            tooltipLabel="Testosterone"
            valueFormatter={(value) => `${value} ng/mL`}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-fade-in" style={{ animationDelay: '300ms' }}>
          <Card className="p-6 border border-border/50 bg-card/90 backdrop-blur-sm flex flex-col items-center text-center">
            <DropletIcon className="h-12 w-12 mb-4 text-primary" />
            <h3 className="text-lg font-medium mb-2">Blood Tests</h3>
            <p className="text-muted-foreground mb-4">Upload and track your blood test results over time.</p>
            <Button className="w-full mt-auto" variant="default" asChild>
              <a href="/blood-tests">View Blood Tests</a>
            </Button>
          </Card>
          
          <Card className="p-6 border border-border/50 bg-card/90 backdrop-blur-sm flex flex-col items-center text-center">
            <ActivityIcon className="h-12 w-12 mb-4 text-primary" />
            <h3 className="text-lg font-medium mb-2">Daily Metrics</h3>
            <p className="text-muted-foreground mb-4">Record daily health metrics like weight, blood pressure, and more.</p>
            <Button className="w-full mt-auto" variant="default" asChild>
              <a href="/daily-metrics">Record Metrics</a>
            </Button>
          </Card>
          
          <Card className="p-6 border border-border/50 bg-card/90 backdrop-blur-sm flex flex-col items-center text-center">
            <WeightIcon className="h-12 w-12 mb-4 text-primary" />
            <h3 className="text-lg font-medium mb-2">Body Progress</h3>
            <p className="text-muted-foreground mb-4">Upload photos to visually track your body transformation.</p>
            <Button className="w-full mt-auto" variant="default" asChild>
              <a href="/body-progress">View Progress</a>
            </Button>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Index;
