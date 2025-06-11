
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricCard } from "@/components/MetricCard";
import { LineChart } from "@/components/ui/line-chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import {
  BarChart3Icon,
  TrendingUpIcon,
  ActivityIcon,
  PieChartIcon,
} from 'lucide-react';
import BloodTestTimeline from '@/components/bloodTests/BloodTestTimeline';
import { useState, useEffect } from 'react';
import { useAuth } from "@/providers/SupabaseAuthProvider";
import { supabase } from "@/integrations/supabase/client";

const Analytics = () => {
  const { user } = useAuth();
  const [bloodTestResults, setBloodTestResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchBloodTestResults();
    }
  }, [user]);

  const fetchBloodTestResults = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('blood_test_results')
        .select('*')
        .eq('user_id', user?.id)
        .order('test_date', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      if (data) {
        setBloodTestResults(data);
      }
    } catch (error) {
      console.error('Error fetching blood test results:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Sample data for bar charts - replace with actual data processing
  const testFrequencyData = [
    { name: 'Testosterone', count: 8 },
    { name: 'Cholesterol', count: 6 },
    { name: 'Vitamin D', count: 5 },
    { name: 'Iron', count: 4 },
    { name: 'B12', count: 3 },
  ];

  const averageResultsData = [
    { name: 'Jan', testosterone: 650, cholesterol: 180, vitaminD: 35 },
    { name: 'Feb', testosterone: 675, cholesterol: 175, vitaminD: 38 },
    { name: 'Mar', testosterone: 690, cholesterol: 170, vitaminD: 42 },
    { name: 'Apr', testosterone: 710, cholesterol: 165, vitaminD: 45 },
    { name: 'May', testosterone: 700, cholesterol: 160, vitaminD: 48 },
    { name: 'Jun', testosterone: 720, cholesterol: 155, vitaminD: 50 },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Blood Analytics</h2>
            <p className="text-muted-foreground">Deep dive into your blood test data patterns and insights.</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Total Tests"
            value={bloodTestResults.length.toString()}
            icon={<BarChart3Icon className="h-4 w-4" />}
            trend={{ value: 23, isPositive: true }}
          />
          <MetricCard
            title="Test Types"
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
            title="Tracking Score"
            value="94%"
            icon={<TrendingUpIcon className="h-4 w-4" />}
            trend={{ value: 3, isPositive: true }}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Test Frequency</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={testFrequencyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="hsl(var(--primary))" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Average Results Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={averageResultsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="testosterone" fill="hsl(var(--primary))" />
                    <Bar dataKey="cholesterol" fill="hsl(var(--secondary))" />
                    <Bar dataKey="vitaminD" fill="hsl(var(--accent))" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold">Blood Test Timeline</h3>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-muted-foreground">Loading blood test data...</div>
            </div>
          ) : (
            <BloodTestTimeline bloodTestResults={bloodTestResults} />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;
