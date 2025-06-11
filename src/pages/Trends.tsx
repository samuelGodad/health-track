
import { useState } from 'react';
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricCard } from "@/components/MetricCard";
import { TrendToggle } from "@/components/TrendToggle";
import {
  TrendingUpIcon,
  TrendingDownIcon,
  ActivityIcon,
  CalendarIcon,
} from 'lucide-react';

const Trends = () => {
  const [viewMode, setViewMode] = useState<'daily' | 'weekly'>('weekly');

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Trends</h2>
            <p className="text-muted-foreground">Monitor your health metrics over time.</p>
          </div>
          <TrendToggle value={viewMode} onChange={setViewMode} />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Weight Trend"
            value="-2.3 kg"
            icon={<TrendingDownIcon className="h-4 w-4" />}
            trend={{ value: 15, isPositive: true }}
          />
          <MetricCard
            title="Energy Levels"
            value="+12%"
            icon={<TrendingUpIcon className="h-4 w-4" />}
            trend={{ value: 8, isPositive: true }}
          />
          <MetricCard
            title="Sleep Quality"
            value="8.2/10"
            icon={<ActivityIcon className="h-4 w-4" />}
            trend={{ value: 5, isPositive: true }}
          />
          <MetricCard
            title="Consistency"
            value="91%"
            icon={<CalendarIcon className="h-4 w-4" />}
            trend={{ value: 3, isPositive: true }}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Health Metrics Trends ({viewMode})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center text-muted-foreground">
                {viewMode} trends chart will go here
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Blood Pressure</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                BP trend chart
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Heart Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                HR trend chart
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recovery</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                Recovery trend chart
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Trends;
