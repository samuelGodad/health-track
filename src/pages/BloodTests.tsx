import { useState, useRef, useEffect } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Loader2Icon,
  FileTextIcon,
  UploadIcon,
  PlusIcon,
  InfoIcon
} from 'lucide-react';
import { useAuth } from "@/providers/SupabaseAuthProvider";
import { useUpload } from "@/contexts/UploadContext";
import { bloodTestService } from '@/services/bloodTestService';
import { 
  Alert,
  AlertTitle,
  AlertDescription 
} from '@/components/ui/alert';

import BloodTestsByDate from '@/components/bloodTests/BloodTestsByDate';

const BloodTests = () => {
  const { user } = useAuth();
  const { uploadFiles, isUploading, isProcessing } = useUpload();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [bloodTestResults, setBloodTestResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
        toast.success(`${pdfFiles.length} PDF file(s) selected`);
      }
    }
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      toast.error('Please select PDF files to upload');
      return;
    }
    
    try {
      await uploadFiles(selectedFiles);
      setSelectedFiles([]);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      fetchBloodTestResults();
    } catch (error) {
      console.error('Error uploading files:', error);
      toast.error('Failed to upload files. Please try again.');
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
                    <span>Select PDF Files</span>
                  </Button>
                  {selectedFiles.length > 0 && (
                    <Button 
                      className="flex-1" 
                      onClick={handleUpload}
                      disabled={isUploading || isProcessing}
                    >
                      <UploadIcon className="h-4 w-4 mr-2" />
                      <span>{isUploading ? "Uploading..." : isProcessing ? "Processing..." : `Upload ${selectedFiles.length} File(s)`}</span>
                    </Button>
                  )}
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
                      className="p-3 rounded-md flex items-center justify-between bg-muted"
                    >
                      <div className="flex items-center">
                        <FileTextIcon className="h-4 w-4 mr-2" />
                        <p className="text-sm">{file.name}</p>
                      </div>
                      <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
                    </div>
                    ))}
                    
                    <Button 
                      onClick={handleUpload}
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
