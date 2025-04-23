# Enhanced Health - PDF Parsing Guide

This guide explains how to run and test the PDF parsing functionality for blood test results in the Enhanced Health application.

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v16 or higher)
- npm or yarn
- OpenAI API key (for GPT-4 Vision API)

## Project Structure

```
enhanced-health/
├── server/              # Backend server for PDF processing
├── src/                 # Frontend application
└── supabase/           # Supabase configuration and functions
```

## Setting Up the Environment

1. Clone the repository:
```bash
git clone <repository-url>
cd enhanced-health
```

2. Install dependencies for both frontend and backend:
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
```

3. Create a `.env` file in the server directory with your OpenAI API key:
```env
OPENAI_API_KEY=your_openai_api_key_here
```

## Running the Application

1. Start the backend server:
```bash
cd server
npm start
```
The server will start on `http://localhost:3000`

2. Start the frontend development server:
```bash
cd ..  # Return to project root
npm run dev
```
The frontend will start on `http://localhost:8000`

## Testing PDF Parsing

### 1. Upload a PDF

1. Navigate to the Blood Tests page in the application
2. Click the "Upload Test Results" button
3. Select a blood test PDF file from your computer

### 2. Processing Flow

The PDF processing follows these steps:
1. The PDF is uploaded to the server
2. The server converts the PDF to images using `pdf-poppler`
3. Each image is sent to GPT-4 Vision for analysis
4. The AI extracts test results and returns them in JSON format
5. Results are saved to the database and displayed in the UI

### 3. Expected Results

After successful processing, you should see:
- A list of extracted test results
- Test names, values, and reference ranges
- Status indicators (normal/high/low)
- Test dates

### 4. Troubleshooting

If you encounter issues:

1. Check the server console for error messages
2. Verify your OpenAI API key is valid
3. Ensure the PDF file is:
   - A valid PDF document
   - Contains readable text
   - Has clear test results
   - Is not password protected

## Development Tips

1. **Testing Different PDF Formats**
   - Try various blood test report formats
   - Test with different layouts and structures
   - Verify handling of different units and reference ranges

2. **Monitoring Processing**
   - Watch the server console for processing logs
   - Check the browser console for frontend errors
   - Monitor the AI response quality

3. **Improving Results**
   - If results are inaccurate, try:
     - Using higher quality PDFs
     - Adjusting the AI prompt in `server/index.ts`
     - Modifying the image conversion settings

## API Endpoints

- `POST /api/parse-pdf`: Main endpoint for PDF processing
  - Accepts multipart form data with a PDF file
  - Returns JSON with extracted test results

## Dependencies

- Frontend:
  - React
  - Supabase Client
  - UI Components

- Backend:
  - Express
  - pdf-poppler
  - OpenAI API
  - Multer (for file uploads)

