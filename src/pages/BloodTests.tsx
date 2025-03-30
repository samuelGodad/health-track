
import { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Toggle,
  FileIcon,
  Loader2Icon,
  FileTextIcon,
  AlertCircleIcon,
  UploadIcon,
  PlusIcon,
  DownloadIcon,
} from 'lucide-react';
import { useAuth } from "@/providers/SupabaseAuthProvider";
import { supabase } from "@/integrations/supabase/client";

// Import the new components
import BloodTestsByDate from '@/components/bloodTests/BloodTestsByDate';
import BloodTestTimeline from '@/components/bloodTests/BloodTestTimeline';
import DateSpecificResults from '@/components/bloodTests/DateSpecificResults';

const BloodTests = () => {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showAIProcessing, setShowAIProcessing] = useState(false);
  const [bloodTestResults, setBloodTestResults] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("by-date");

  useEffect(() => {
    if (user) {
      fetchBloodTestResults();
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
      
      if (data) {
        setBloodTestResults(data);
      }
    } catch (error) {
      console.error('Error fetching blood test results:', error);
      toast.error('Failed to fetch blood test results');
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
      fetchBloodTestResults();
      
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
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mb-8">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="by-date">By Date</TabsTrigger>
            <TabsTrigger value="date-specific">Date Specific</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
          </TabsList>
          
          <TabsContent value="by-date">
            <BloodTestsByDate bloodTestResults={bloodTestResults} />
          </TabsContent>
          
          <TabsContent value="date-specific">
            <DateSpecificResults 
              bloodTestResults={bloodTestResults} 
              userId={user?.id || ''}
              onDataUpdate={fetchBloodTestResults} 
            />
          </TabsContent>
          
          <TabsContent value="timeline">
            <BloodTestTimeline bloodTestResults={bloodTestResults} />
          </TabsContent>
        </Tabs>
        
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
      </main>
    </div>
  );
};

export default BloodTests;
