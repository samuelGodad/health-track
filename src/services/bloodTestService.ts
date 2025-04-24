import { supabase } from '../integrations/supabase/client';
import { Database } from '../integrations/supabase/types';
import { createHash } from 'crypto'; 

type Tables = Database['public']['Tables'];
type BloodTestResultTable = Tables['blood_test_results'];
type BloodTestResultInsert = BloodTestResultTable['Insert'];

interface ParsePdfResponse {
  success: boolean;
  data: LabResult[];
  error?: string;
  debug?: {
    fileInfo: {
      size: number;
      pages: number;
      totalResults: number;
    };
  };
}

interface LabResult {
  test: string;
  category: string;
  result: string;
  reference_min: string;
  reference_max: string;
  payor_code?: string;
  status: string;
  test_date: string;
}

interface FileInfo {
  name: string;
  url: string;
}

// Add new interface for file processing status
interface FileProcessingStatus {
  exists: boolean;
  fileHash?: string;
}

class BloodTestService {
  private static instance: BloodTestService;
  private constructor() {}

  public static getInstance(): BloodTestService {
    if (!BloodTestService.instance) {
      BloodTestService.instance = new BloodTestService();
    }
    return BloodTestService.instance;
  }

  // Add new method to check if file exists in storage
  private async checkFileInStorage(fileHash: string, userId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .storage
        .from('blood-test-pdfs')
        .list(`${userId}`, {
          search: fileHash
        });

      if (error) {
        throw error;
      }

      return data.length > 0;
    } catch (error) {
      console.error('Error checking file in storage:', error);
      return false;
    }
  }

  // Add new method to check if file has results
  private async checkFileHasResults(fileHash: string, userId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('blood_test_results')
        .select('id')
        .eq('source_file_hash', fileHash)
        .eq('user_id', userId)
        .limit(1);

      if (error) {
        throw error;
      }

      return (data?.length ?? 0) > 0;
    } catch (error) {
      console.error('Error checking file results:', error);
      return false;
    }
  }

  // Add new method to calculate file hash
  // private async calculateFileHash(file: File): Promise<string> {
  //   const buffer = await file.arrayBuffer();
  //   const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  //   const hashArray = Array.from(new Uint8Array(hashBuffer));
  //   const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  //   return hashHex;
  // }

  private async calculateFileHash(file: File): Promise<string> {
    const buffer = await file.arrayBuffer();
    const hash = createHash('sha256');
    hash.update(Buffer.from(buffer));
    return hash.digest('hex');
  }
  // Add new method to check if file was already processed
  private async checkFileProcessed(fileHash: string, userId: string): Promise<boolean> {
    try {
      const { data: processedFile, error } = await supabase
        .from('processed_files')
        .select('file_hash')
        .eq('file_hash', fileHash)
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 is "not found" error
        throw error;
      }

      return !!processedFile;
    } catch (error) {
      if (error instanceof Error && error.message.includes('PGRST116')) {
        return false;
      }
      throw error;
    }
  }

  // Add new method to mark file as processed
  private async markFileAsProcessed(fileHash: string, userId: string, fileName: string): Promise<void> {
    const { error } = await supabase
      .from('processed_files')
      .upsert({
        file_hash: fileHash,
        user_id: userId,
        file_name: fileName,
        processed_at: new Date().toISOString()
      });

    if (error) {
      throw error;
    }
  }

  private async transformResults(results: LabResult[], fileHash: string): Promise<BloodTestResultInsert[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    return results.map(result => ({
      test_name: result.test,
      category: result.category,
      result: parseFloat(result.result),
      reference_min: result.reference_min ? parseFloat(result.reference_min) : null,
      reference_max: result.reference_max ? parseFloat(result.reference_max) : null,
      status: result.status,
      test_date: result.test_date,
      test_code: result.payor_code || null,
      created_at: new Date().toISOString(),
      processed_by_ai: true,
      source_file_type: 'pdf',
      source_file_hash: fileHash,
      user_id: user.id
    }));
  }

  private async saveResults(results: BloodTestResultInsert[]): Promise<void> {
    const { error } = await supabase
      .from('blood_test_results')
      .insert(results);

    if (error) {
      throw new Error(`Failed to save results: ${error.message}`);
    }
  }

  public async processBloodTestPDF(file: File | FileInfo): Promise<BloodTestResultInsert[]> {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Handle file validation and conversion
      let fileToProcess: File;
      if (file instanceof File) {
        if (file.size < 1024) {
          throw new Error('File is too small to be a valid PDF');
        }
        if (file.type !== 'application/pdf') {
          throw new Error('File must be a PDF');
        }
        fileToProcess = file;
      } else {
        const response = await fetch(file.url);
        const blob = await response.blob();
        fileToProcess = new File([blob], file.name, { type: 'application/pdf' });
      }

      // Calculate file hash
      const fileHash = await this.calculateFileHash(fileToProcess);

      // Check if file has results first
      const hasResults = await this.checkFileHasResults(fileHash, user.id);
      if (hasResults) {
        throw new Error('This PDF has already been processed and results exist');
      }

      // Check if file was previously processed but has no results
      const isProcessed = await this.checkFileProcessed(fileHash, user.id);
      if (isProcessed) {
        // Remove from processed_files since it has no results
        await supabase
          .from('processed_files')
          .delete()
          .eq('file_hash', fileHash)
          .eq('user_id', user.id);
      }

      // Create FormData and process the file
      const formData = new FormData();
      formData.append('file', fileToProcess);

      const response = await fetch('https://health-track-1-x8k4.onrender.com/api/parse-pdf', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Server returned ${response.status}: ${response.statusText}`);
      }

      const result: ParsePdfResponse = await response.json();
      
      if (!result.success) {
        throw new Error('Failed to parse PDF: ' + (result.error || 'Unknown error'));
      }

      if (!result.data || result.data.length === 0) {
        throw new Error('No results found in PDF');
      }

      // Transform and save results
      const transformedResults = await this.transformResults(result.data, fileHash);
      
      try {
        // Save results first
        await this.saveResults(transformedResults);
        
        // Only mark as processed if results were saved successfully
        await this.markFileAsProcessed(fileHash, user.id, fileToProcess.name);
        
        return transformedResults;
      } catch (error) {
        // If saving results fails, ensure we don't mark the file as processed
        console.error('Error saving results:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error processing blood test PDF:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('An unexpected error occurred while processing the PDF');
    }
  }

  public async getBloodTestResults(): Promise<BloodTestResultInsert[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('blood_test_results')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return data || [];
  }
}

export const bloodTestService = BloodTestService.getInstance();
