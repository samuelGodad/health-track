
import { useState, useEffect } from 'react';
import { useAuth } from "@/providers/SupabaseAuthProvider";
import { useCycle } from "@/contexts/CycleContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricCard } from "@/components/MetricCard";
import { DashboardChart } from "@/components/DashboardChart";
import { RecentActivityList } from "@/components/RecentActivityList";
import DashboardService, { DashboardMetrics, DashboardTrends, RecentActivity } from "@/services/dashboardService";
import {
  ActivityIcon,
  TrendingUpIcon,
  FlaskConicalIcon,
  HeartPulseIcon,
  AlertTriangleIcon,
  CalendarIcon,
} from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const Dashboard = () => {
  const { user } = useAuth();
  const { cyclePeriods } = useCycle();
  const { toast } = useToast();
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [trends, setTrends] = useState<DashboardTrends | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setIsLoading(true);
        const dashboardService = DashboardService.getInstance();
        
        // Load all dashboard data in parallel, passing cycle periods for active cycle calculation
        const [metricsData, trendsData, activityData] = await Promise.all([
          dashboardService.getDashboardMetrics(cyclePeriods),
          dashboardService.getDashboardTrends(),
          dashboardService.getRecentActivity()
        ]);

        setMetrics(metricsData);
        setTrends(trendsData);
        setRecentActivity(activityData);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        toast({
          title: "Error",
          description: "Failed to load dashboard data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      loadDashboardData();
    }
  }, [user, cyclePeriods, toast]);

  const getHealthScoreColor = (score: number) => {
    if (score >= 80) return 'text-emerald-500';
    if (score >= 60) return 'text-amber-500';
    return 'text-rose-500';
  };

  const getImprovementColor = (improvement: number) => {
    if (improvement > 0) return 'text-emerald-500';
    if (improvement < 0) return 'text-rose-500';
    return 'text-muted-foreground';
  };

  const getImprovementIcon = (improvement: number) => {
    if (improvement > 0) return <TrendingUpIcon className="h-4 w-4" />;
    if (improvement < 0) return <TrendingUpIcon className="h-4 w-4 rotate-180" />;
    return <ActivityIcon className="h-4 w-4" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Welcome back, {user?.email?.split('@')[0] || 'User'}
          </h2>
          <p className="text-muted-foreground">
            Here's what's happening with your health metrics today.
          </p>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Active Cycles"
          value={isLoading ? "..." : metrics?.activeCycles?.toString() || "0"}
          icon={<ActivityIcon className="h-4 w-4" />}
          trend={metrics ? { value: 12, isPositive: true } : undefined}
          isLoading={isLoading}
        />
        <MetricCard
          title="Recent Tests"
          value={isLoading ? "..." : metrics?.recentBloodTests?.toString() || "0"}
          icon={<FlaskConicalIcon className="h-4 w-4" />}
          trend={metrics ? { value: 8, isPositive: true } : undefined}
          isLoading={isLoading}
        />
        <MetricCard
          title="Health Score"
          value={isLoading ? "..." : `${metrics?.healthScore || 0}%`}
          icon={<HeartPulseIcon className="h-4 w-4" />}
          trend={metrics ? { value: 5, isPositive: true } : undefined}
          isLoading={isLoading}
          valueClassName={metrics ? getHealthScoreColor(metrics.healthScore) : ""}
        />
        <MetricCard
          title="Improvement"
          value={isLoading ? "..." : `${metrics?.improvementPercentage || 0}%`}
          icon={metrics ? getImprovementIcon(metrics.improvementPercentage) : <TrendingUpIcon className="h-4 w-4" />}
          trend={metrics ? { value: Math.abs(metrics.improvementPercentage), isPositive: metrics.improvementPercentage > 0 } : undefined}
          isLoading={isLoading}
          valueClassName={metrics ? getImprovementColor(metrics.improvementPercentage) : ""}
        />
      </div>

      {/* Charts and Activity Section */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Blood Test Trends Chart */}
        <div className="col-span-4">
          <DashboardChart
            title="Blood Test Activity"
            data={trends?.bloodTestTrend || []}
            dataKey="count"
            color="#3b82f6"
            type="bar"
            height={200}
            formatValue={(value) => `${value} tests`}
          />
        </div>
        
        {/* Quick Stats */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Quick Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Blood Tests</span>
                <span className="text-sm text-muted-foreground">
                  {isLoading ? "..." : `${metrics?.testsThisMonth || 0} this month`}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Cycles Planned</span>
                <span className="text-sm text-muted-foreground">
                  {isLoading ? "..." : `${metrics?.activeCycles || 0} active`}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Abnormal Tests</span>
                <span className="text-sm text-muted-foreground">
                  {isLoading ? "..." : `${metrics?.abnormalTests || 0} total`}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Avg Tests/Month</span>
                <span className="text-sm text-muted-foreground">
                  {isLoading ? "..." : `${metrics?.averageTestsPerMonth || 0}`}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity and Health Score Chart */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Recent Activity */}
        <div className="col-span-4">
          <RecentActivityList activities={recentActivity} maxItems={6} />
        </div>
        
        {/* Health Score Trend */}
        <div className="col-span-3">
          <DashboardChart
            title="Health Score Trend"
            data={trends?.healthScoreTrend || []}
            dataKey="score"
            color="#10b981"
            type="line"
            height={200}
            formatValue={(value) => `${value}%`}
          />
        </div>
      </div>

      {/* Health Alerts Section */}
      {metrics?.abnormalTests && metrics.abnormalTests > 0 && (
        <Card className="border border-amber-200 bg-amber-50/50">
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <AlertTriangleIcon className="h-4 w-4 text-amber-600" />
              Health Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-amber-800">
              You have {metrics.abnormalTests} test(s) with abnormal results. 
              Consider reviewing these with your healthcare provider.
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;
