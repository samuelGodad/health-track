
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import { LineChart } from '@/components/LineChart';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ChevronDownIcon,
  ChevronUpIcon,
  DownloadIcon,
  PlusIcon,
  UploadIcon
} from 'lucide-react';

// Mock blood test data
const mockTestData = {
  testosterone: [
    { date: '2023-01-15', value: 4.2 },
    { date: '2023-02-15', value: 4.1 },
    { date: '2023-03-15', value: 4.4 },
    { date: '2023-04-15', value: 4.5 },
    { date: '2023-05-15', value: 4.7 },
    { date: '2023-06-15', value: 4.9 },
  ],
  estradiol: [
    { date: '2023-01-15', value: 22 },
    { date: '2023-02-15', value: 25 },
    { date: '2023-03-15', value: 24 },
    { date: '2023-04-15', value: 26 },
    { date: '2023-05-15', value: 25 },
    { date: '2023-06-15', value: 23 },
  ],
  ldl: [
    { date: '2023-01-15', value: 130 },
    { date: '2023-02-15', value: 125 },
    { date: '2023-03-15', value: 118 },
    { date: '2023-04-15', value: 115 },
    { date: '2023-05-15', value: 110 },
    { date: '2023-06-15', value: 108 },
  ],
  hdl: [
    { date: '2023-01-15', value: 45 },
    { date: '2023-02-15', value: 47 },
    { date: '2023-03-15', value: 48 },
    { date: '2023-04-15', value: 50 },
    { date: '2023-05-15', value: 52 },
    { date: '2023-06-15', value: 54 },
  ],
};

interface TestRecord {
  date: string;
  name: string;
  value: number;
  unit: string;
  reference: {
    min: number;
    max: number;
  };
}

// Mock test history
const mockTestHistory: TestRecord[] = [
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

const TestHistoryCard = ({ record }: { record: TestRecord }) => {
  const [expanded, setExpanded] = useState(false);
  
  // Determine if the value is within the reference range
  const isNormal = record.value >= record.reference.min && record.value <= record.reference.max;
  const isLow = record.value < record.reference.min;
  const isHigh = record.value > record.reference.max;
  
  // Set the status color
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
            <Button className="flex items-center gap-2">
              <UploadIcon className="h-4 w-4" />
              <span>Upload Test Results</span>
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-2 border border-border/50 bg-card/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Trend Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="testosterone">
                <TabsList className="mb-4">
                  <TabsTrigger value="testosterone">Testosterone</TabsTrigger>
                  <TabsTrigger value="estradiol">Estradiol</TabsTrigger>
                  <TabsTrigger value="lipids">Lipids</TabsTrigger>
                </TabsList>
                
                <TabsContent value="testosterone" className="mt-0">
                  <LineChart 
                    title="Testosterone (ng/mL)"
                    data={mockTestData.testosterone}
                    dataKey="value"
                    color="hsl(250, 60%, 60%)"
                    tooltipLabel="Testosterone"
                    valueFormatter={(value) => `${value} ng/mL`}
                  />
                </TabsContent>
                
                <TabsContent value="estradiol" className="mt-0">
                  <LineChart 
                    title="Estradiol (pg/mL)"
                    data={mockTestData.estradiol}
                    dataKey="value"
                    color="hsl(340, 60%, 60%)"
                    tooltipLabel="Estradiol"
                    valueFormatter={(value) => `${value} pg/mL`}
                  />
                </TabsContent>
                
                <TabsContent value="lipids" className="mt-0">
                  <div className="grid grid-cols-1 gap-4">
                    <LineChart 
                      title="HDL (mg/dL)"
                      data={mockTestData.hdl}
                      dataKey="value"
                      color="hsl(150, 60%, 50%)"
                      tooltipLabel="HDL"
                      valueFormatter={(value) => `${value} mg/dL`}
                    />
                    <LineChart 
                      title="LDL (mg/dL)"
                      data={mockTestData.ldl}
                      dataKey="value"
                      color="hsl(0, 70%, 60%)"
                      tooltipLabel="LDL"
                      valueFormatter={(value) => `${value} mg/dL`}
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          
          <Card className="border border-border/50 bg-card/90 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle>Add New Test</CardTitle>
              <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                <PlusIcon className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm mb-4">
                Manually add test results or upload lab documents
              </p>
              
              <Button className="w-full mb-4">Add Manual Entry</Button>
              <Button variant="outline" className="w-full">
                <UploadIcon className="h-4 w-4 mr-2" />
                <span>Upload Test PDF</span>
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Test History</h2>
          <div className="space-y-3">
            {mockTestHistory.map((record, index) => (
              <TestHistoryCard key={index} record={record} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default BloodTests;
