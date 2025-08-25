import { CSVTestData } from './testCategories';

interface TestMatch {
  test: CSVTestData;
  confidence: number;
  matchType: string;
}

class FuzzyMatchingService {
  public static findBestMatch(extractedName: string, csvTests: CSVTestData[]): TestMatch | null {
    if (!extractedName || !csvTests.length) return null;

    const normalized = this.normalizeName(extractedName);
    let bestMatch: TestMatch | null = null;
    let highestConfidence = 0;

    for (const test of csvTests) {
      const match = this.calculateMatch(extractedName, normalized, test);
      
      if (match && match.confidence > highestConfidence) {
        bestMatch = match;
        highestConfidence = match.confidence;
      }
    }

    return bestMatch;
  }

  private static calculateMatch(extractedName: string, normalizedExtracted: string, csvTest: CSVTestData): TestMatch | null {
    const normalizedCSV = this.normalizeName(csvTest.testName);
    
    // Level 1: Exact match (100% confidence)
    if (normalizedExtracted === normalizedCSV) {
      return {
        test: csvTest,
        confidence: 100,
        matchType: 'exact'
      };
    }

    // Level 2: Partial match (85% confidence)
    if (normalizedExtracted.includes(normalizedCSV) || normalizedCSV.includes(normalizedExtracted)) {
      return {
        test: csvTest,
        confidence: 85,
        matchType: 'partial'
      };
    }

    // Level 3: Synonym match using description (75% confidence)
    if (this.isSynonymMatch(extractedName, csvTest)) {
      return {
        test: csvTest,
        confidence: 75,
        matchType: 'synonym'
      };
    }

    return null;
  }

  private static normalizeName(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '') // Remove punctuation, spaces, special chars
      .trim();
  }

  private static isSynonymMatch(extractedName: string, csvTest: CSVTestData): boolean {
    const extractedLower = extractedName.toLowerCase();
    const descriptionLower = csvTest.description.toLowerCase();
    
    // Check if extracted name appears in description
    if (descriptionLower.includes(extractedLower)) return true;
    
    // Check for common abbreviations
    const commonAbbreviations: Record<string, string[]> = {
      'e2': ['estradiol', 'estrogen'],
      't': ['testosterone'],
      'tsh': ['thyroid stimulating hormone'],
      't4': ['thyroxine'],
      't3': ['triiodothyronine'],
      'alt': ['alanine aminotransferase'],
      'ast': ['aspartate aminotransferase'],
      'ggt': ['gamma glutamyl transferase'],
      'alp': ['alkaline phosphatase'],
      'hgb': ['hemoglobin'],
      'hct': ['hematocrit'],
      'wbc': ['white blood cell'],
      'rbc': ['red blood cell'],
      'plt': ['platelet'],
      'hdl': ['high density lipoprotein'],
      'ldl': ['low density lipoprotein'],
      'tg': ['triglyceride'],
      'bun': ['blood urea nitrogen'],
      'na': ['sodium'],
      'k': ['potassium'],
      'cl': ['chloride'],
      'ca': ['calcium'],
      'mg': ['magnesium'],
      'fe': ['iron']
    };

    const extractedNormalized = this.normalizeName(extractedName);
    for (const [abbr, fullNames] of Object.entries(commonAbbreviations)) {
      if (extractedNormalized === abbr) {
        return fullNames.some(full => descriptionLower.includes(full));
      }
    }

    return false;
  }
}

export default FuzzyMatchingService;
