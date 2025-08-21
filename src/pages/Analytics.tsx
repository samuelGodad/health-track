import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MetricCard } from "@/components/MetricCard";
import { LineChart } from "@/components/ui/line-chart";
import {
  BarChart3Icon,
  TrendingUpIcon,
  ActivityIcon,
  PieChartIcon,
  SmartphoneIcon,
  MonitorIcon,
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
import { Search, X } from "lucide-react";
import { format, parseISO } from 'date-fns';
import { useMediaQuery } from "@/hooks/use-mobile";

const Analytics = () => {
  const { user } = useAuth();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isTablet = useMediaQuery("(max-width: 1024px)");
  const [bloodTestResults, setBloodTestResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedTest1, setSelectedTest1] = useState<string | null>(null);
  const [selectedTest2, setSelectedTest2] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showMobileChart, setShowMobileChart] = useState(false);

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

  // Get unique categories from the database
  const availableCategories = useMemo(() => {
    const categories = new Set<string>();
    bloodTestResults.forEach(test => {
      if (test.category) {
        categories.add(test.category);
      }
    });
    const sortedCategories = Array.from(categories).sort();
    return sortedCategories;
  }, [bloodTestResults]);

  // Blood test categories - dynamically generated from available data
  const bloodTestCategories = useMemo(() => {
    const categories: { [key: string]: string } = {
      all: "All Tests"
    };
    
    // Add all available categories from the database
    availableCategories.forEach(category => {
      categories[category] = category;
    });
    
    return categories;
  }, [availableCategories]);

  // Get unique tests for the selected category and search query
  const filteredTests = useMemo(() => {
    const uniqueTests = new Map();
    
    bloodTestResults.forEach(test => {
      // Apply category filter
      if (selectedCategory !== "all" && test.category !== selectedCategory) {
        return;
      }
      
      // Apply search filter
      if (searchQuery && !test.test_name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return;
      }
      
      // Group by test name and keep the most recent result
      if (!uniqueTests.has(test.test_name) || 
          new Date(test.test_date) > new Date(uniqueTests.get(test.test_name).test_date)) {
        uniqueTests.set(test.test_name, test);
      }
    });
    
    return Array.from(uniqueTests.values()).sort((a, b) => a.test_name.localeCompare(b.test_name));
  }, [bloodTestResults, selectedCategory, searchQuery]);

  // Get chart data for selected tests
  const chartData1 = useMemo(() => {
    if (!selectedTest1) return [];
    
    return bloodTestResults
      .filter(test => test.test_name === selectedTest1)
      .sort((a, b) => new Date(a.test_date).getTime() - new Date(b.test_date).getTime())
      .map(test => ({
        date: format(new Date(test.test_date), 'MMM dd'),
        value: parseFloat(test.result),
        fullDate: test.test_date
      }));
  }, [bloodTestResults, selectedTest1]);

  const chartData2 = useMemo(() => {
    if (!selectedTest2) return [];
    
    return bloodTestResults
      .filter(test => test.test_name === selectedTest2)
      .sort((a, b) => new Date(a.test_date).getTime() - new Date(b.test_date).getTime())
      .map(test => ({
        date: format(new Date(test.test_date), 'MMM dd'),
        value: parseFloat(test.result),
        fullDate: test.test_date
      }));
  }, [bloodTestResults, selectedTest2]);

  // Get test details for reference ranges
  const test1Details = useMemo(() => {
    if (!selectedTest1) return { unit: '', min: null, max: null };
    const test = bloodTestResults.find(t => t.test_name === selectedTest1);
    return {
      unit: test?.unit || '',
      min: test?.reference_min ? parseFloat(test.reference_min) : null,
      max: test?.reference_max ? parseFloat(test.reference_max) : null
    };
  }, [bloodTestResults, selectedTest1]);

  const test2Details = useMemo(() => {
    if (!selectedTest2) return { unit: '', min: null, max: null };
    const test = bloodTestResults.find(t => t.test_name === selectedTest2);
    return {
      unit: test?.unit || '',
      min: test?.reference_min ? parseFloat(test.reference_min) : null,
      max: test?.reference_max ? parseFloat(test.reference_max) : null
    };
  }, [bloodTestResults, selectedTest2]);

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
    
    // On mobile, show the chart after selecting a test
    if (isMobile) {
      setShowMobileChart(true);
    }
  };

  const clearTestSelection = (testNumber: 1 | 2) => {
    if (testNumber === 1) {
      setSelectedTest1(null);
    } else {
      setSelectedTest2(null);
    }
    
    // Hide mobile chart if no tests are selected
    if (isMobile && !selectedTest1 && !selectedTest2) {
      setShowMobileChart(false);
    }
  };

  const clearAllSelections = () => {
    setSelectedTest1(null);
    setSelectedTest2(null);
    setShowMobileChart(false);
  };

  // Mobile-friendly test card component
  const MobileTestCard = ({ test, isSelected, onClick }: any) => (
    <div 
      className={`border rounded-lg p-3 cursor-pointer transition-colors ${
        isSelected ? 'bg-primary/10 border-primary' : 'hover:bg-muted/50'
      }`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-sm truncate">{test.test_name}</h4>
          <p className="text-xs text-muted-foreground">{test.category}</p>
        </div>
        <div className="w-6 h-6 bg-muted rounded flex items-center justify-center ml-2">
          <BarChart3Icon className="w-3 h-3" />
        </div>
      </div>
      
      <div className="space-y-1">
        <div className="text-base font-bold">
          {test.result} {test.unit}
        </div>
        <div className="text-xs text-muted-foreground">
          {new Date(test.test_date).toLocaleDateString()}
        </div>
      </div>
    </div>
  );

  // Desktop test card component
  const DesktopTestCard = ({ test, isSelected, onClick }: any) => (
    <div 
      className={`border rounded-lg p-4 cursor-pointer transition-colors ${
        isSelected ? 'bg-primary/10 border-primary' : 'hover:bg-muted/50'
      }`}
      onClick={onClick}
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
        <div className="text-xs text-muted-foreground space-y-1">
          <div>Updated: {new Date(test.test_date).toLocaleDateString()}</div>
          {test.reference_min && test.reference_max && (
            <div>Range: {test.reference_min} - {test.reference_max}</div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <div className="space-y-4 md:space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Blood Analytics</h2>
            <p className="text-muted-foreground">Deep dive into your blood test data patterns and insights.</p>
          </div>
          
          {/* Mobile Chart Toggle */}
          {isMobile && (selectedTest1 || selectedTest2) && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowMobileChart(!showMobileChart)}
              className="flex items-center gap-2"
            >
              {showMobileChart ? <MonitorIcon className="w-4 h-4" /> : <SmartphoneIcon className="w-4 h-4" />}
              {showMobileChart ? 'Hide Chart' : 'Show Chart'}
            </Button>
          )}
        </div>

        {/* Category Selection and Search */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-[200px]">
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

        {/* Mobile Layout */}
        {isMobile ? (
          <div className="space-y-4">
            {/* Test List - Always visible and scrollable */}
            <Card className="mobile-layout-transition">
              <CardHeader className={`transition-all duration-300 ${showMobileChart ? 'pb-2' : 'pb-4'}`}>
                <CardTitle className="flex items-center justify-between">
                  {bloodTestCategories[selectedCategory as keyof typeof bloodTestCategories]}
                  {(selectedTest1 || selectedTest2) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearAllSelections}
                      className="h-6 w-6 p-0"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </CardTitle>
                {/* Mobile hint - only show when charts are hidden */}
                {!showMobileChart && (
                  <>
                    {!selectedTest1 && !selectedTest2 && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Tap on tests to view trends in a slide-up chart
                      </p>
                    )}
                    {(selectedTest1 || selectedTest2) && (
                      <p className="text-xs text-muted-foreground mt-1">
                        📊 Tap to show charts • Scroll to see more tests
                      </p>
                    )}
                  </>
                )}
                {/* Compact hint when charts are visible */}
                {showMobileChart && (
                  <p className="text-xs text-muted-foreground mt-1">
                    📊 Charts visible • Scroll tests above
                  </p>
                )}
              </CardHeader>
              <CardContent className={`space-y-3 overflow-y-auto transition-all duration-300 ${
                showMobileChart ? 'max-h-[300px]' : 'max-h-[400px]'
              }`}>
                {isLoading ? (
                  <div className="text-center text-muted-foreground py-8">Loading...</div>
                ) : filteredTests.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">No tests in this category</div>
                ) : (
                  <>
                    {filteredTests.map((test) => (
                      <MobileTestCard
                        key={test.id}
                        test={test}
                        isSelected={selectedTest1 === test.test_name || selectedTest2 === test.test_name}
                        onClick={() => handleTestClick(test.test_name)}
                      />
                    ))}
                    {/* Scroll indicator when charts are visible */}
                    {showMobileChart && filteredTests.length > 3 && (
                      <div className="text-center py-2 text-xs text-muted-foreground/60">
                        ↕️ Scroll for more tests
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>

            {/* Mobile Chart Overlay - More compact and doesn't block test list */}
            {showMobileChart && (selectedTest1 || selectedTest2) && (
              <div className="fixed inset-0 z-40 pointer-events-none">
                {/* Chart Overlay - More compact positioning */}
                <div className="absolute bottom-0 left-0 right-0 bg-background chart-overlay-content mobile-chart-overlay max-h-[50vh] overflow-hidden pointer-events-auto border-t border-border/50 shadow-2xl">
                  {/* Drag Handle */}
                  <div className="flex justify-center pt-2 pb-1 chart-drag-handle">
                    <div className="w-12 h-1 bg-muted-foreground/30 rounded-full"></div>
                  </div>
                  
                  {/* Chart Header - Very compact */}
                  <div className="px-4 pb-2 border-b border-border/50">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold">Test Trends</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowMobileChart(false)}
                        className="h-6 w-6 p-0"
                      >
                        <X className="w-3 h-3" />
                      </Button>
                    </div>
                    
                    {/* Selected Tests Display - Very compact */}
                    <div className="space-y-1 mt-1">
                      {selectedTest1 && (
                        <div className="flex items-center justify-between bg-primary/10 rounded-lg p-1.5">
                          <div className="flex-1 min-w-0">
                            <span className="text-xs font-medium text-primary">Test 1: {selectedTest1}</span>
                            <div className="text-xs text-muted-foreground mt-0.5">
                              {test1Details.min !== null && test1Details.max !== null 
                                ? `Range: ${test1Details.min} - ${test1Details.max} ${test1Details.unit}`
                                : 'No reference range'}
                            </div>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => clearTestSelection(1)}
                            className="h-4 w-4 p-0 ml-1"
                          >
                            <X className="w-2.5 h-2.5" />
                          </Button>
                        </div>
                      )}
                      {selectedTest2 && (
                        <div className="flex items-center justify-between bg-secondary/10 rounded-lg p-1.5">
                          <div className="flex-1 min-w-0">
                            <span className="text-xs font-medium text-secondary">Test 2: {selectedTest2}</span>
                            <div className="text-xs text-muted-foreground mt-0.5">
                              {test2Details.min !== null && test2Details.max !== null 
                                ? `Range: ${test2Details.min} - ${test2Details.max} ${test2Details.unit}`
                                : 'No reference range'}
                            </div>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => clearTestSelection(2)}
                            className="h-4 w-4 p-0 ml-1"
                          >
                            <X className="w-2.5 h-2.5" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Charts Content - More compact and scrollable */}
                  <div className="px-4 py-2 overflow-y-auto max-h-[35vh]">
                    {/* Charts */}
                    {selectedTest1 && chartData1.length > 0 && (
                      <div className="space-y-1.5 mb-3">
                        <h4 className="font-medium text-xs text-primary">{selectedTest1}</h4>
                        <div className="h-[120px] w-full bg-muted/20 rounded-lg p-2">
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
                        <div className="text-xs text-muted-foreground text-center">
                          {chartData1.length} data points
                        </div>
                      </div>
                    )}

                    {selectedTest2 && chartData2.length > 0 && (
                      <div className="space-y-1.5">
                        <h4 className="font-medium text-xs text-secondary">{selectedTest2}</h4>
                        <div className="h-[120px] w-full bg-muted/20 rounded-lg p-2">
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
                        <div className="text-xs text-muted-foreground text-center">
                          {chartData2.length} data points
                        </div>
                      </div>
                    )}

                    {/* Empty State */}
                    {!selectedTest1 && !selectedTest2 && (
                      <div className="h-[120px] w-full flex items-center justify-center border border-dashed rounded-lg">
                        <div className="text-center">
                          <BarChart3Icon className="w-5 h-5 text-muted-foreground mx-auto mb-1" />
                          <p className="text-muted-foreground text-xs">Select tests to view trends</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Desktop Layout */
          <div className="grid gap-6 lg:grid-cols-3 xl:gap-8 2xl:gap-10 analytics-grid">
            {/* Left Sidebar - Test List */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>{bloodTestCategories[selectedCategory as keyof typeof bloodTestCategories]}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 max-h-[600px] overflow-y-auto">
                  {isLoading ? (
                    <div className="text-center text-muted-foreground py-8">Loading...</div>
                  ) : filteredTests.length === 0 ? (
                    <div className="text-center text-muted-foreground py-8">No tests in this category</div>
                  ) : (
                    filteredTests.map((test) => (
                      <DesktopTestCard
                        key={test.id}
                        test={test}
                        isSelected={selectedTest1 === test.test_name || selectedTest2 === test.test_name}
                        onClick={() => handleTestClick(test.test_name)}
                      />
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
                <CardContent className="space-y-8 p-6 xl:p-8 2xl:p-10">
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
                            <X className="w-4 h-4" />
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
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Charts */}
                  {selectedTest1 && chartData1.length > 0 && (
                    <div className="space-y-4 mb-16 xl:mb-20 2xl:mb-24">
                      <h4 className="font-medium text-sm">{selectedTest1}</h4>
                      <div className="h-[280px] w-full xl:h-[320px] 2xl:h-[360px] analytics-chart-container chart-responsive-container">
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
                      <div className="text-xs text-muted-foreground pt-8 pb-4 xl:pt-10 xl:pb-6 2xl:pt-12 2xl:pb-8 chart-reference-info analytics-reference-text">
                        Reference Range: {test1Details.min !== null && test1Details.max !== null 
                          ? `${test1Details.min} - ${test1Details.max} ${test1Details.unit}`
                          : 'No reference range available'} | {chartData1.length} data points
                      </div>
                    </div>
                  )}

                  {selectedTest2 && chartData2.length > 0 && (
                    <div className="space-y-4">
                      <h4 className="font-medium text-sm">{selectedTest2}</h4>
                      <div className="h-[280px] w-full xl:h-[320px] 2xl:h-[360px] analytics-chart-container chart-responsive-container">
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
                      <div className="text-xs text-muted-foreground pt-8 pb-4 xl:pt-10 xl:pb-6 2xl:pt-12 2xl:pb-8 chart-reference-info analytics-reference-text">
                        Reference Range: {test2Details.min !== null && test2Details.max !== null 
                          ? `${test2Details.min} - ${test2Details.max} ${test2Details.unit}`
                          : 'No reference range available'} | {chartData2.length} data points
                      </div>
                    </div>
                  )}

                  {/* Empty State */}
                  {!selectedTest1 && !selectedTest2 && (
                    <div className="h-[400px] w-full xl:h-[450px] 2xl:h-[500px] flex items-center justify-center border border-dashed rounded-lg">
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
        )}
      </div>
    </div>
  );
};

export default Analytics;
