
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
import { useState, useEffect, useMemo } from 'react';
import { useAuth } from "@/providers/SupabaseAuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const Analytics = () => {
  const { user } = useAuth();
  const [bloodTestResults, setBloodTestResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>("1M");

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

  // Blood test categories
  const bloodTestCategories = {
    all: "All Tests",
    cardiac: "Cardiac Health",
    liver: "Liver Function",
    kidney: "Kidney Function",
    hormones: "Hormones",
    metabolic: "Metabolic Panel",
    lipids: "Lipid Profile",
    vitamins: "Vitamins & Minerals",
    inflammation: "Inflammation Markers"
  };

  // Group tests by category
  const categorizeTest = (testName: string, category: string) => {
    const test = testName.toLowerCase();
    
    if (category === 'cardiac') {
      return test.includes('cholesterol') || test.includes('hdl') || test.includes('ldl') || 
             test.includes('triglycerides') || test.includes('crp') || test.includes('troponin');
    }
    if (category === 'liver') {
      return test.includes('alt') || test.includes('ast') || test.includes('bilirubin') || 
             test.includes('albumin') || test.includes('alp');
    }
    if (category === 'kidney') {
      return test.includes('creatinine') || test.includes('urea') || test.includes('egfr') || 
             test.includes('protein');
    }
    if (category === 'hormones') {
      return test.includes('testosterone') || test.includes('estrogen') || test.includes('thyroid') || 
             test.includes('tsh') || test.includes('t3') || test.includes('t4');
    }
    if (category === 'metabolic') {
      return test.includes('glucose') || test.includes('sodium') || test.includes('potassium') || 
             test.includes('chloride');
    }
    if (category === 'lipids') {
      return test.includes('cholesterol') || test.includes('hdl') || test.includes('ldl') || 
             test.includes('triglycerides');
    }
    if (category === 'vitamins') {
      return test.includes('vitamin') || test.includes('b12') || test.includes('folate') || 
             test.includes('iron') || test.includes('ferritin');
    }
    if (category === 'inflammation') {
      return test.includes('crp') || test.includes('esr') || test.includes('il-6');
    }
    
    return true; // for 'all' category
  };

  // Get unique tests for the selected category
  const filteredTests = useMemo(() => {
    const uniqueTests = new Map();
    
    bloodTestResults.forEach(test => {
      if (selectedCategory === 'all' || categorizeTest(test.test_name, selectedCategory)) {
        if (!uniqueTests.has(test.test_name)) {
          // Get the latest result for this test
          const latestTest = bloodTestResults
            .filter(t => t.test_name === test.test_name)
            .sort((a, b) => new Date(b.test_date).getTime() - new Date(a.test_date).getTime())[0];
          
          // Calculate change (mock for now)
          const previousResults = bloodTestResults
            .filter(t => t.test_name === test.test_name && t.test_date !== latestTest.test_date)
            .sort((a, b) => new Date(b.test_date).getTime() - new Date(a.test_date).getTime());
          
          let change = 0;
          let changePercent = 0;
          
          if (previousResults.length > 0) {
            const previousValue = previousResults[0].result;
            change = latestTest.result - previousValue;
            changePercent = ((change / previousValue) * 100);
          }
          
          uniqueTests.set(test.test_name, {
            ...latestTest,
            change,
            changePercent,
            isPositive: change >= 0
          });
        }
      }
    });
    
    return Array.from(uniqueTests.values());
  }, [bloodTestResults, selectedCategory]);

  const timeframes = ["1D", "1W", "1M", "3M", "1Y", "All"];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Blood Analytics</h2>
            <p className="text-muted-foreground">Deep dive into your blood test data patterns and insights.</p>
          </div>
        </div>

        {/* Category Selection */}
        <div className="flex items-center gap-4">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(bloodTestCategories).map(([key, label]) => (
                <SelectItem key={key} value={key}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Sidebar - Test List */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>{bloodTestCategories[selectedCategory as keyof typeof bloodTestCategories]}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {isLoading ? (
                  <div className="text-center text-muted-foreground">Loading...</div>
                ) : filteredTests.length === 0 ? (
                  <div className="text-center text-muted-foreground">No tests in this category</div>
                ) : (
                  filteredTests.map((test) => (
                    <div key={test.id} className="border rounded-lg p-4 hover:bg-muted/50 cursor-pointer">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium text-sm">{test.test_name}</h4>
                          <p className="text-xs text-muted-foreground">{test.category}</p>
                        </div>
                        <div className="w-8 h-8 bg-muted rounded flex items-center justify-center">
                          <BarChart3Icon className="w-4 h-4" />
                        </div>
                      </div>
                      
                      <div className="space-y-1">
                        <div className="text-lg font-bold">
                          {test.result} {test.unit}
                        </div>
                        <div className={`text-sm flex items-center gap-1 ${
                          test.isPositive ? 'text-green-600' : 'text-red-600'
                        }`}>
                          <span>{test.isPositive ? '+' : ''}{test.change.toFixed(2)}</span>
                          <span>({test.changePercent.toFixed(2)}%)</span>
                        </div>
                        
                        <div className="text-xs text-muted-foreground space-y-1">
                          <div>Updated: {new Date(test.test_date).toLocaleDateString()}</div>
                          {test.reference_min && test.reference_max && (
                            <div>Range: {test.reference_min} - {test.reference_max}</div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Side - Chart Area */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>Test Trends</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      Select a test from the left to view its trend over time
                    </p>
                  </div>
                  <div className="flex gap-1">
                    {timeframes.map((timeframe) => (
                      <Button
                        key={timeframe}
                        variant={selectedTimeframe === timeframe ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedTimeframe(timeframe)}
                        className="text-xs"
                      >
                        {timeframe}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] w-full">
                  {filteredTests.length > 0 ? (
                    <BloodTestTimeline bloodTestResults={bloodTestResults} />
                  ) : (
                    <div className="h-full flex items-center justify-center border border-dashed rounded-lg">
                      <div className="text-center">
                        <BarChart3Icon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">Select a category to view test trends</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Total Tests"
            value={bloodTestResults.length.toString()}
            icon={<BarChart3Icon className="h-4 w-4" />}
            trend={{ value: 23, isPositive: true }}
          />
          <MetricCard
            title="Test Categories"
            value={Object.keys(bloodTestCategories).length.toString()}
            icon={<ActivityIcon className="h-4 w-4" />}
            trend={{ value: 8, isPositive: true }}
          />
          <MetricCard
            title="Active Monitoring"
            value={filteredTests.length.toString()}
            icon={<PieChartIcon className="h-4 w-4" />}
            trend={{ value: 2, isPositive: true }}
          />
          <MetricCard
            title="Health Score"
            value="94%"
            icon={<TrendingUpIcon className="h-4 w-4" />}
            trend={{ value: 3, isPositive: true }}
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;
