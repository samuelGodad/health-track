
import { useAuth } from "@/providers/SupabaseAuthProvider";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricCard } from "@/components/MetricCard";
import {
  ActivityIcon,
  TrendingUpIcon,
  FlaskConicalIcon,
  HeartPulseIcon,
} from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Welcome back, {user?.email?.split('@')[0] || 'User'}</h2>
            <p className="text-muted-foreground">Here's what's happening with your health metrics today.</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Active Cycles"
            value="2"
            icon={<ActivityIcon className="h-4 w-4" />}
            trend={{ value: 12, isPositive: true }}
          />
          <MetricCard
            title="Recent Tests"
            value="5"
            icon={<FlaskConicalIcon className="h-4 w-4" />}
            trend={{ value: 8, isPositive: true }}
          />
          <MetricCard
            title="Health Score"
            value="87%"
            icon={<HeartPulseIcon className="h-4 w-4" />}
            trend={{ value: 5, isPositive: true }}
          />
          <MetricCard
            title="Improvement"
            value="+12%"
            icon={<TrendingUpIcon className="h-4 w-4" />}
            trend={{ value: 15, isPositive: true }}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                Activity chart will go here
              </div>
            </CardContent>
          </Card>
          
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Quick Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Blood Tests</span>
                  <span className="text-sm text-muted-foreground">5 this month</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Cycles Planned</span>
                  <span className="text-sm text-muted-foreground">2 active</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Injections</span>
                  <span className="text-sm text-muted-foreground">12 total</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
