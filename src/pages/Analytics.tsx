
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricCard } from "@/components/MetricCard";
import {
  BarChart3Icon,
  TrendingUpIcon,
  ActivityIcon,
  PieChartIcon,
} from 'lucide-react';

const Analytics = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Analytics</h2>
            <p className="text-muted-foreground">Deep dive into your health data patterns and insights.</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Data Points"
            value="147"
            icon={<BarChart3Icon className="h-4 w-4" />}
            trend={{ value: 23, isPositive: true }}
          />
          <MetricCard
            title="Correlations"
            value="12"
            icon={<ActivityIcon className="h-4 w-4" />}
            trend={{ value: 8, isPositive: true }}
          />
          <MetricCard
            title="Insights"
            value="5"
            icon={<PieChartIcon className="h-4 w-4" />}
            trend={{ value: 2, isPositive: true }}
          />
          <MetricCard
            title="Accuracy"
            value="94%"
            icon={<TrendingUpIcon className="h-4 w-4" />}
            trend={{ value: 3, isPositive: true }}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Blood Test Correlations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                Blood test correlation chart will go here
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                Performance analytics chart will go here
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;
