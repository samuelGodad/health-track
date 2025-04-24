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

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
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

const SYSTEM_PROMPT = `You are a medical lab report parser. Your task is to extract lab test results from PDF documents.
You must analyze the content and identify:
- Test names (exactly as shown in the report)
- Test categories
- Numerical results
- Reference ranges
- Test status (normal/high/low)
- Test dates

You must return a JSON array where each test result has these EXACT field names:
- test_name (string): The exact name of the test as shown in the report
- category (string): The test category (e.g., "Complete Blood Count", "Lipid Profile")
- result (number): The numerical result value
- reference_min (number or null): The minimum reference value if available
- reference_max (number or null): The maximum reference value if available
- status (string): Must be exactly "normal", "high", or "low"
- test_date (string): In YYYY-MM-DD format`;

const USER_PROMPT = `Analyze this lab report and extract all test results.
Return ONLY a JSON array where each object has these exact fields:
{
  "test_name": string,    // Exact test name from report
  "category": string,     // Test category
  "result": number,       // Numerical result value
  "reference_min": number | null,  // Min reference value or null
  "reference_max": number | null,  // Max reference value or null
  "status": "normal" | "high" | "low",  // Result status
  "test_date": "YYYY-MM-DD"  // Test date
}

Important:
- test_name must not be null
- result must be a number
- status must be exactly "normal", "high", or "low"
- For reference ranges like "<5", set reference_max to 5 and reference_min to null
- For reference ranges like ">10", set reference_min to 10 and reference_max to null
- For ranges like "10-20", set reference_min to 10 and reference_max to 20`;

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

        // Add only the required additional fields
        const transformedData = parsedData.map((item: any) => ({
          test: item.test_name,
          category: item.category,
          result: `${item.result}`,
          reference_min: item.reference_min !== null ? `${item.reference_min}` : null,
          reference_max: item.reference_max !== null ? `${item.reference_max}` : null,
          status: item.status,
          test_date: item.test_date,
          processed_by_ai: true,
          source_file_type: 'pdf'
         
        }));
        
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