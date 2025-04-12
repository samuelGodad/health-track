import express from 'express';
import multer from 'multer';
import cors from 'cors';
import OpenAI from 'openai';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import pdf from 'pdf-poppler';

dotenv.config();

const app = express();
const upload = multer();

app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `You are a medical lab report parser. Your task is to extract lab test results from PDF documents.
You must analyze the content and identify:
- Test names
- Test categories (e.g., Hormones, Lipids, etc.)
- Numerical values and units
- Reference ranges
- Whether results are normal, high, or low based on the reference ranges
- Test dates

You must respond with ONLY a JSON array in the specified format, with no additional text.`;

const USER_PROMPT = `Please analyze this lab report and extract all test results.
For each test result found, include:
1. The exact test name as shown
2. The appropriate category for the test
3. The numerical value and unit
4. The reference range exactly as shown
5. Whether the result is normal, high, or low
6. The test date if available (use the report date if individual test dates aren't shown)

Return the data in this exact JSON format:
[
  {
    "test": "Test Name",
    "category": "Test Category",
    "value": "Numerical Value",
    "unit": "Unit of Measurement",
    "reference_range": "Reference Range as Shown",
    "status": "normal/high/low",
    "date": "YYYY-MM-DD"
  }
]

Important:
- Include ALL test results found in the document
- Use EXACTLY the format shown
- Return ONLY the JSON array, no other text
- Determine status based on whether the value is within, above, or below the reference range`;

function tryParseJSON(text: string): { success: boolean; data?: any; error?: string } {
  try {
    // Remove any non-JSON content before the first [
    const jsonStart = text.indexOf('[');
    if (jsonStart === -1) {
      return { success: false, error: 'No JSON array found in response' };
    }
    const jsonEnd = text.lastIndexOf(']') + 1;
    const jsonString = text.slice(jsonStart, jsonEnd);
    const data = JSON.parse(jsonString);
    return { success: true, data };
  } catch (err) {
    return { success: false, error: 'Failed to parse response as JSON' };
  }
}

async function convertPdfToImages(pdfBuffer: Buffer): Promise<string[]> {
  const tempDir = os.tmpdir();
  const pdfPath = path.join(tempDir, `temp_${Date.now()}.pdf`);
  const outputDir = path.join(tempDir, `output_${Date.now()}`);
  
  // Write PDF to temporary file
  fs.writeFileSync(pdfPath, pdfBuffer);
  
  // Create output directory
  fs.mkdirSync(outputDir, { recursive: true });
  
  try {
    // Convert PDF to images using pdf-poppler
    const opts = {
      format: 'png',
      out_dir: outputDir,
      out_prefix: 'page',
      page: null // convert all pages
    };
    
    await pdf.convert(pdfPath, opts);
    
    // Read all generated PNG files
    const files = fs.readdirSync(outputDir);
    const base64Images: string[] = [];
    
    for (const file of files) {
      if (file.endsWith('.png')) {
        const imagePath = path.join(outputDir, file);
        const imageBuffer = fs.readFileSync(imagePath);
        const base64Image = imageBuffer.toString('base64');
        base64Images.push(`data:image/png;base64,${base64Image}`);
      }
    }
    
    return base64Images;
  } finally {
    // Clean up temporary files
    if (fs.existsSync(pdfPath)) fs.unlinkSync(pdfPath);
    if (fs.existsSync(outputDir)) {
      const files = fs.readdirSync(outputDir);
      for (const file of files) {
        fs.unlinkSync(path.join(outputDir, file));
      }
      fs.rmdirSync(outputDir);
    }
  }
}

app.post('/api/parse-pdf', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    console.log('Received file:', {
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size + ' bytes'
    });

    try {
      // Convert PDF to images
      console.log('Converting PDF to images...');
      const base64Images = await convertPdfToImages(req.file.buffer);
      console.log(`Converted PDF to ${base64Images.length} images`);

      // Process each page with GPT-4 Vision
      const allResults: any[] = [];
      
      for (const base64Image of base64Images) {
        console.log('Sending request to GPT-4 Vision...');
        const completion = await openai.chat.completions.create({
          model: 'gpt-4o',
          messages: [
            {
              role: 'system',
              content: SYSTEM_PROMPT
            },
            {
              role: 'user',
              content: [
                { type: 'text', text: USER_PROMPT },
                {
                  type: 'image_url',
                  image_url: {
                    url: base64Image,
                  }
                }
              ]
            }
          ],
          max_tokens: 4096
        });

        const responseText = completion.choices[0].message?.content || '[]';
        console.log('Raw GPT Response:', responseText);

        const parseResult = tryParseJSON(responseText);
        if (parseResult.success) {
          allResults.push(...parseResult.data);
        }
      }

      // Combine results from all pages
      res.json({ 
        data: allResults,
        debug: {
          fileInfo: {
            size: req.file.size,
            pages: base64Images.length
          }
        }
      });
    } catch (err) {
      console.error('OpenAI API Error:', err);
      throw err;
    }
  } catch (err) {
    console.error('Error:', err);
    const errorMessage = err instanceof Error ? err.message : 'Failed to process PDF';
    res.status(500).json({ 
      error: errorMessage,
      details: err instanceof Error ? err.stack : undefined
    });
  }
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 