import { supabase } from '../integrations/supabase/client';
import { Database } from '../integrations/supabase/types';
import { createHash } from 'crypto';
import { parsePDF } from './apiService'; 

type Tables = Database['public']['Tables'];
type BloodTestResultTable = Tables['blood_test_results'];
type BloodTestResultInsert = BloodTestResultTable['Insert'];

interface ParsePdfResponse {
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
    console.log('\n=== Saving results to blood_test_results ===');
    console.log(`Attempting to save ${results.length} results`);
    console.log('Sample result data:', results[0]);
    
    const { data, error } = await supabase
      .from('blood_test_results')
      .insert(results)
      .select();

    if (error) {
      console.error('Supabase error saving results:', error);
      throw new Error(`Failed to save results: ${error.message}`);
    }
    
    console.log(`Successfully saved ${data?.length || 0} results to blood_test_results`);
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

      // Use the centralized apiService instead of hardcoded fetch
      const result = await parsePDF(fileToProcess);
      
      if (!result.data || result.data.length === 0) {
        throw new Error(result.error || 'No results found in PDF');
      }

      // First, save extracted tests to metadata table if not already present
      console.log('About to save tests to metadata...');
      await this.saveTestsToMetadata(result.data as any);
      console.log('Finished saving tests to metadata');

      // Transform and save results
      const transformedResults = await this.transformResults(result.data as any, fileHash);
      
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

    const results = data || [];

    // Apply metadata fallback for missing reference ranges during display
    return this.applyMetadataFallbackForDisplay(results);
  }

  // Method to apply metadata fallback specifically for display purposes
  private async applyMetadataFallbackForDisplay(results: BloodTestResultInsert[]): Promise<BloodTestResultInsert[]> {
    try {
      console.log('\n=== Applying metadata fallback for display ===');
      
      // Find tests without reference ranges
      const testsWithoutRanges = results.filter(test => 
        test.reference_min === null && test.reference_max === null
      );
      
      if (testsWithoutRanges.length === 0) {
        console.log('No tests without reference ranges found');
        return results;
      }
      
      console.log(`Found ${testsWithoutRanges.length} tests without reference ranges for display fallback`);
      
      // Get unique test names
      const testNames = [...new Set(testsWithoutRanges.map(test => test.test_name))];
      
      // Query metadata for these tests
      const { data: metadataResults, error } = await supabase
        .from('blood_test_metadata')
        .select('test_name, reference_min, reference_max, unit')
        .in('test_name', testNames);
      
      if (error) {
        console.error('Error querying metadata for display fallback:', error);
        return results;
      }
      
      // Create lookup map
      const metadataMap = new Map<string, { reference_min: number | null; reference_max: number | null; unit: string | null }>();
      metadataResults?.forEach(meta => {
        metadataMap.set(meta.test_name, {
          reference_min: meta.reference_min,
          reference_max: meta.reference_max,
          unit: meta.unit
        });
      });
      
      // Apply fallback ranges
      const updatedResults = results.map(test => {
        if (test.reference_min === null && test.reference_max === null) {
          const metadata = metadataMap.get(test.test_name);
          if (metadata && (metadata.reference_min !== null || metadata.reference_max !== null)) {
            console.log(`Applied metadata fallback for ${test.test_name}:`, 
              `${metadata.reference_min} - ${metadata.reference_max}`);
            return {
              ...test,
              reference_min: metadata.reference_min,
              reference_max: metadata.reference_max,
            };
          }
        }
        return test;
      });
      
      const updatedCount = updatedResults.filter((test, index) => 
        test.reference_min !== results[index].reference_min || 
        test.reference_max !== results[index].reference_max
      ).length;
      
      console.log(`Applied metadata fallback to ${updatedCount} tests for display`);
      
      return updatedResults;
      
    } catch (error) {
      console.error('Error in applyMetadataFallbackForDisplay:', error);
      return results;
    }
  }

  // Add method to save extracted tests to metadata table if not present
  private async saveTestsToMetadata(results: LabResult[]): Promise<void> {
    try {
      console.log('\n=== Saving extracted tests to blood_test_metadata ===');
      
      // Get all unique test names from the extracted results
      const uniqueTests = results.reduce((acc, result) => {
        if (!acc.find(t => t.test_name === result.test)) {
          acc.push({
            test_name: result.test,
            category: result.category,
            reference_min: result.reference_min && result.reference_min !== 'null' ? parseFloat(result.reference_min) : null,
            reference_max: result.reference_max && result.reference_max !== 'null' ? parseFloat(result.reference_max) : null,
            unit: null, // We can add unit detection later
            description: 'Auto-added from PDF extraction'
          });
        }
        return acc;
      }, [] as Array<{
        test_name: string;
        category: string;
        reference_min: number | null;
        reference_max: number | null;
        unit: string | null;
        description: string;
      }>);

      if (uniqueTests.length === 0) {
        console.log('No tests to add to metadata');
        return;
      }

      console.log(`Found ${uniqueTests.length} unique tests to potentially add to metadata`);

      // Check which tests already exist in metadata
      const testNames = uniqueTests.map(t => t.test_name);
      const { data: existingMetadata, error: checkError } = await supabase
        .from('blood_test_metadata')
        .select('test_name')
        .in('test_name', testNames);

      if (checkError) {
        console.error('Error checking existing metadata:', checkError);
        return; // Continue with processing even if metadata check fails
      }

      const existingTestNames = new Set(existingMetadata?.map(m => m.test_name) || []);
      const newTests = uniqueTests.filter(test => !existingTestNames.has(test.test_name));

      if (newTests.length === 0) {
        console.log('All tests already exist in metadata table');
        return;
      }

      console.log(`Adding ${newTests.length} new tests to metadata:`, newTests.map(t => t.test_name));

      // Insert new tests into metadata table
      const metadataInserts = newTests.map(test => ({
        test_name: test.test_name,
        category: test.category,
        test_code: '', // Empty for now - required field
        reference_min: test.reference_min,
        reference_max: test.reference_max,
        unit: test.unit,
        description: test.description
      }));

      console.log('Metadata inserts prepared:', metadataInserts);

      const { data: insertedData, error: insertError } = await supabase
        .from('blood_test_metadata')
        .insert(metadataInserts)
        .select();

      if (insertError) {
        console.error('Error inserting into metadata:', insertError);
        console.error('Failed metadata inserts:', metadataInserts);
        // Continue with processing even if metadata insertion fails
      } else {
        console.log(`Successfully added ${insertedData?.length || 0} tests to blood_test_metadata`);
        console.log('Inserted metadata records:', insertedData);
      }

    } catch (error) {
      console.error('Error in saveTestsToMetadata:', error);
      // Continue with processing even if metadata operations fail
    }
  }

  // Update the existing metadata checking method to be used for display fallback
  private async checkMetadataForReferenceRanges(results: LabResult[]): Promise<LabResult[]> {
    try {
      console.log('\n=== Checking blood_test_metadata for missing reference ranges (display fallback) ===');
      
      // Get all test names that have null or empty reference ranges
      const testsWithoutRanges = results.filter(test => 
        (!test.reference_min || test.reference_min === 'null') && 
        (!test.reference_max || test.reference_max === 'null')
      );
      
      if (testsWithoutRanges.length === 0) {
        console.log('No tests without reference ranges found');
        return results;
      }
      
      console.log(`Found ${testsWithoutRanges.length} tests without reference ranges:`, 
        testsWithoutRanges.map(t => t.test));
      
      // Query blood_test_metadata for these test names
      const testNames = testsWithoutRanges.map(test => test.test);
      const { data: metadataResults, error } = await supabase
        .from('blood_test_metadata')
        .select('test_name, reference_min, reference_max, unit')
        .in('test_name', testNames);
      
      if (error) {
        console.error('Error querying blood_test_metadata:', error);
        return results; // Return original results if query fails
      }
      
      console.log(`Found ${metadataResults?.length || 0} matches in blood_test_metadata`);
      
      // Create a map for quick lookup
      const metadataMap = new Map<string, { test_name: string; reference_min: number | null; reference_max: number | null; unit: string | null }>();
      metadataResults?.forEach(meta => {
        metadataMap.set(meta.test_name, meta);
      });
      
      // Update test results with metadata reference ranges
      const updatedResults = results.map(test => {
        if ((!test.reference_min || test.reference_min === 'null') && 
            (!test.reference_max || test.reference_max === 'null')) {
          const metadata = metadataMap.get(test.test);
          if (metadata && (metadata.reference_min !== null || metadata.reference_max !== null)) {
            console.log(`Updated ${test.test} with metadata ranges:`, 
              `${metadata.reference_min} - ${metadata.reference_max}`);
            return {
              ...test,
              reference_min: metadata.reference_min !== null ? `${metadata.reference_min}` : null,
              reference_max: metadata.reference_max !== null ? `${metadata.reference_max}` : null,
            };
          }
        }
        return test;
      });
      
      const updatedCount = updatedResults.filter((test, index) => 
        test.reference_min !== results[index].reference_min || 
        test.reference_max !== results[index].reference_max
      ).length;
      
      console.log(`Updated ${updatedCount} tests with metadata reference ranges`);
      
      return updatedResults;
      
    } catch (error) {
      console.error('Error in checkMetadataForReferenceRanges:', error);
      return results; // Return original results if anything fails
    }
  }
}

export const bloodTestService = BloodTestService.getInstance();
