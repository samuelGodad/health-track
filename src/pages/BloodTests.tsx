import { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileIcon,
  Loader2Icon,
  FileTextIcon,
  AlertCircleIcon,
  UploadIcon,
  PlusIcon,
  DownloadIcon,
  InfoIcon,
  CheckCircleIcon
} from 'lucide-react';
import { useAuth } from "@/providers/SupabaseAuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { 
  Alert,
  AlertTitle,
  AlertDescription 
} from '@/components/ui/alert';
import { bloodTestService } from '@/services/bloodTestService';

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
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [successfullyProcessed, setSuccessfullyProcessed] = useState<string[]>([]);
  const [failedToProcess, setFailedToProcess] = useState<string[]>([]);
  const [duplicateFiles, setDuplicateFiles] = useState<string[]>([]);
  const [processingStatus, setProcessingStatus] = useState<Record<string, 'pending' | 'processing' | 'success' | 'error' | 'duplicate'>>({});

  useEffect(() => {
    if (user) {
      fetchBloodTestResults();
    }
  }, [user]);

  const fetchBloodTestResults = async () => {
    setIsLoading(true);
    try {
      // Use the bloodTestService which includes metadata fallback logic
      const results = await bloodTestService.getBloodTestResults();
      setBloodTestResults(results);
    } catch (error) {
      console.error('Error fetching blood test results:', error);
      toast.error('Failed to fetch blood test results');
    } finally {
      setIsLoading(false);
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
        setUploadError(null);
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
    setUploadError(null);
    
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
      
      // Always process files with AI after upload
      await processFilesWithAI(uploadedFiles);
      
      fetchBloodTestResults();
    } catch (error) {
      console.error('Error uploading files:', error);
      setUploadError('Failed to upload files. Please try again.');
      toast.error('Failed to upload files. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const processFilesWithAI = async (files: Array<{name: string, url: string, path: string}>) => {
    if (!files.length) {
      toast.error('Please select files to process');
      return;
    }

    setProcessing(true);
    setProcessingProgress(0);
    setSuccessfullyProcessed([]);
    setFailedToProcess([]);
    setDuplicateFiles([]);
    
    const initialStatus = files.reduce((acc, file) => {
      acc[file.name] = 'pending';
      return acc;
    }, {} as Record<string, 'pending' | 'processing' | 'success' | 'error' | 'duplicate'>);
    setProcessingStatus(initialStatus);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const progress = ((i + 1) / files.length) * 100;
        setProcessingProgress(progress);

        try {
          setProcessingStatus(prev => ({ ...prev, [file.name]: 'processing' }));

          const originalFile = selectedFiles.find(f => f.name === file.name);
          if (!originalFile) {
            throw new Error(`Original file not found for ${file.name}`);
          }

          const results = await bloodTestService.processBloodTestPDF(originalFile);
          if (results && results.length > 0) {
            setSuccessfullyProcessed(prev => [...prev, file.name]);
            setProcessingStatus(prev => ({ ...prev, [file.name]: 'success' }));
          } else {
            setFailedToProcess(prev => [...prev, file.name]);
            setProcessingStatus(prev => ({ ...prev, [file.name]: 'error' }));
          }
        } catch (error) {
          console.error(`Error processing file ${file.name}:`, error);
          if (error instanceof Error) {
            if (error.message === 'This PDF has already been processed and results exist') {
              setDuplicateFiles(prev => [...prev, file.name]);
              setProcessingStatus(prev => ({ ...prev, [file.name]: 'duplicate' }));
            } else {
              setFailedToProcess(prev => [...prev, file.name]);
              setProcessingStatus(prev => ({ ...prev, [file.name]: 'error' }));
              toast.error(`Failed to process ${file.name}: ${error.message}`);
            }
          }
        }
      }

      if (successfullyProcessed.length > 0) {
        toast.success(`Successfully processed ${successfullyProcessed.length} file(s)`);
      }
      if (duplicateFiles.length > 0) {
        toast.warning(`${duplicateFiles.length} file(s) were already processed and have existing results`);
      }
      if (failedToProcess.length > 0) {
        toast.error(`Failed to process ${failedToProcess.length} file(s)`);
      }
    } catch (error) {
      console.error('Error processing files:', error);
      toast.error('An error occurred while processing files');
    } finally {
      setProcessing(false);
      setProcessingProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      setSelectedFiles([]);
    }
  };

  return (
    <div>
      {/* Page content only, NO header/hamburger here */}
      <h2 className="text-2xl font-bold mb-4">Enter your blood results below</h2>
      <p className="mb-6 text-muted-foreground">Track and monitor your blood test results over time</p>
        
        <div className="w-full">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Your Blood Test Results</h2>
          </div>
          
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2Icon className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <BloodTestsByDate 
              bloodTestResults={bloodTestResults} 
              onDataUpdate={fetchBloodTestResults}
            />
          )}
        </div>
        
        <div>
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
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".pdf"
                    className="hidden"
                    multiple
                  />
                  <Button variant="outline" className="flex-1">
                    <PlusIcon className="h-4 w-4 mr-2" />
                    <span>Manual Entry</span>
                  </Button>
                </div>
                
                {uploadError && (
                  <Alert variant="destructive" className="bg-red-50 border border-red-100">
                    <AlertCircleIcon className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{uploadError}</AlertDescription>
                  </Alert>
                )}
                
                <Alert className="bg-blue-50 border border-blue-100 text-blue-800">
                  <InfoIcon className="h-4 w-4" />
                  <AlertTitle>About PDF Processing</AlertTitle>
                  <AlertDescription>
                    Our system automatically extracts data from blood test PDFs using AI. 
                    Due to the variety of formats, this may not always work perfectly.
                    If automatic extraction fails, please use manual entry.
                  </AlertDescription>
                </Alert>
                
                {selectedFiles.length > 0 && (
                  <div className="mt-2 space-y-2">
                    {selectedFiles.map((file, index) => (
                      <div 
                        key={index} 
                        className={`p-3 rounded-md flex items-center justify-between ${
                          processingStatus[file.name] === 'success' ? 'bg-green-50 border border-green-100' :
                          processingStatus[file.name] === 'error' ? 'bg-red-50 border border-red-100' :
                          processingStatus[file.name] === 'duplicate' ? 'bg-amber-50 border border-amber-100' :
                          processingStatus[file.name] === 'processing' ? 'bg-blue-50 border border-blue-100' :
                          'bg-muted'
                        }`}
                      >
                        <div className="flex items-center">
                          <FileTextIcon className="h-4 w-4 mr-2" />
                          <p className="text-sm">{file.name}</p>
                          {processingStatus[file.name] === 'processing' && (
                            <span className="ml-2 text-xs text-blue-600">
                              <Loader2Icon className="h-3 w-3 animate-spin inline mr-1" />
                              Processing...
                            </span>
                          )}
                          {processingStatus[file.name] === 'success' && (
                            <span className="ml-2 text-xs text-green-600">
                              <CheckCircleIcon className="h-3 w-3 inline mr-1" />
                              Processed successfully
                            </span>
                          )}
                          {processingStatus[file.name] === 'error' && (
                            <span className="ml-2 text-xs text-red-600">
                              <AlertCircleIcon className="h-3 w-3 inline mr-1" />
                              Failed to process
                            </span>
                          )}
                          {processingStatus[file.name] === 'duplicate' && (
                            <span className="ml-2 text-xs text-amber-600">
                              <InfoIcon className="h-3 w-3 inline mr-1" />
                              Already processed
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
                      </div>
                    ))}
                    
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
                        `Upload & Process ${selectedFiles.length} File(s) with AI`
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
    </div>
  );
};

export default BloodTests;
