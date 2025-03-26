import { useState, useRef, useMemo } from 'react';
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
import { 
  ChevronDownIcon,
  ChevronUpIcon,
  DownloadIcon,
  PlusIcon,
  UploadIcon
} from 'lucide-react';

const categories = [
  { value: 'cardiac', label: 'Cardiac' },
  { value: 'liver', label: 'Liver' },
  { value: 'kidney', label: 'Kidney' },
  { value: 'hormonal', label: 'Hormonal' },
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('cardiac');

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
      toast.success(`File "${files[0].name}" selected`);
      // In a real app, you would handle the upload to a server here
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
              accept=".pdf,.jpg,.jpeg,.png" 
              className="hidden" 
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
        
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Upload New Results</h2>
          <Card className="border border-border/50 bg-card/90 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <Button className="flex-1" onClick={handleUploadClick}>
                  <UploadIcon className="h-4 w-4 mr-2" />
                  <span>Upload Test Results PDF</span>
                </Button>
                <Button variant="outline" className="flex-1">
                  <PlusIcon className="h-4 w-4 mr-2" />
                  <span>Manual Entry</span>
                </Button>
              </div>
              {selectedFile && (
                <div className="mt-4 p-3 bg-muted rounded-md">
                  <p className="text-sm">Selected: {selectedFile.name}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default BloodTests;
