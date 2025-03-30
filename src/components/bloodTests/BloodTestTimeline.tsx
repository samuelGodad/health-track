import { useState, useMemo } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LineChart } from '@/components/ui/line-chart';

interface BloodTest {
  id: string;
  test_name: string;
  test_date: string;
  result: number;
  unit?: string;
  reference_min?: number | null;
  reference_max?: number | null;
  status?: string;
  category: string;
}

type TimelineProps = {
  bloodTestResults: BloodTest[];
};

const BloodTestTimeline = ({ bloodTestResults }: TimelineProps) => {
  const [selectedTest, setSelectedTest] = useState<string | null>(null);
  
  // Extract unique test names from results
  const testNames = useMemo(() => {
    const names = new Set<string>();
    bloodTestResults.forEach(test => names.add(test.test_name));
    return Array.from(names).sort();
  }, [bloodTestResults]);
  
  // Format data for timeline chart with deduplication
  const timelineData = useMemo(() => {
    if (!selectedTest) return [];
    
    // Get all tests of the selected type
    const relevantTests = bloodTestResults
      .filter(test => test.test_name === selectedTest);
    
    // Deduplicate by date - only keep the most recent result for each day
    const deduplicated = new Map<string, BloodTest>();
    relevantTests.forEach(test => {
      const existingTest = deduplicated.get(test.test_date);
      if (!existingTest || new Date(test.id) > new Date(existingTest.id)) {
        deduplicated.set(test.test_date, test);
      }
    });
    
    // Convert to array and sort by date
    return Array.from(deduplicated.values())
      .sort((a, b) => new Date(a.test_date).getTime() - new Date(b.test_date).getTime())
      .map(test => ({
        date: test.test_date,
        value: test.result
      }));
  }, [bloodTestResults, selectedTest]);
  
  // Get the unit and reference range for the selected test
  const testDetails = useMemo(() => {
    if (!selectedTest) return { unit: '', min: 0, max: 0 };
    
    const test = bloodTestResults.find(t => t.test_name === selectedTest);
    return {
      unit: test?.unit || '',
      min: test?.reference_min || 0,
      max: test?.reference_max || 0
    };
  }, [bloodTestResults, selectedTest]);
  
  return (
    <Card className="border border-border/50 bg-card/90 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Test Timeline Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Select
            value={selectedTest || ""}
            onValueChange={setSelectedTest}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a test to compare over time" />
            </SelectTrigger>
            <SelectContent>
              {testNames.map(name => (
                <SelectItem key={name} value={name}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {selectedTest ? (
          <>
            <div className="flex justify-between items-center mb-2">
              <div className="text-sm text-muted-foreground">
                Reference Range: {testDetails.min} - {testDetails.max} {testDetails.unit}
              </div>
              <div className="text-sm font-medium">
                {timelineData.length} data points
              </div>
            </div>
            
            {timelineData.length > 0 ? (
              <div className="h-64 w-full">
                <LineChart
                  title={`${selectedTest} (${testDetails.unit})`}
                  data={timelineData}
                  dataKey="value"
                  color="hsl(var(--primary))"
                  tooltipLabel={selectedTest}
                  valueFormatter={(value) => `${value} ${testDetails.unit}`}
                />
              </div>
            ) : (
              <div className="h-64 w-full flex items-center justify-center border border-dashed rounded-md">
                <p className="text-muted-foreground">No data available for this test</p>
              </div>
            )}
          </>
        ) : (
          <div className="h-64 w-full flex items-center justify-center border border-dashed rounded-md">
            <p className="text-muted-foreground">Select a test to view its timeline</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BloodTestTimeline;
