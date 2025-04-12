import { supabase } from '../integrations/supabase/client';
import { Database } from '../integrations/supabase/types';

type Tables = Database['public']['Tables'];
type BloodTestResultTable = Tables['blood_test_results'];
type BloodTestResultInsert = BloodTestResultTable['Insert'];

interface ParsePdfResponse {
  success: boolean;
  data: LabResult[];
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

class BloodTestService {
  private static instance: BloodTestService;
  private constructor() {}

  public static getInstance(): BloodTestService {
    if (!BloodTestService.instance) {
      BloodTestService.instance = new BloodTestService();
    }
    return BloodTestService.instance;
  }

  private async transformResults(results: LabResult[]): Promise<BloodTestResultInsert[]> {
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
      user_id: user.id
    }));
  }

  private async saveResults(results: BloodTestResultInsert[]): Promise<void> {
    const { error } = await supabase
      .from('blood_test_results')
      .insert(results);

    if (error) {
      throw error;
    }
  }

  public async processBloodTestPDF(file: File | FileInfo): Promise<BloodTestResultInsert[]> {
    try {
      // Validate file
      if (file instanceof File) {
        if (file.size < 1024) { // 1KB minimum
          throw new Error('File is too small to be a valid PDF');
        }
        if (file.type !== 'application/pdf') {
          throw new Error('File must be a PDF');
        }
      }

      // Create FormData and append file
      const formData = new FormData();
      if (file instanceof File) {
        formData.append('file', file);
      } else {
        // If it's a FileInfo, we need to fetch the file first
        const response = await fetch(file.url);
        const blob = await response.blob();
        formData.append('file', blob, file.name);
      }

      // Send to server
      const response = await fetch('http://localhost:3000/api/parse-pdf', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}: ${response.statusText}`);
      }

      const result: ParsePdfResponse = await response.json();
      
      if (!result.success) {
        throw new Error('Failed to parse PDF');
      }

      if (!result.data || result.data.length === 0) {
        throw new Error('No results found in PDF');
      }

      // Transform and save results
      const transformedResults = await this.transformResults(result.data);
      await this.saveResults(transformedResults);
      
      return transformedResults;
    } catch (error) {
      console.error('Error processing blood test PDF:', error);
      throw error;
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
