import express from 'express';
import multer from 'multer';
import cors from 'cors';
import OpenAI from 'openai';
import * as dotenv from 'dotenv';

dotenv.config();

const app = express();
const upload = multer();

app.use(cors());
app.use(express.json());

const openai = new OpenAI({  apiKey: process.env.OPENAI_API_KEY,
});

// Function to clean response text and extract JSON
function extractJSON(text: string): string {
  // Remove markdown code blocks
  let cleaned = text.replace(/```json\n?/g, '').replace(/```\n?/g, '');
  
  // Find the first [ and last ]
  const startIndex = cleaned.indexOf('[');
  const endIndex = cleaned.lastIndexOf(']');
  
  if (startIndex === -1 || endIndex === -1) {
    throw new Error('No valid JSON array found in response');
  }
  
  // Extract just the JSON array
  cleaned = cleaned.slice(startIndex, endIndex + 1);
  
  return cleaned.trim();
}

// Standardized test categories
const STANDARD_CATEGORIES = [
  "Liver Function",
  "Kidney Function", 
  "Electrolytes & Minerals",
  "Blood Sugar & Metabolism",
  "Thyroid & Endocrine",
  "Lipids & Cardiovascular",
  "Hormonal (Reproductive & Cortisol)",
  "Cardiac Markers",
  "Oncology Markers", 
  "Bone Health",
  "Micronutrients",
  "Hematology",
  "Fluid & Osmotic Balance",
  "Biochemistry",
  "Panel Tests"
];

const SYSTEM_PROMPT = `You are a medical lab report parser. Your task is to extract lab test results from PDF documents.
You must analyze the content and identify:
- Test names (exactly as shown in the report)
- Test categories (as found in the report)
- Numerical results
- Reference ranges
- Test status (normal/high/low)
- Test dates

IMPORTANT FOR DATE EXTRACTION:
- ALWAYS prioritize the COLLECTION DATE or SPECIMEN DATE over the report date
- Look specifically for labels like "Collection Date", "Specimen Date", "Sample Date", "Drawn Date"
- Pay EXTREME attention to the exact digits in dates - "02" is different from "12"
- Read dates very carefully, digit by digit

You must return a JSON array where each test result has these EXACT field names:
- test_name (string): The exact name of the test as shown in the report
- category (string): The test category as found in the report (e.g., "Complete Blood Count", "Lipid Profile")
- result (number): The numerical result value
- reference_min (number or null): The minimum reference value if available
- reference_max (number or null): The maximum reference value if available
- status (string): Must be exactly "normal", "high", or "low"
- test_date (string): In YYYY-MM-DD format`;

const USER_PROMPT = `Analyze this lab report and extract all test results.
Return ONLY a JSON array where each object has these exact fields:
{
  "test_name": "string",    // Exact test name from report
  "category": "string",     // Test category
  "result": number,         // Numerical result value
  "reference_min": number | null,  // Min reference value or null
  "reference_max": number | null,  // Max reference value or null
  "status": "normal" | "high" | "low",  // Result status
  "test_date": "YYYY-MM-DD"  // Test date
}

CRITICAL REQUIREMENTS:
- test_name must not be null
- result must be a number
- status must be exactly "normal", "high", or "low"
- For reference ranges like "<150" set reference_min: 0, reference_max: 150
- For reference ranges like ">30.5" set reference_min: 30.5, reference_max: null
- For ranges like "10-20" set reference_min: 10, reference_max: 20
- For "N/A" or missing, set both to null
- NEVER return a string for reference_min or reference_max. Only use numbers or null.

CRITICAL DATE EXTRACTION RULES:
1. ALWAYS use the COLLECTION DATE or SPECIMEN DATE, NOT the printed/report date
2. Look for dates labeled as "Collection Date", "Specimen Date", "Sample Date", or "Drawn Date"
3. If you see "02 Sep 2022", read it as day=02, month=09 (September), year=2022
4. If you see "12 Sep 2022", read it as day=12, month=09 (September), year=2022
5. Pay EXTREME attention to the exact digits - "02" is different from "12"
6. Do NOT confuse "02" with "12" - they are completely different numbers
7. Convert any date format to YYYY-MM-DD format
8. If no collection date found, use the earliest date on the report

Examples of CORRECT date extraction:
- "02 Sep 2022" => test_date: "2022-09-02" (day 02, month 09)
- "12 Sep 2022" => test_date: "2022-09-12" (day 12, month 09)
- "2/9/2022" => test_date: "2022-09-02" (day 02, month 09)
- "9/2/2022" => test_date: "2022-09-02" (day 02, month 09)
- "2022-09-02" => test_date: "2022-09-02"
- "September 2, 2022" => test_date: "2022-09-02"

IMPORTANT: When reading dates, look for:
- "Collection Date: 02 Sep 2022" → use "2022-09-02"
- "Specimen Date: 02 Sep 2022" → use "2022-09-02"
- "Drawn: 02 Sep 2022" → use "2022-09-02"
- "Sample Date: 02 Sep 2022" → use "2022-09-02"
`;

// Function to map test categories to standardized categories using AI
async function mapCategoriesToStandard(extractedTests: any[]): Promise<any[]> {
  if (!extractedTests || extractedTests.length === 0) {
    return extractedTests;
  }

  const categoryMappingPrompt = `You are a medical expert. Your task is to map each test to the most appropriate standardized category.

AVAILABLE STANDARD CATEGORIES:
${STANDARD_CATEGORIES.map(cat => `- ${cat}`).join('\n')}

INSTRUCTIONS:
1. Analyze each test name and its original category
2. Map it to the most appropriate standard category based on medical knowledge
3. Consider both the test name and original category when making the decision
4. Use your medical expertise to determine the best fit

EXAMPLES:
- Test: "ALT", Original Category: "Liver Panel" → Standard Category: "Liver Function"
- Test: "Creatinine", Original Category: "Renal Function" → Standard Category: "Kidney Function"
- Test: "Sodium", Original Category: "Electrolytes" → Standard Category: "Electrolytes & Minerals"
- Test: "Glucose", Original Category: "Metabolic Panel" → Standard Category: "Blood Sugar & Metabolism"
- Test: "TSH", Original Category: "Thyroid Tests" → Standard Category: "Thyroid & Endocrine"
- Test: "Cholesterol", Original Category: "Lipid Panel" → Standard Category: "Lipids & Cardiovascular"
- Test: "Testosterone", Original Category: "Hormone Panel" → Standard Category: "Hormonal (Reproductive & Cortisol)"
- Test: "Troponin", Original Category: "Cardiac Tests" → Standard Category: "Cardiac Markers"
- Test: "PSA", Original Category: "Cancer Screening" → Standard Category: "Oncology Markers"
- Test: "Vitamin D", Original Category: "Vitamins" → Standard Category: "Micronutrients"
- Test: "Hemoglobin", Original Category: "CBC" → Standard Category: "Hematology"
- Test: "Calcium", Original Category: "Mineral Panel" → Standard Category: "Bone Health"

Return ONLY a JSON array with the same structure as input, but with standardized categories:
[
  {
    "test_name": "string",
    "category": "STANDARD_CATEGORY_NAME",
    "result": number,
    "reference_min": number | null,
    "reference_max": number | null,
    "status": "normal" | "high" | "low",
    "test_date": "YYYY-MM-DD"
  }
]`;

  try {
    console.log('=== Starting Category Mapping ===');
    console.log('Extracted tests to map:', extractedTests.length);
    
    const mappingResponse = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a medical expert specializing in laboratory test categorization."
        },
        {
          role: "user",
          content: categoryMappingPrompt + '\n\nEXTRACTED TESTS:\n' + JSON.stringify(extractedTests, null, 2)
        }
      ],
      temperature: 0.1,
      max_tokens: 4000
    });

    const mappingText = mappingResponse.choices[0]?.message?.content;
    if (!mappingText) {
      console.error('No response from category mapping AI');
      return extractedTests;
    }

    console.log('Category mapping response:', mappingText);
    const cleanedMappingJSON = extractJSON(mappingText);
    const mappedData = JSON.parse(cleanedMappingJSON);
    
    console.log('Category mapping completed. Mapped tests:', mappedData.length);
    
    return mappedData;
  } catch (error) {
    console.error('Error in category mapping:', error);
    // Return original data if mapping fails
    return extractedTests;
  }
}

// Fallback normalization for reference ranges
function normalizeReferenceRange(item: any): any {
  // If both are numbers, nothing to do
  if (typeof item.reference_min === 'number' && typeof item.reference_max === 'number') return item;
  // If both are null, nothing to do
  if (item.reference_min == null && item.reference_max == null) return item;

  // Try to parse from string if needed
  const rawRange = item.reference_range || item.reference || '';
  const minRaw = item.reference_min;
  const maxRaw = item.reference_max;

  // Helper to parse numbers
  const parseNum = (val: any): number | null => {
    if (typeof val === 'number') return val;
    if (typeof val === 'string') {
      const n = parseFloat(val.replace(/[^\d.\-]/g, ''));
      return isNaN(n) ? null : n;
    }
    return null;
  };

  // < or ≤
  if ((typeof minRaw === 'string' && /^<|≤/.test(minRaw)) || /^<|≤/.test(rawRange)) {
    const value = parseNum(maxRaw || minRaw || rawRange);
    return { ...item, reference_min: 0, reference_max: value };
  }
  // > or ≥
  if ((typeof minRaw === 'string' && /^>|≥/.test(minRaw)) || /^>|≥/.test(rawRange)) {
    const value = parseNum(maxRaw || minRaw || rawRange);
    return { ...item, reference_min: value, reference_max: null };
  }
  // Range 10-20
  if (/^\d+(\.\d+)?-\d+(\.\d+)?$/.test(rawRange)) {
    const [minStr, maxStr] = rawRange.split('-');
    return { ...item, reference_min: parseNum(minStr), reference_max: parseNum(maxStr) };
  }
  // N/A or missing
  if (/na|n\/a|notavailable|none/i.test(rawRange)) {
    return { ...item, reference_min: null, reference_max: null };
  }
  // If min/max are strings with numbers
  return {
    ...item,
    reference_min: parseNum(minRaw),
    reference_max: parseNum(maxRaw)
  };
}

app.get('/', (req, res) => {
  res.send('Hello World');
});

// Health check endpoint
app.get('/api/test', (req, res) => {
  res.json({
    status: 'success',
    message: 'Backend is working correctly!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

app.post('/api/parse-pdf', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      console.error('No file uploaded');
      return res.status(400).json({ error: 'No file uploaded' });
    }

    console.log('\n=== Starting PDF Processing ===');
    console.log('Received file:', {
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size + ' bytes',
      bufferLength: req.file.buffer.length + ' bytes'
    });

    // Convert the buffer to base64
    const base64String = req.file.buffer.toString('base64');

    try {
      const response = await openai.responses.create({
        model: "gpt-4.1",
        input: [
          {
            role: "user",
            content: [
              {
                type: "input_file",
                filename: req.file.originalname,
                file_data: `data:application/pdf;base64,${base64String}`,
              },
              {
                type: "input_text",
                text: USER_PROMPT,
              },
            ],
          },
        ],
      });

      try {
        console.log('Raw response:', response.output_text);
        const cleanedJSON = extractJSON(response.output_text);
        console.log('Cleaned JSON:', cleanedJSON);
        const parsedData = JSON.parse(cleanedJSON);

        // Step 2: Map categories to standardized categories using AI
        console.log('=== Step 2: Category Mapping ===');
        console.log('Original categories found:', [...new Set(parsedData.map((item: any) => item.category))]);
        const mappedData = await mapCategoriesToStandard(parsedData);
        console.log('Standardized categories applied:', [...new Set(mappedData.map((item: any) => item.category))]);
        
        // Add only the required additional fields and normalize reference ranges
        const transformedData = mappedData.map((item: any) => {
          const normalized = normalizeReferenceRange(item);
          
          // Log date extraction for debugging
          console.log(`Date extraction for ${item.test_name}:`, {
            original_date: item.test_date,
            type: typeof item.test_date,
            is_valid: item.test_date && /^\d{4}-\d{2}-\d{2}$/.test(item.test_date)
          });
          
          return {
            test: item.test_name,
            category: item.category, // Now using standardized category
            result: `${item.result}`,
            reference_min: normalized.reference_min !== null ? `${normalized.reference_min}` : null,
            reference_max: normalized.reference_max !== null ? `${normalized.reference_max}` : null,
            status: item.status,
            test_date: item.test_date,
            processed_by_ai: true,
            source_file_type: 'pdf'
          };
        });
        
        res.json({ 
          success: true,
          data: transformedData,
          debug: {
            fileInfo: {
              size: req.file.size,
              pages: 1,
              totalResults:transformedData.length
            }
          }
        });
      } catch (parseError) {
        console.error('Failed to parse JSON response:', parseError);
        res.status(500).json({ 
          success: false,
          error: 'Failed to parse results',
          rawResponse: response.output_text,
          parseError: parseError instanceof Error ? parseError.message : String(parseError)
        });
      }

    } catch (openaiError) {
      console.error('OpenAI API Error:', openaiError);
      res.status(500).json({ 
        success: false,
        error: 'Failed to process PDF with OpenAI',
        details: openaiError instanceof Error ? openaiError.message : 'Unknown error'
      });
    }
  } catch (err) {
    console.error('Error:', err);
    const errorMessage = err instanceof Error ? err.message : 'Failed to process PDF';
    res.status(500).json({ 
      success: false,
      error: errorMessage,
      details: err instanceof Error ? err.stack : undefined
    });
  }
});

// Export the Express API
export default app; 