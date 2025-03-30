
import { useState } from 'react';
import { format } from 'date-fns';
import { CalendarIcon, EditIcon, SaveIcon, XIcon } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

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

type DateSpecificResultsProps = {
  bloodTestResults: BloodTest[];
  userId: string;
  onDataUpdate?: () => void;
};

const DateSpecificResults = ({ bloodTestResults, userId, onDataUpdate }: DateSpecificResultsProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [notes, setNotes] = useState<string>("");
  const [isEditingNotes, setIsEditingNotes] = useState<boolean>(false);
  const [isSavingNotes, setIsSavingNotes] = useState<boolean>(false);
  
  // Extract unique test dates from results
  const testDates = [...new Set(bloodTestResults.map(test => test.test_date))].sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );
  
  // Filter tests for the selected date
  const testsForSelectedDate = selectedDate 
    ? bloodTestResults.filter(test => {
        const testDate = new Date(test.test_date);
        return testDate.toISOString().split('T')[0] === selectedDate.toISOString().split('T')[0];
      })
    : [];
  
  // Group tests by category
  const testsByCategory = testsForSelectedDate.reduce((acc, test) => {
    const category = test.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(test);
    return acc;
  }, {} as Record<string, BloodTest[]>);
  
  // Load notes when a date is selected
  const loadNotes = async (date: Date) => {
    try {
      const formattedDate = format(date, 'yyyy-MM-dd');
      
      const { data, error } = await supabase
        .from('blood_test_results')
        .select('notes')
        .eq('user_id', userId)
        .eq('test_date', formattedDate)
        .limit(1);
      
      if (error) throw error;
      
      if (data && data.length > 0 && data[0].notes) {
        setNotes(data[0].notes);
      } else {
        setNotes('');
      }
    } catch (error) {
      console.error('Error loading notes:', error);
      setNotes('');
    }
  };
  
  // Save notes for all tests on this date
  const saveNotes = async () => {
    if (!selectedDate) return;
    
    try {
      setIsSavingNotes(true);
      const formattedDate = format(selectedDate, 'yyyy-MM-dd');
      
      const { error } = await supabase
        .from('blood_test_results')
        .update({ notes })
        .eq('user_id', userId)
        .eq('test_date', formattedDate);
      
      if (error) throw error;
      
      toast.success('Notes saved successfully');
      setIsEditingNotes(false);
      if (onDataUpdate) onDataUpdate();
    } catch (error) {
      console.error('Error saving notes:', error);
      toast.error('Failed to save notes');
    } finally {
      setIsSavingNotes(false);
    }
  };
  
  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      loadNotes(date);
    } else {
      setNotes('');
    }
    setIsEditingNotes(false);
  };
  
  const getCellColor = (value: number, min: number | null, max: number | null) => {
    if (min === null || max === null) return "";
    if (value < min) return "text-amber-500";
    if (value > max) return "text-rose-500";
    return "text-emerald-500";
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div>
          <h2 className="text-xl font-semibold mb-2">Results by Date</h2>
          <p className="text-muted-foreground">View all test results from a specific date</p>
        </div>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full sm:w-[240px] justify-start text-left">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {selectedDate ? format(selectedDate, 'MMM d, yyyy') : <span>Select date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              disabled={(date) => {
                // Only enable dates that have test results
                const formattedDate = format(date, 'yyyy-MM-dd');
                return !testDates.includes(formattedDate);
              }}
              initialFocus
              className="p-3 pointer-events-auto"
            />
          </PopoverContent>
        </Popover>

        <Select
          value={selectedDate ? format(selectedDate, 'yyyy-MM-dd') : ""}
          onValueChange={(value) => handleDateSelect(value ? new Date(value) : undefined)}
        >
          <SelectTrigger className="w-full sm:w-[240px]">
            <SelectValue placeholder="Select test date" />
          </SelectTrigger>
          <SelectContent>
            {testDates.map((date) => (
              <SelectItem key={date} value={date}>
                {format(new Date(date), 'MMM d, yyyy')}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {selectedDate ? (
        <>
          {Object.keys(testsByCategory).length > 0 ? (
            <div className="space-y-6">
              {Object.entries(testsByCategory).map(([category, tests]) => (
                <Card key={category} className="border border-border/50 bg-card/90 backdrop-blur-sm">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{category}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Test Name</TableHead>
                          <TableHead>Result</TableHead>
                          <TableHead>Reference Range</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {tests.map(test => (
                          <TableRow key={test.id}>
                            <TableCell className="font-medium">{test.test_name}</TableCell>
                            <TableCell>
                              <span className={getCellColor(test.result, test.reference_min, test.reference_max)}>
                                {test.result} {test.unit || ''}
                              </span>
                            </TableCell>
                            <TableCell>
                              {test.reference_min !== null && test.reference_max !== null 
                                ? `${test.reference_min} - ${test.reference_max} ${test.unit || ''}`
                                : 'Not available'}
                            </TableCell>
                            <TableCell>
                              <span className={getCellColor(test.result, test.reference_min, test.reference_max)}>
                                {test.reference_min !== null && test.reference_max !== null
                                  ? test.result < test.reference_min
                                    ? 'Low'
                                    : test.result > test.reference_max
                                      ? 'High'
                                      : 'Normal'
                                  : 'Unknown'}
                              </span>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              ))}
              
              <Card className="border border-border/50 bg-card/90 backdrop-blur-sm">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-lg">Notes</CardTitle>
                  {isEditingNotes ? (
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setIsEditingNotes(false);
                          loadNotes(selectedDate);
                        }}
                        disabled={isSavingNotes}
                      >
                        <XIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={saveNotes}
                        disabled={isSavingNotes}
                      >
                        {isSavingNotes ? (
                          <span className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Saving
                          </span>
                        ) : (
                          <SaveIcon className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsEditingNotes(true)}
                    >
                      <EditIcon className="h-4 w-4" />
                    </Button>
                  )}
                </CardHeader>
                <CardContent>
                  {isEditingNotes ? (
                    <Textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Add notes about these test results..."
                      className="min-h-[150px]"
                    />
                  ) : (
                    <div className="min-h-[150px] p-3 border rounded-md bg-muted/20">
                      {notes ? (
                        <p className="whitespace-pre-wrap">{notes}</p>
                      ) : (
                        <p className="text-muted-foreground italic">No notes available for this date. Click the edit button to add notes.</p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card className="border border-border/50 bg-card/90 backdrop-blur-sm p-6 text-center">
              <p className="text-muted-foreground">No test results found for {format(selectedDate, 'MMMM d, yyyy')}</p>
            </Card>
          )}
        </>
      ) : (
        <Card className="border border-border/50 bg-card/90 backdrop-blur-sm p-6 text-center">
          <p className="text-muted-foreground">Select a date to view test results</p>
        </Card>
      )}
    </div>
  );
};

export default DateSpecificResults;
