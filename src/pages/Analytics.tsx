import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricCard } from "@/components/MetricCard";
import { LineChart } from "@/components/ui/line-chart";
import {
  BarChart3Icon,
  TrendingUpIcon,
  ActivityIcon,
  PieChartIcon,
} from 'lucide-react';
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
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { format, parseISO } from 'date-fns';

const Analytics = () => {
  const { user } = useAuth();
  const [bloodTestResults, setBloodTestResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedTest1, setSelectedTest1] = useState<string | null>(null);
  const [selectedTest2, setSelectedTest2] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

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

  // Get unique tests for the selected category and search query
  const filteredTests = useMemo(() => {
    const uniqueTests = new Map();
    
    bloodTestResults.forEach(test => {
      const matchesCategory = selectedCategory === 'all' || categorizeTest(test.test_name, selectedCategory);
      const matchesSearch = searchQuery === '' || test.test_name.toLowerCase().includes(searchQuery.toLowerCase());
      
      if (matchesCategory && matchesSearch) {
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
  }, [bloodTestResults, selectedCategory, searchQuery]);

  // Create chart data for selected tests
  const createChartData = (testName: string) => {
    if (!testName) return [];
    
    const relevantTests = bloodTestResults
      .filter(test => test.test_name === testName);
    
    const deduplicated = new Map<string, any>();
    
    const sortedTests = [...relevantTests].sort((a, b) => 
      new Date(b.id).getTime() - new Date(a.id).getTime()
    );
    
    sortedTests.forEach(test => {
      if (!deduplicated.has(test.test_date)) {
        deduplicated.set(test.test_date, test);
      }
    });
    
    return Array.from(deduplicated.values())
      .sort((a, b) => new Date(a.test_date).getTime() - new Date(b.test_date).getTime())
      .map(test => {
        let formattedDate;
        try {
          formattedDate = format(parseISO(test.test_date), 'MMM d');
        } catch (e) {
          formattedDate = test.test_date;
        }
        
        return {
          date: formattedDate,
          value: test.result
        };
      });
  };

  const chartData1 = createChartData(selectedTest1 || '');
  const chartData2 = createChartData(selectedTest2 || '');

  // Get test details for selected tests
  const getTestDetails = (testName: string) => {
    if (!testName) return { unit: '', min: null, max: null };
    
    const test = bloodTestResults.find(t => t.test_name === testName);
    return {
      unit: test?.unit || '',
      min: test?.reference_min || null,
      max: test?.reference_max || null
    };
  };

  const test1Details = getTestDetails(selectedTest1 || '');
  const test2Details = getTestDetails(selectedTest2 || '');

  const handleTestClick = (testName: string) => {
    if (!selectedTest1) {
      setSelectedTest1(testName);
    } else if (!selectedTest2) {
      setSelectedTest2(testName);
    } else {
      // If both tests are selected, replace the first one
      setSelectedTest1(testName);
      setSelectedTest2(null);
    }
  };

  const clearTestSelection = (testNumber: 1 | 2) => {
    if (testNumber === 1) {
      setSelectedTest1(null);
    } else {
      setSelectedTest2(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Blood Analytics</h2>
            <p className="text-muted-foreground">Deep dive into your blood test data patterns and insights.</p>
          </div>
        </div>

        {/* Category Selection and Search */}
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
          
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder="Search blood tests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Sidebar - Test List */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>{bloodTestCategories[selectedCategory as keyof typeof bloodTestCategories]}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 max-h-[600px] overflow-y-auto">
                {isLoading ? (
                  <div className="text-center text-muted-foreground">Loading...</div>
                ) : filteredTests.length === 0 ? (
                  <div className="text-center text-muted-foreground">No tests in this category</div>
                ) : (
                  filteredTests.map((test) => (
                    <div 
                      key={test.id} 
                      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                        selectedTest1 === test.test_name || selectedTest2 === test.test_name
                          ? 'bg-primary/10 border-primary' 
                          : 'hover:bg-muted/50'
                      }`}
                      onClick={() => handleTestClick(test.test_name)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
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
                <CardTitle>Test Trends</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Select tests from the left to compare their trends over time
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Selected Tests Display */}
                {(selectedTest1 || selectedTest2) && (
                  <div className="space-y-2">
                    {selectedTest1 && (
                      <div className="flex items-center justify-between bg-primary/10 rounded p-2">
                        <span className="text-sm font-medium">Test 1: {selectedTest1}</span>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => clearTestSelection(1)}
                          className="h-6 w-6 p-0"
                        >
                          ×
                        </Button>
                      </div>
                    )}
                    {selectedTest2 && (
                      <div className="flex items-center justify-between bg-secondary/10 rounded p-2">
                        <span className="text-sm font-medium">Test 2: {selectedTest2}</span>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => clearTestSelection(2)}
                          className="h-6 w-6 p-0"
                        >
                          ×
                        </Button>
                      </div>
                    )}
                  </div>
                )}

                {/* Charts */}
                {selectedTest1 && chartData1.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">{selectedTest1}</h4>
                    <div className="h-[250px] w-full">
                      <LineChart
                        data={chartData1}
                        dataKey="value"
                        color="hsl(var(--primary))"
                        tooltipLabel={selectedTest1}
                        valueFormatter={(value) => `${value} ${test1Details.unit}`}
                        referenceMin={test1Details.min}
                        referenceMax={test1Details.max}
                      />
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Reference Range: {test1Details.min !== null && test1Details.max !== null 
                        ? `${test1Details.min} - ${test1Details.max} ${test1Details.unit}`
                        : 'No reference range available'} | {chartData1.length} data points
                    </div>
                  </div>
                )}

                {selectedTest2 && chartData2.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">{selectedTest2}</h4>
                    <div className="h-[250px] w-full">
                      <LineChart
                        data={chartData2}
                        dataKey="value"
                        color="hsl(var(--destructive))"
                        tooltipLabel={selectedTest2}
                        valueFormatter={(value) => `${value} ${test2Details.unit}`}
                        referenceMin={test2Details.min}
                        referenceMax={test2Details.max}
                      />
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Reference Range: {test2Details.min !== null && test2Details.max !== null 
                        ? `${test2Details.min} - ${test2Details.max} ${test2Details.unit}`
                        : 'No reference range available'} | {chartData2.length} data points
                    </div>
                  </div>
                )}

                {/* Empty State */}
                {!selectedTest1 && !selectedTest2 && (
                  <div className="h-[400px] w-full flex items-center justify-center border border-dashed rounded-lg">
                    <div className="text-center">
                      <BarChart3Icon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">Click on tests from the left to view and compare trends</p>
                      <p className="text-xs text-muted-foreground mt-2">You can select up to 2 tests for comparison</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;
