import { useMemo } from 'react';
import { format } from 'date-fns';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
  notes?: string | null;
}

type BloodTestsByDateProps = {
  bloodTestResults: BloodTest[];
};

const BloodTestsByDate = ({ bloodTestResults }: BloodTestsByDateProps) => {
  // Group tests by date
  const testsByDate = useMemo(() => {
    // First, deduplicate the results by test_name within each date
    // This ensures only one instance of each test type appears per date
    const deduplicated: Record<string, Record<string, BloodTest>> = {};
    
    // Group by date, then by test name (keeping only most recent entry)
    bloodTestResults.forEach(test => {
      const date = test.test_date;
      
      if (!deduplicated[date]) {
        deduplicated[date] = {};
      }
      
      // Only store if we don't have this test yet or if this one is more recent
      if (!deduplicated[date][test.test_name] || 
          new Date(test.id) > new Date(deduplicated[date][test.test_name].id)) {
        deduplicated[date][test.test_name] = test;
      }
    });
    
    // Convert the nested objects back to the format expected by the component
    const grouped: Record<string, BloodTest[]> = {};
    Object.entries(deduplicated).forEach(([date, tests]) => {
      grouped[date] = Object.values(tests);
    });
    
    // Sort dates in descending order (newest first)
    return Object.entries(grouped)
      .sort(([dateA], [dateB]) => new Date(dateB).getTime() - new Date(dateA).getTime())
      .map(([date, tests]) => ({
        date,
        formattedDate: format(new Date(date), 'MMMM d, yyyy'),
        tests: tests.sort((a, b) => a.test_name.localeCompare(b.test_name))
      }));
  }, [bloodTestResults]);
  
  const getCellColor = (value: number, min: number | null, max: number | null) => {
    if (min === null || max === null) return "";
    if (value < min) return "text-amber-500";
    if (value > max) return "text-rose-500";
    return "text-emerald-500";
  };
  
  return (
    <Card className="border border-border/50 bg-card/90 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Tests by Date</CardTitle>
      </CardHeader>
      <CardContent>
        {testsByDate.length > 0 ? (
          <Accordion type="multiple" className="w-full">
            {testsByDate.map(({ date, formattedDate, tests }) => (
              <AccordionItem key={date} value={date}>
                <AccordionTrigger className="hover:bg-muted/50 px-4 py-3 rounded-md">
                  <div className="flex justify-between items-center w-full pr-2">
                    <span className="font-medium">{formattedDate}</span>
                    <span className="text-sm text-muted-foreground">{tests.length} tests</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-2 pb-3">
                  <div className="bg-muted/30 rounded-md p-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {tests.map((test) => (
                        <div 
                          key={`${date}-${test.id}`} 
                          className="p-3 border border-border/30 rounded-md bg-background/70"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">{test.test_name}</h4>
                              <p className="text-xs text-muted-foreground">{test.category}</p>
                            </div>
                            <div className="text-right">
                              <p className={`font-bold ${getCellColor(test.result, test.reference_min, test.reference_max)}`}>
                                {test.result} {test.unit || ''}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {test.reference_min !== null && test.reference_max !== null 
                                  ? `Ref: ${test.reference_min} - ${test.reference_max} ${test.unit || ''}`
                                  : 'No reference range'}
                              </p>
                            </div>
                          </div>
                          {test.status && (
                            <div className={`text-xs font-medium mt-2 ${getCellColor(test.result, test.reference_min, test.reference_max)}`}>
                              Status: {test.status}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    {tests[0]?.notes && (
                      <div className="mt-4 p-3 border border-border/30 rounded-md bg-muted/50">
                        <h4 className="text-sm font-medium mb-1">Notes</h4>
                        <p className="text-sm whitespace-pre-wrap">{tests[0].notes}</p>
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No blood test results available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BloodTestsByDate;
