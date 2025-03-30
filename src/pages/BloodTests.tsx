
import { useState, useRef, useMemo, useEffect } from 'react';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import { LineChart } from '@/components/LineChart';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Toggle } from '@/components/ui/toggle';
import { 
  ChevronDownIcon,
  ChevronUpIcon,
  DownloadIcon,
  PlusIcon,
  UploadIcon,
  FileIcon,
  Loader2Icon,
  FileTextIcon,
  AlertCircleIcon
} from 'lucide-react';
import { useAuth } from "@/providers/SupabaseAuthProvider";
import { supabase } from "@/integrations/supabase/client";

const categories = [
  { value: 'cardiac', label: 'Cardiac' },
  { value: 'liver', label: 'Liver' },
  { value: 'kidney', label: 'Kidney' },
  { value: 'biochemistry', label: 'Biochemistry' },
  { value: 'hormone', label: 'Hormonal' },
  { value: 'hematology', label: 'Hematology' },
  { value: 'vitamin', label: 'Vitamins' },
  { value: 'others', label: 'Others' },
];

const mockTestResults = {
  cardiac: [
    { name: 'Cholesterol (Total)', unit: 'mg/dL', reference: { min: 0, max: 200 }, results: [
      { date: '2023-01-15', value: 185 },
      { date: '2023-03-15', value: 178 },
      { date: '2023-05-15', value: 192 },
    ]},
    { name: 'HDL', unit: 'mg/dL', reference: { min: 40, max: 60 }, results: [
      { date: '2023-01-15', value: 45 },
      { date: '2023-03-15', value: 48 },
      { date: '2023-05-15', value: 52 },
    ]},
    { name: 'LDL', unit: 'mg/dL', reference: { min: 0, max: 100 }, results: [
      { date: '2023-01-15', value: 130 },
      { date: '2023-03-15', value: 118 },
      { date: '2023-05-15', value: 110 },
    ]},
    { name: 'Triglycerides', unit: 'mg/dL', reference: { min: 0, max: 150 }, results: [
      { date: '2023-01-15', value: 120 },
      { date: '2023-03-15', value: 115 },
      { date: '2023-05-15', value: 105 },
    ]},
  ],
  liver: [
    { name: 'ALT', unit: 'U/L', reference: { min: 0, max: 40 }, results: [
      { date: '2023-01-15', value: 25 },
      { date: '2023-03-15', value: 28 },
      { date: '2023-05-15', value: 22 },
    ]},
    { name: 'AST', unit: 'U/L', reference: { min: 0, max: 40 }, results: [
      { date: '2023-01-15', value: 22 },
      { date: '2023-03-15', value: 24 },
      { date: '2023-05-15', value: 20 },
    ]},
    { name: 'Bilirubin', unit: 'mg/dL', reference: { min: 0, max: 1.2 }, results: [
      { date: '2023-01-15', value: 0.8 },
      { date: '2023-03-15', value: 0.7 },
      { date: '2023-05-15', value: 0.9 },
    ]},
  ],
  hormonal: [
    { name: 'Testosterone', unit: 'ng/mL', reference: { min: 2.5, max: 8.0 }, results: [
      { date: '2023-01-15', value: 4.2 },
      { date: '2023-03-15', value: 4.4 },
      { date: '2023-05-15', value: 4.7 },
    ]},
    { name: 'Estradiol', unit: 'pg/mL', reference: { min: 10, max: 40 }, results: [
      { date: '2023-01-15', value: 22 },
      { date: '2023-03-15', value: 24 },
      { date: '2023-05-15', value: 25 },
    ]},
    { name: 'TSH', unit: 'mIU/L', reference: { min: 0.4, max: 4.0 }, results: [
      { date: '2023-01-15', value: 1.8 },
      { date: '2023-03-15', value: 1.9 },
      { date: '2023-05-15', value: 2.1 },
    ]},
  ],
  kidney: [
    { name: 'Creatinine', unit: 'mg/dL', reference: { min: 0.6, max: 1.2 }, results: [
      { date: '2023-01-15', value: 0.9 },
      { date: '2023-03-15', value: 0.85 },
      { date: '2023-05-15', value: 0.88 },
    ]},
    { name: 'BUN', unit: 'mg/dL', reference: { min: 7, max: 20 }, results: [
      { date: '2023-01-15', value: 15 },
      { date: '2023-03-15', value: 14 },
      { date: '2023-05-15', value: 16 },
    ]},
    { name: 'eGFR', unit: 'mL/min', reference: { min: 90, max: 120 }, results: [
      { date: '2023-01-15', value: 98 },
      { date: '2023-03-15', value: 100 },
      { date: '2023-05-15', value: 97 },
    ]},
  ],
  others: [
    { name: 'Glucose', unit: 'mg/dL', reference: { min: 70, max: 100 }, results: [
      { date: '2023-01-15', value: 92 },
      { date: '2023-03-15', value: 88 },
      { date: '2023-05-15', value: 94 },
    ]},
    { name: 'Hemoglobin', unit: 'g/dL', reference: { min: 13.5, max: 17.5 }, results: [
      { date: '2023-01-15', value: 15.2 },
      { date: '2023-03-15', value: 15.0 },
      { date: '2023-05-15', value: 15.3 },
    ]},
    { name: 'Vitamin D', unit: 'ng/mL', reference: { min: 30, max: 100 }, results: [
      { date: '2023-01-15', value: 28 },
      { date: '2023-03-15', value: 35 },
      { date: '2023-05-15', value: 42 },
    ]},
  ],
};

const mockTestHistory = [
  {
    date: '2023-06-15',
    name: 'Testosterone',
    value: 4.9,
    unit: 'ng/mL',
    reference: { min: 2.5, max: 8.0 }
  },
  {
    date: '2023-06-15',
    name: 'Estradiol',
    value: 23,
    unit: 'pg/mL',
    reference: { min: 10, max: 40 }
  },
  {
    date: '2023-06-15',
    name: 'HDL',
    value: 54,
    unit: 'mg/dL',
    reference: { min: 40, max: 60 }
  },
  {
    date: '2023-06-15',
    name: 'LDL',
    value: 108,
    unit: 'mg/dL',
    reference: { min: 0, max: 100 }
  },
  {
    date: '2023-05-15',
    name: 'Testosterone',
    value: 4.7,
    unit: 'ng/mL',
    reference: { min: 2.5, max: 8.0 }
  },
  {
    date: '2023-05-15',
    name: 'Estradiol',
    value: 25,
    unit: 'pg/mL',
    reference: { min: 10, max: 40 }
  },
];

const TestHistoryCard = ({ record }: { record: any }) => {
  const [expanded, setExpanded] = useState(false);
  
  const isNormal = record.value >= record.reference.min && record.value <= record.reference.max;
  const isLow = record.value < record.reference.min;
  const isHigh = record.value > record.reference.max;
  
  const statusColor = isNormal 
    ? "text-emerald-500" 
    : isLow 
      ? "text-amber-500" 
      : "text-rose-500";
  
  const statusText = isNormal 
    ? "Normal" 
    : isLow 
      ? "Low" 
      : "High";
  
  return (
    <div className="border border-border/50 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-md">
      <div 
        className="p-4 flex justify-between items-center cursor-pointer bg-card/90 backdrop-blur-sm"
        onClick={() => setExpanded(!expanded)}
      >
        <div>
          <div className="font-medium">{record.name}</div>
          <div className="text-sm text-muted-foreground">{record.date}</div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="font-bold">{record.value}</span>
            <span className="text-sm text-muted-foreground ml-1">{record.unit}</span>
          </div>
          <div className={`text-sm font-medium ${statusColor}`}>
            {statusText}
          </div>
          {expanded 
            ? <ChevronUpIcon className="h-5 w-5 text-muted-foreground" /> 
            : <ChevronDownIcon className="h-5 w-5 text-muted-foreground" />
          }
        </div>
      </div>
      
      {expanded && (
        <div className="p-4 bg-muted/30 border-t border-border/40">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-muted-foreground">Reference Range</div>
              <div className="font-medium">
                {record.reference.min} - {record.reference.max} {record.unit}
              </div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Status</div>
              <div className={`font-medium ${statusColor}`}>
                {statusText}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const BloodTests = () => {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('cardiac');
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [bloodTestResults, setBloodTestResults] = useState<any>(mockTestResults);
  const [recentResults, setRecentResults] = useState<any[]>([]);
  const [showAIProcessing, setShowAIProcessing] = useState(false);

  useEffect(() => {
    if (user) {
      fetchBloodTestResults();
      fetchRecentResults();
    }
  }, [user]);

  const fetchBloodTestResults = async () => {
    try {
      const { data, error } = await supabase
        .from('blood_test_results')
        .select('*')
        .eq('user_id', user?.id)
        .order('test_date', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      if (data && data.length > 0) {
        console.log('Blood test results fetched:', data);
        // Process data to match our expected format if needed
        // For now, we'll continue using mock data until we format the real data
      }
    } catch (error) {
      console.error('Error fetching blood test results:', error);
      toast.error('Failed to fetch blood test results');
    }
  };

  const fetchRecentResults = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('blood_test_results')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);
        
      if (error) throw error;
      
      if (data) {
        setRecentResults(data);
      }
    } catch (error) {
      console.error('Error fetching recent results:', error);
    }
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const filesArray = Array.from(files);
      // Filter to only accept PDFs
      const pdfFiles = filesArray.filter(file => 
        file.type === 'application/pdf' || 
        file.name.toLowerCase().endsWith('.pdf')
      );
      
      if (pdfFiles.length !== filesArray.length) {
        toast.warning('Only PDF files are accepted for blood test results');
      }
      
      if (pdfFiles.length > 0) {
        setSelectedFiles(pdfFiles);
        setShowAIProcessing(true);
        toast.success(`${pdfFiles.length} PDF file(s) selected`);
      }
    }
  };

  const uploadFiles = async () => {
    if (!user) {
      toast.error('You must be logged in to upload files');
      return;
    }
    
    if (selectedFiles.length === 0) {
      toast.error('Please select PDF files to upload');
      return;
    }
    
    setIsUploading(true);
    
    try {
      const uploadPromises = selectedFiles.map(async (file) => {
        const timestamp = new Date().getTime();
        const filePath = `${user.id}/${timestamp}-${file.name}`;
        
        const { data, error } = await supabase.storage
          .from('blood-test-pdfs')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: true
          });
        
        if (error) throw error;
        
        const { data: publicUrlData } = supabase.storage
          .from('blood-test-pdfs')
          .getPublicUrl(filePath);
          
        return {
          name: file.name,
          url: publicUrlData.publicUrl,
          path: filePath
        };
      });
      
      const uploadedFiles = await Promise.all(uploadPromises);
      
      toast.success(`Successfully uploaded ${uploadedFiles.length} file(s)`);
      
      if (showAIProcessing) {
        await processFilesWithAI(uploadedFiles);
      } else {
        setSelectedFiles([]);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
      
      // Refresh the results list
      fetchRecentResults();
      
    } catch (error) {
      console.error('Error uploading files:', error);
      toast.error('Failed to upload files. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const processFilesWithAI = async (files: Array<{name: string, url: string, path: string}>) => {
    if (!user || files.length === 0) return;
    
    setIsProcessing(true);
    const processingToast = toast.loading('Processing blood test PDFs with AI...');
    
    try {
      const processingPromises = files.map(async (file) => {
        const { data, error } = await supabase.functions.invoke('process-blood-test-pdf', {
          body: {
            pdfUrl: file.url,
            fileId: file.path,
            userId: user.id
          }
        });
        
        if (error) throw error;
        
        return data;
      });
      
      const results = await Promise.all(processingPromises);
      const totalProcessed = results.reduce((sum, result) => sum + (result.resultsCount || 0), 0);
      
      toast.dismiss(processingToast);
      toast.success(`AI successfully extracted ${totalProcessed} test results from your PDFs`);
      
      // Refresh the data
      fetchBloodTestResults();
      fetchRecentResults();
      
    } catch (error) {
      console.error('Error processing files with AI:', error);
      toast.dismiss(processingToast);
      toast.error('Error processing blood test PDFs. Please try manual entry instead.');
    } finally {
      setIsProcessing(false);
      setSelectedFiles([]);
      setShowAIProcessing(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const testDates = useMemo(() => {
    const dates = new Set<string>();
    mockTestResults[selectedCategory as keyof typeof mockTestResults].forEach(test => {
      test.results.forEach(result => dates.add(result.date));
    });
    return Array.from(dates).sort();
  }, [selectedCategory]);

  const getChartData = (testName: string) => {
    const test = mockTestResults[selectedCategory as keyof typeof mockTestResults].find(t => t.name === testName);
    return test ? test.results.map(r => ({ date: r.date, value: r.value })) : [];
  };

  const getCellColor = (value: number, min: number, max: number) => {
    if (value < min) return "text-amber-500";
    if (value > max) return "text-rose-500";
    return "text-emerald-500";
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16 px-4 md:px-6 max-w-screen-xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Blood Test Results</h1>
            <p className="text-muted-foreground">Track and monitor your blood test results over time</p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <Button variant="outline" className="flex items-center gap-2">
              <DownloadIcon className="h-4 w-4" />
              <span>Export Data</span>
            </Button>
            <Button className="flex items-center gap-2" onClick={handleUploadClick}>
              <UploadIcon className="h-4 w-4" />
              <span>Upload Test Results</span>
            </Button>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept=".pdf" 
              className="hidden"
              multiple
            />
          </div>
        </div>
        
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Test Results by Category</h2>
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Test results table */}
          <Card className="border border-border/50 bg-card/90 backdrop-blur-sm mb-8">
            <CardHeader>
              <CardTitle>{categories.find(c => c.value === selectedCategory)?.label} Test Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[200px]">Test Name</TableHead>
                      <TableHead className="w-[100px]">Reference Range</TableHead>
                      {testDates.map(date => (
                        <TableHead key={date} className="text-center">
                          {new Date(date).toLocaleDateString()}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockTestResults[selectedCategory as keyof typeof mockTestResults].map((test) => (
                      <TableRow key={test.name}>
                        <TableCell className="font-medium">{test.name}</TableCell>
                        <TableCell>
                          {test.reference.min}-{test.reference.max} {test.unit}
                        </TableCell>
                        {testDates.map(date => {
                          const result = test.results.find(r => r.date === date);
                          return (
                            <TableCell key={date} className="text-center">
                              {result ? (
                                <span className={getCellColor(result.value, test.reference.min, test.reference.max)}>
                                  {result.value}
                                </span>
                              ) : "-"}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
          
          {/* Trend charts */}
          <h2 className="text-xl font-semibold mb-4">Trend Analysis</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mockTestResults[selectedCategory as keyof typeof mockTestResults].map((test) => (
              <LineChart 
                key={test.name}
                title={`${test.name} (${test.unit})`}
                data={getChartData(test.name)}
                dataKey="value"
                color="hsl(var(--primary))"
                tooltipLabel={test.name}
                valueFormatter={(value) => `${value} ${test.unit}`}
              />
            ))}
          </div>
        </div>
        
        {/* Upload section with AI processing feature */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Upload New Results</h2>
          <Card className="border border-border/50 bg-card/90 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <Button 
                    className="flex-1" 
                    onClick={handleUploadClick}
                    disabled={isUploading || isProcessing}
                  >
                    <UploadIcon className="h-4 w-4 mr-2" />
                    <span>{isUploading ? "Uploading..." : "Upload Test Results PDF"}</span>
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <PlusIcon className="h-4 w-4 mr-2" />
                    <span>Manual Entry</span>
                  </Button>
                </div>
                
                {selectedFiles.length > 0 && (
                  <div className="mt-2 space-y-2">
                    {selectedFiles.map((file, index) => (
                      <div key={index} className="p-3 bg-muted rounded-md flex items-center justify-between">
                        <div className="flex items-center">
                          <FileTextIcon className="h-4 w-4 mr-2" />
                          <p className="text-sm">{file.name}</p>
                        </div>
                        <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
                      </div>
                    ))}
                    
                    {showAIProcessing && (
                      <div className="p-3 bg-blue-50 border border-blue-100 text-blue-700 rounded-md flex items-center gap-2">
                        <div className="text-blue-600">
                          <AlertCircleIcon className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">AI Processing Available</p>
                          <p className="text-xs">Your PDF will be analyzed to automatically extract test results</p>
                        </div>
                      </div>
                    )}
                    
                    <div className="pt-2 flex items-center gap-2">
                      <Toggle
                        variant="outline"
                        aria-label="Enable AI processing"
                        pressed={showAIProcessing}
                        onPressedChange={setShowAIProcessing}
                        className="data-[state=on]:bg-blue-50 data-[state=on]:text-blue-700 data-[state=on]:border-blue-200"
                      >
                        Use AI to extract results
                      </Toggle>
                    </div>
                    
                    <Button 
                      onClick={uploadFiles}
                      disabled={isUploading || isProcessing}
                      className="w-full mt-2"
                    >
                      {isUploading ? (
                        <>
                          <Loader2Icon className="h-4 w-4 mr-2 animate-spin" />
                          Uploading...
                        </>
                      ) : isProcessing ? (
                        <>
                          <Loader2Icon className="h-4 w-4 mr-2 animate-spin" />
                          Processing with AI...
                        </>
                      ) : (
                        `Upload ${selectedFiles.length} File(s)${showAIProcessing ? ' & Process with AI' : ''}`
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Recent results */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Recent Test Results</h2>
          <div className="space-y-4">
            {recentResults.length > 0 ? (
              recentResults.map((result, index) => (
                <TestHistoryCard key={index} record={{
                  date: new Date(result.test_date).toLocaleDateString(),
                  name: result.test_name,
                  value: result.result,
                  unit: result.unit || '',
                  reference: { 
                    min: result.reference_min || 0, 
                    max: result.reference_max || 100 
                  }
                }} />
              ))
            ) : (
              <Card className="p-6 text-center">
                <p className="text-muted-foreground">No recent test results available.</p>
                <p className="text-sm">Upload your blood test PDFs to get started.</p>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default BloodTests;
