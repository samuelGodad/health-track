import { supabase } from '@/integrations/supabase/client';

export interface LabResult {
  test: string;
  category: string;
  value: string;
//   unit: string;
  reference_range: string;
  status: 'normal' | 'high' | 'low';
  date: string;
  test_code?: string;
  notes?: string;
  source_file_path?: string;
  source_file_url?: string;
  source_file_type?: string;
  processed_by_ai?: boolean;
}

export interface ParsePdfResponse {
  data: LabResult[];
  debug?: {
    fileInfo: {
      size: number;
      pages: number;
    }
  };
}

export interface FileInfo {
  name: string;
  url: string;
  path: string;
}

// const API_URL = 'http://localhost:3000';
const API_URL = 'https://health-track-pcd5.onrender.com'

export const parsePDF = async (file: File | FileInfo): Promise<ParsePdfResponse> => {
  const formData = new FormData();
  
  if (file instanceof File) {
    formData.append('file', file);
  } else {
    // If it's a FileInfo object, fetch the file first
    const response = await fetch(file.url);
    const blob = await response.blob();
    const fileObject = new File([blob], file.name, { type: 'application/pdf' });
    formData.append('file', fileObject);
  }
  
  try {
    const response = await fetch(`${API_URL}/api/parse-pdf`, {
      method: 'POST',
      body: formData, 
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to process PDF');
    }
    
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

export const saveLabResultsToSupabase = async (results: LabResult[]): Promise<LabResult[]> => {
  try {
    const user = supabase.auth.getUser();
    const userId = (await user).data.user?.id;
    
    if (!userId) {
      throw new Error('User not authenticated');
    }

    // Transform and insert lab results
    for (const result of results) {
      // Parse reference range into min and max
      const [min, max] = result.reference_range.split('-').map(val => {
        const num = parseFloat(val.trim());
        return isNaN(num) ? null : num;
      });

      // Parse the result value
      const resultValue = parseFloat(result.value);
      if (isNaN(resultValue)) {
        throw new Error(`Invalid result value: ${result.value}`);
      }

      // Parse the test date
      const testDate = new Date(result.date);
      if (isNaN(testDate.getTime())) {
        throw new Error(`Invalid test date: ${result.date}`);
      }

      // Prepare the data for insertion
      const insertData = {
        user_id: userId,
        category: result.category,
        test_name: result.test,
        result: resultValue,
        reference_min: min,
        reference_max: max,
        status: result.status,
        test_date: testDate.toISOString().split('T')[0], // Format as YYYY-MM-DD
        notes: result.notes || null,
        source_file_path: result.source_file_path || null,
        source_file_url: result.source_file_url || null,
        source_file_type: result.source_file_type || null,
        test_code: result.test_code || null,
        processed_by_ai: result.processed_by_ai ?? true, // Default to true if not specified
        created_at: new Date().toISOString() // Current timestamp
      };

      const { error } = await supabase
        .from('blood_test_results')
        .insert(insertData);

      if (error) {
        console.error('Error saving lab result:', error);
        throw error;
      }
    }

    // Return all lab results for the user
    return await getLabResultsFromSupabase();
  } catch (error) {
    console.error('Error in saveLabResultsToSupabase:', error);
    throw error;
  }
};

export const getLabResultsFromSupabase = async (): Promise<LabResult[]> => {
  try {
    const user = supabase.auth.getUser();
    const userId = (await user).data.user?.id;
    
    if (!userId) {
      return [];
    }

    const { data, error } = await supabase
      .from('blood_test_results')
      .select('*')
      .eq('user_id', userId)
      .order('test_date', { ascending: false });

    if (error) {
      console.error('Error fetching lab results:', error);
      throw error;
    }

    return data.map(item => ({
      test: item.test_name,
      category: item.category,
      value: item.result.toString(),
    //   unit: item.unit || '',
      reference_range: `${item.reference_min || ''}-${item.reference_max || ''}`,
      status: item.status as 'normal' | 'high' | 'low',
      date: item.test_date,
      test_code: item.test_code,
      notes: item.notes,
      source_file_path: item.source_file_path,
      source_file_url: item.source_file_url,
      source_file_type: item.source_file_type,
      processed_by_ai: item.processed_by_ai
    }));
  } catch (error) {
    console.error('Error in getLabResultsFromSupabase:', error);
    throw error;
  }
};
