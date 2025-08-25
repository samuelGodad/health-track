import { useMemo, useState } from 'react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Trash2 } from 'lucide-react';
import { useAuth } from '@/providers/SupabaseAuthProvider';
import { Loader2 } from 'lucide-react';
import { EditIcon } from 'lucide-react';

type BloodTestResult = Database['public']['Tables']['blood_test_results']['Row'];

interface BloodTest extends Omit<BloodTestResult, 'created_at' | 'user_id' | 'processed_by_ai' | 'source_file_path' | 'source_file_type' | 'source_file_url'> {
  unit?: string;
  displayName?: string;
  originalName?: string;
  standardized?: boolean;
  confidence_score?: number;
  units?: string;
  // Additional fields from backend processing
  test?: string; // Standardized test name from CSV
  original_test_name?: string; // Original extracted name
}

type BloodTestsByDateProps = {
  bloodTestResults: BloodTest[];
  onDataUpdate?: () => void;
};

// Utility function to normalize dates to YYYY-MM-DD format
const normalizeDate = (dateString: string): string => {
  try {
    // Try to parse the date string and format it consistently
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      // If parsing fails, try to extract date parts manually
      const parts = dateString.split(/[-/]/);
      if (parts.length >= 3) {
        const year = parts[0].padStart(4, '20'); // Assume 20xx if year is short
        const month = parts[1].padStart(2, '0');
        const day = parts[2].padStart(2, '0');
        return `${year}-${month}-${day}`;
      }
    }
    return date.toISOString().split('T')[0];
  } catch (error) {
    console.warn('Failed to normalize date:', dateString, error);
    return dateString; // Return original if all parsing fails
  }
};    

const BloodTestsByDate = ({ bloodTestResults, onDataUpdate }: BloodTestsByDateProps) => {
  const { user } = useAuth();
  const [expandedDates, setExpandedDates] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
   
  const testsByDate = useMemo(() => {
    console.log('🔍 BloodTestsByDate: Processing', bloodTestResults.length, 'test results');
    
    const deduplicated: Record<string, Record<string, BloodTest>> = {};
    
    bloodTestResults.forEach(test => {
      // Normalize the date to ensure consistent grouping
      const normalizedDate = normalizeDate(test.test_date);
      
      // Use standardized name if available, otherwise use original test name
      const testNameToUse = test.test || test.test_name;
      
      if (!deduplicated[normalizedDate]) {
        deduplicated[normalizedDate] = {};
      }
      
      // Use the actual test name for grouping (no normalization)
      const testWithDisplayInfo = {
        ...test,
        displayName: testNameToUse, // Use standardized name if available
        originalName: test.original_test_name || test.test_name // Keep original name for reference
      };
      
      // If we already have a test with this name on this date, keep the newer one
      if (!deduplicated[normalizedDate][testNameToUse] || 
          new Date(test.id) > new Date(deduplicated[normalizedDate][testNameToUse].id)) {
        deduplicated[normalizedDate][testNameToUse] = testWithDisplayInfo;
      }
    });
    
    const grouped: Record<string, BloodTest[]> = {};
    Object.entries(deduplicated).forEach(([date, tests]) => {
      grouped[date] = Object.values(tests);
    });
    
    const result = Object.entries(grouped)
      .sort(([dateA], [dateB]) => new Date(dateB).getTime() - new Date(dateA).getTime())
      .map(([date, tests]) => ({
        date,
        formattedDate: format(new Date(date), 'MMMM d, yyyy'),
        tests: tests.sort((a, b) => (a.displayName || a.test_name).localeCompare(b.displayName || b.test_name))
      }));
    
    console.log('🔍 BloodTestsByDate: Final grouped result:', result.map(r => ({ date: r.date, count: r.tests.length })));
    console.log('🔍 BloodTestsByDate: Total tests after grouping:', result.reduce((sum, r) => sum + r.tests.length, 0));
    
    return result;
  }, [bloodTestResults]);
  
  const getCellColor = (value: number, min: number | null, max: number | null) => {
    if (min === null || max === null) return "";
    if (value < min) return "text-amber-500";
    if (value > max) return "text-rose-500";
    return "text-emerald-500";
  };

  const getStatusColor = (status: string | null) => {
    if (!status) return "";
    switch(status.toLowerCase()) {
      case 'high':
        return "text-rose-500";
      case 'low':
        return "text-amber-500";
      case 'normal':
      default:
        return "text-emerald-500";
    }
  };

  const handleDeleteTest = async (testId: string) => {
    if (!user) {
      toast.error('You must be logged in to delete tests');
      return;
    }

    try {
      setIsDeleting(testId);
      
      const { error } = await supabase
        .from('blood_test_results')
        .delete()
        .eq('id', testId)
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      toast.success('Test deleted successfully');
      
      if (onDataUpdate) {
        onDataUpdate();
      }
    } catch (error) {
      console.error('Error deleting test:', error);
      toast.error('Failed to delete test');
    } finally {
      setIsDeleting(null);
    }
  };

  const toggleDateExpansion = (date: string) => {
    setExpandedDates(prev => 
      prev.includes(date) 
        ? prev.filter(d => d !== date) 
        : [...prev, date]
    );
  };
  
  return (
    <Card className="border border-border/50 bg-card/90 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Tests by Date</CardTitle>
      </CardHeader>
      <CardContent>
        {testsByDate.length > 0 ? (
          <Accordion type="multiple" className="w-full" value={expandedDates} onValueChange={setExpandedDates}>
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
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <div className="flex flex-col gap-1">
                                  <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                      <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="h-6 w-6 opacity-60 hover:opacity-100 hover:bg-red-100 hover:text-red-600 text-muted-foreground" 
                                        aria-label="Delete test"
                                      >
                                        <Trash2 className="h-3.5 w-3.5" />
                                      </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>Delete Test Result</AlertDialogTitle>
                                        <AlertDialogDescription>
                                          Are you sure you want to delete the {test.displayName || test.test_name} test result from {formattedDate}? This action cannot be undone.
                                        </AlertDialogDescription>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction 
                                          className="bg-red-500 hover:bg-red-600"
                                          onClick={() => handleDeleteTest(test.id)}
                                          disabled={isDeleting === test.id}
                                        >
                                          {isDeleting === test.id ? (
                                            <>
                                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                              Deleting...
                                            </>
                                          ) : (
                                            'Delete'
                                          )}
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>
                                  </AlertDialog>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 opacity-60 hover:opacity-100 hover:bg-blue-100 hover:text-blue-600 text-muted-foreground"
                                    aria-label="Edit test"
                                  >
                                    <EditIcon className="h-3.5 w-3.5" />
                                  </Button>
                                </div>
                                <div className="flex flex-col gap-1">
                                  <h4 className="font-medium">{test.displayName || test.test_name}</h4>
                                  {test.standardized && test.originalName && test.originalName !== test.displayName && (
                                    <div className="text-xs text-muted-foreground">
                                      <span className="text-green-600">✓ Standardized</span>
                                      <span className="ml-1">from "{test.originalName}"</span>
                                      {test.confidence_score && (
                                        <span className="ml-1 text-blue-600">({test.confidence_score}% match)</span>
                                      )}
                                    </div>
                                  )}
                                  <div className="text-sm text-muted-foreground">
                                    {test.category} • {test.result}
                                    {test.units && ` ${test.units}`}
                                    {test.reference_min !== null && test.reference_max !== null && (
                                      <span className="ml-2">
                                        (Ref: {test.reference_min}-{test.reference_max})
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="text-right pl-4 flex flex-col items-end">
                              <p className={`font-bold ${getCellColor(test.result, test.reference_min, test.reference_max)}`}>
                                {test.result} {test.unit || ''}
                              </p>
                              <p className="text-xs text-muted-foreground whitespace-nowrap">
                                {(() => {
                                  if (test.reference_min === null && typeof test.reference_max === 'number') {
                                    return `Ref: 0 - ${test.reference_max} ${test.unit || ''}`;
                                  } else if (typeof test.reference_min === 'number' && test.reference_max === null) {
                                    return `Ref: ${test.reference_min}+ ${test.unit || ''}`;
                                  } else if (typeof test.reference_min === 'number' && typeof test.reference_max === 'number') {
                                    return `Ref: ${test.reference_min} - ${test.reference_max} ${test.unit || ''}`;
                                  } else {
                                    return 'No reference range';
                                  }
                                })()}
                              </p>
                            </div>
                          </div>
                          {test.status && (
                            <div className={`text-xs font-medium mt-2 ${getStatusColor(test.status)}`}>
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
