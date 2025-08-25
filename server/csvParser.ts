import fs from 'fs';
import path from 'path';
import { CSVTestData } from './testCategories';

export function parseCSVFile(filePath: string): CSVTestData[] {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const lines = fileContent.split('\n').filter(line => line.trim());
    
    // Skip header row
    const dataLines = lines.slice(1);
    
    return dataLines.map(line => {
      const columns = line.split(',').map(col => col.trim().replace(/"/g, ''));
      
      return {
        testName: columns[0] || '',
        category: columns[1] || '',
        panel: columns[2] || '',
        description: columns[3] || '',
        referenceRangeMin: parseFloat(columns[4]) || null,
        referenceRangeMax: parseFloat(columns[5]) || null,
        referenceRangeType: columns[6] || 'range',
        units: columns[7] || '',
        whyItMatters: columns[8] || ''
      };
    }).filter(test => test.testName && test.testName.length > 0);
  } catch (error) {
    console.error(`Error parsing CSV file ${filePath}:`, error);
    return [];
  }
}

export function loadAllCSVData(): CSVTestData[] {
  const csvDir = path.join(__dirname, '..', 'data', 'Test csv');
  const allTests: CSVTestData[] = [];
  
  try {
    const files = fs.readdirSync(csvDir);
    
    files.forEach(file => {
      if (file.endsWith('.csv')) {
        const filePath = path.join(csvDir, file);
        const tests = parseCSVFile(filePath);
        console.log(`Loaded ${tests.length} tests from ${file}`);
        allTests.push(...tests);
      }
    });
    
    console.log(`Total tests loaded: ${allTests.length}`);
    return allTests;
  } catch (error) {
    console.error('Error loading CSV data:', error);
    return [];
  }
}
