export interface CSVTestData {
  testName: string;
  category: string;
  panel: string;
  description: string;
  referenceRangeMin: number | null;
  referenceRangeMax: number | null;
  referenceRangeType: string;
  units: string;
  whyItMatters: string;
}

// This file will be populated with your actual CSV data from data/Test csv/ folder
// For now, keeping the interface structure but the data will come from your CSV files

export const allTests: CSVTestData[] = [
  // Your actual CSV data will be loaded here
  // This will include all 12 categories:
  // - biochemistry_tests.csv
  // - bone_tests.csv
  // - electrolyte_tests.csv
  // - haematology_tests.csv
  // - hormonal_tests.csv
  // - kidney_tests.csv
  // - lipids_tests.csv
  // - liver_tests.csv
  // - metabolism_tests.csv
  // - micronutrient_tests.csv
  // - oncology_tests.csv
  // - thyroid_tests.csv
];
