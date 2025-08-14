import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { toast } from 'sonner';
import { useAuth } from '@/providers/SupabaseAuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { bloodTestService } from '@/services/bloodTestService';

interface UploadFile {
  id: string;
  name: string;
  file: File;
  status: 'pending' | 'uploading' | 'processing' | 'success' | 'error' | 'duplicate';
  progress: number;
  error?: string;
  uploadedUrl?: string;
}

interface UploadContextType {
  uploads: UploadFile[];
  isUploading: boolean;
  isProcessing: boolean;
  uploadFiles: (files: File[]) => Promise<void>;
  retryUpload: (fileId: string) => Promise<void>;
  clearUploads: () => void;
  removeUpload: (fileId: string) => void;
}

const UploadContext = createContext<UploadContextType | undefined>(undefined);

export const useUpload = () => {
  const context = useContext(UploadContext);
  if (!context) {
    throw new Error('useUpload must be used within an UploadProvider');
  }
  return context;
};

interface UploadProviderProps {
  children: ReactNode;
}

export const UploadProvider: React.FC<UploadProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [uploads, setUploads] = useState<UploadFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);



  const processSingleFile = useCallback(async (upload: UploadFile) => {
    if (!upload.file) return;

    setIsProcessing(true);

    try {
      setUploads(prev => prev.map(u => 
        u.id === upload.id 
          ? { ...u, status: 'processing' }
          : u
      ));

      console.log('Starting AI processing for:', upload.name);
      console.log('File object:', upload.file);
      console.log('File size:', upload.file.size);
      console.log('File type:', upload.file.type);
      
      const results = await bloodTestService.processBloodTestPDF(upload.file);
      console.log('AI processing results:', results);
      
      if (results && results.length > 0) {
        setUploads(prev => prev.map(u => 
          u.id === upload.id 
            ? { ...u, status: 'success' }
            : u
        ));
        toast.success(`${upload.name} processed successfully`);
      } else {
        setUploads(prev => prev.map(u => 
          u.id === upload.id 
            ? { ...u, status: 'error', error: 'No results extracted' }
            : u
        ));
        toast.error(`Failed to process ${upload.name}`);
      }
    } catch (error) {
      console.error(`Error processing ${upload.name}:`, error);
      if (error instanceof Error) {
        if (error.message === 'This PDF has already been processed and results exist') {
          setUploads(prev => prev.map(u => 
            u.id === upload.id 
              ? { ...u, status: 'duplicate' }
              : u
          ));
          toast.warning(`${upload.name} was already processed`);
        } else {
          setUploads(prev => prev.map(u => 
            u.id === upload.id 
              ? { ...u, status: 'error', error: error.message }
              : u
        ));
          toast.error(`Failed to process ${upload.name}: ${error.message}`);
        }
      }
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const uploadFiles = useCallback(async (files: File[]) => {
    if (!user) {
      toast.error('You must be logged in to upload files');
      return;
    }

    if (files.length === 0) {
      toast.error('Please select PDF files to upload');
      return;
    }

    // Create upload entries
    const newUploads: UploadFile[] = files.map(file => ({
      id: `${Date.now()}-${Math.random()}`,
      name: file.name,
      file,
      status: 'pending',
      progress: 0
    }));

    setUploads(prev => [...prev, ...newUploads]);
    setIsUploading(true);

    try {
      // Upload files to Supabase Storage
      for (const upload of newUploads) {
        try {
          setUploads(prev => prev.map(u => 
            u.id === upload.id 
              ? { ...u, status: 'uploading', progress: 0 }
              : u
          ));

          const timestamp = new Date().getTime();
          const filePath = `${user.id}/${timestamp}-${upload.file.name}`;
          
          const { data, error } = await supabase.storage
            .from('blood-test-pdfs')
            .upload(filePath, upload.file, {
              cacheControl: '3600',
              upsert: true
            });
          
          if (error) throw error;
          
          const { data: publicUrlData } = supabase.storage
            .from('blood-test-pdfs')
            .getPublicUrl(filePath);

          // Update upload with success and URL
          setUploads(prev => prev.map(u => 
            u.id === upload.id 
              ? { ...u, status: 'success', progress: 100, uploadedUrl: publicUrlData.publicUrl }
              : u
          ));

          toast.success(`${upload.name} uploaded successfully`);
          
          // Process this file immediately with AI
          await processSingleFile(upload);
        } catch (error) {
          console.error(`Error uploading ${upload.name}:`, error);
          setUploads(prev => prev.map(u => 
            u.id === upload.id 
              ? { ...u, status: 'error', error: 'Upload failed' }
              : u
          ));
          toast.error(`Failed to upload ${upload.name}`);
        }
      }
    } catch (error) {
      console.error('Error in upload process:', error);
      toast.error('Upload process failed');
    } finally {
      setIsUploading(false);
    }
  }, [user, processSingleFile]);



  const processUploadedFiles = useCallback(async () => {
    const filesToProcess = uploads.filter(u => u.status === 'success' && u.uploadedUrl);
    
    if (filesToProcess.length === 0) return;

    setIsProcessing(true);

    try {
      for (const upload of filesToProcess) {
        try {
          setUploads(prev => prev.map(u => 
            u.id === upload.id 
              ? { ...u, status: 'processing' }
              : u
          ));

          const results = await bloodTestService.processBloodTestPDF(upload.file);
          
          if (results && results.length > 0) {
            setUploads(prev => prev.map(u => 
              u.id === upload.id 
                ? { ...u, status: 'success' }
                : u
            ));
            toast.success(`${upload.name} processed successfully`);
          } else {
            setUploads(prev => prev.map(u => 
              u.id === upload.id 
                ? { ...u, status: 'error', error: 'No results extracted' }
                : u
            ));
            toast.error(`Failed to process ${upload.name}`);
          }
        } catch (error) {
          console.error(`Error processing ${upload.name}:`, error);
          if (error instanceof Error) {
            if (error.message === 'This PDF has already been processed and results exist') {
              setUploads(prev => prev.map(u => 
                u.id === upload.id 
                  ? { ...u, status: 'duplicate' }
                  : u
              ));
              toast.warning(`${upload.name} was already processed`);
            } else {
              setUploads(prev => prev.map(u => 
                u.id === upload.id 
                  ? { ...u, status: 'error', error: error.message }
                  : u
              ));
              toast.error(`Failed to process ${upload.name}: ${error.message}`);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error processing files:', error);
      toast.error('Processing failed');
    } finally {
      setIsProcessing(false);
    }
  }, [uploads]);

  const retryUpload = useCallback(async (fileId: string) => {
    const upload = uploads.find(u => u.id === fileId);
    if (!upload) return;

    // Reset status and retry
    setUploads(prev => prev.map(u => 
      u.id === fileId 
        ? { ...u, status: 'pending', progress: 0, error: undefined }
        : u
    ));

    await uploadFiles([upload.file]);
  }, [uploads, uploadFiles]);

  const clearUploads = useCallback(() => {
    setUploads([]);
  }, []);

  const removeUpload = useCallback((fileId: string) => {
    if (fileId === 'all') {
      setUploads([]);
    } else {
      setUploads(prev => prev.filter(u => u.id !== fileId));
    }
  }, []);

  const value: UploadContextType = {
    uploads,
    isUploading,
    isProcessing,
    uploadFiles,
    retryUpload,
    clearUploads,
    removeUpload
  };

  return (
    <UploadContext.Provider value={value}>
      {children}
    </UploadContext.Provider>
  );
};
