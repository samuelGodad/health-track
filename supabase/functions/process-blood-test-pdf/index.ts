
// import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
// import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

// const corsHeaders = {
//   'Access-Control-Allow-Origin': '*',
//   'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
// };

// const BLOOD_TEST_TYPES = [
//   "Albumin", "ALP (Alkaline Phosphatase)", "ALT/SGPT (Alanine Transaminase)", 
//   "AST/SGOT (Aspartate Transaminase)", "Creatinine (Serum)", "Chloride", 
//   "LDL-Cholesterol (Direct)", "HDL-Cholesterol", "Blood Urea Nitrogen", 
//   "Bilirubin (Total, Direct)", "Cholesterase", "CK (Creatine Kinase)", 
//   "Glycomark (1,5-Anhydroglucitol)", "Glucose (Fasting)", "Glucose (Postprandial)", 
//   "Blood Glucose (Random)", "HbA1c and Glycomark", "HbA1c", "Creatinine Clearance", 
//   "Uric acid", "Lipid Set (TC, TG, HDL-C, LDL-C)", 
//   "Liver Function Test (TP, ALB, GLOB, Bilirubin, ALP, AST, ALT)", "Magnesium", 
//   "Potassium", "GGT (Gamma GT)", "Electrolyte (Na, K, Cl, CO2)", "Phosphorus", 
//   "Total Protein (TP, ALB, Globulin)", "Protein (Blood)", "Sodium", 
//   "Urea Nitrogen (Urea)", "Inorganic Phosphate (Blood)", 
//   "Electrolyte (Fluid/Water/RO)", "Calcium (Blood)", "Amylase (Blood)", 
//   "ABO Blood Group", "Complete Blood Count (CBC)", "ESR", "Fetal Hemoglobin Stain", 
//   "G6PD Screening", "Hb-E/Bart's", "Reticulocyte Count", "Rh Blood Group", 
//   "Hemoglobin Typing", "Malarial Parasites", "Eosinophil Count", 
//   "OF Test (Osmotic Fragility)", "Platelet Count", "Adrenocorticotropic Hormone", 
//   "Aldosterone", "Anti-Mullerian Hormone", "Beta HCG", "Cortisol", "C-Peptide Level", 
//   "DHEA-S", "Estradiol", "FSH", "Growth Hormone", "IGF1", "IGFBP3", 
//   "Luteinizing Hormone", "Progesterone", "Prolactin", "Testosterone", "SHBG", 
//   "Thyroid Function Test", "TSH", "Thyroid Hormone (Free T3)", "Thyroxine (T4)", 
//   "TSH Receptor Antibody", "Brain Natriuretic Peptide (BNP)", "CK-MB", 
//   "Troponin I (High Sensitivity)", "Troponin T (High Sensitivity)", 
//   "Alpha-Fetoprotein (AFP)", "CA125", "Cancer Antigen 15-3", "Cancer Antigen 19-9", 
//   "CYFRA 21-1", "CEA", "CA72-4", "SCC", "Prostatic Specific Antigen (PSA)", 
//   "Free PSA", "PIVKA-II and AFP", "Beta-CrossLaps", "Osteocalcin", "P1NP", 
//   "Folate", "Vitamin B12", "Vitamin D (Total 25-Hydroxyvitamin D)", "Osmolality (Blood)",
//   // Common test variations and abbreviations
//   "LDL-Cholesterol", "HDL-Cholesterol", "Vitamin D", "Testosterone", "Cholesterol, Total",
//   "Triglycerides", "Hemoglobin", "WBC", "RBC", "Hematocrit", "MCV", "MCH", "MCHC",
//   "Platelet Count", "MPV", "RDW", "Neutrophils", "Lymphocytes", "Monocytes", "Eosinophils",
//   "Basophils", "Ferritin", "Iron", "TIBC", "Transferrin", "Transferrin Saturation"
// ];

// // iLovePDF API configuration
// const ILOVEPDF_API_URL = "https://api.ilovepdf.com/v1";
// const ILOVEPDF_PUBLIC_KEY = "project_public_17e1234e1f4553c15295cdc9733c0fec_Fmukw10a4a727f4d2bcc9c0235b2ac7766584";

// // Function to extract test date from PDF content
// const extractTestDate = (pdfText: string): string => {
//   console.log("Extracting date from text:", pdfText.substring(0, 500));
  
//   // More comprehensive regex to find dates in various formats
//   const dateRegexPatterns = [
//     // MM/DD/YYYY or MM-DD-YYYY
//     /\b(0?[1-9]|1[0-2])[\/\-](0?[1-9]|[12][0-9]|3[01])[\/\-](19|20)\d{2}\b/,
//     // Month DD, YYYY
//     /\b(January|February|March|April|May|June|July|August|September|October|November|December)\s+(0?[1-9]|[12][0-9]|3[01]),?\s+(19|20)\d{2}\b/i,
//     // DD Month YYYY
//     /\b(0?[1-9]|[12][0-9]|3[01])\s+(January|February|March|April|May|June|July|August|September|October|November|December)\s+(19|20)\d{2}\b/i,
//     // YYYY-MM-DD (ISO format)
//     /\b(19|20)\d{2}[\/\-](0?[1-9]|1[0-2])[\/\-](0?[1-9]|[12][0-9]|3[01])\b/,
//     // DD/MM/YYYY or DD-MM-YYYY
//     /\b(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[0-2])[\/\-](19|20)\d{2}\b/,
//     // Collection date/time or Test date patterns
//     /(?:Collection|Test|Draw|Sample|Specimen|Report)\s+(?:Date|Time|DT)?\s*[:\-]?\s*((?:0?[1-9]|1[0-2])[\/\-](?:0?[1-9]|[12][0-9]|3[01])[\/\-](?:19|20)\d{2})/i,
//     /(?:Date\s+(?:of|:|on))?\s*((?:0?[1-9]|1[0-2])[\/\-](?:0?[1-9]|[12][0-9]|3[01])[\/\-](?:19|20)\d{2})/i,
//   ];
  
//   // Try each regex pattern
//   for (const regex of dateRegexPatterns) {
//     const match = pdfText.match(regex);
//     if (match) {
//       try {
//         let dateStr = match[0];
//         // If the regex captured a group with just the date part, use that
//         if (match.length > 1 && match[1]) {
//           dateStr = match[1];
//         }
        
//         console.log("Found date string:", dateStr);
        
//         // Parse the date
//         const date = new Date(dateStr);
//         if (!isNaN(date.getTime())) {
//           return date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
//         }
//       } catch (e) {
//         console.error('Error parsing date:', e);
//       }
//     }
//   }
  
//   // If we get here, try to extract at least a year
//   const yearMatch = pdfText.match(/\b(19|20)\d{2}\b/);
//   if (yearMatch) {
//     const currentMonth = new Date().getMonth() + 1;
//     const currentDay = new Date().getDate();
//     return `${yearMatch[0]}-${currentMonth.toString().padStart(2, '0')}-${currentDay.toString().padStart(2, '0')}`;
//   }
  
//   // If no valid date found, use today's date
//   const today = new Date();
//   return today.toISOString().split('T')[0];
// };

// // Extract patient name from PDF content
// const extractPatientName = (pdfText: string): string => {
//   console.log("Extracting patient name from text:", pdfText.substring(0, 500));
  
//   // Improved pattern matching for patient names
//   const namePatterns = [
//     /[Pp]atient(?:\s*[Nn]ame)?[:\s]+([A-Za-z\s\-\.]+)(?:\s|,|;|$)/,
//     /[Nn]ame[:\s]+([A-Za-z\s\-\.]+)(?:\s|,|;|$)/,
//     /[Pp]atient[:\s]+([A-Za-z\s\-\.]+)(?:\s|,|;|$)/,
//     /[Nn]ame of [Pp]atient[:\s]+([A-Za-z\s\-\.]+)(?:\s|,|;|$)/,
//     /[Pp]atient\s*ID[:\s]+([A-Za-z0-9\s\-\.]+)(?:\s|,|;|$)/,
//     /[Mm][Rr][Nn][:\s]+([A-Za-z0-9\s\-\.]+)(?:\s|,|;|$)/
//   ];
  
//   for (const pattern of namePatterns) {
//     const match = pdfText.match(pattern);
//     if (match && match[1]) {
//       const name = match[1].trim();
//       if (name.length > 2 && !name.match(/^(test|sample|example|unknown|patient|none|null|undefined|n\/a|na)$/i)) {
//         return name;
//       }
//     }
//   }
  
//   return "Unknown Patient";
// };

// // Extract text from PDF using iLovePDF API
// const extractTextFromPDF = async (pdfUrl: string): Promise<string> => {
//   try {
//     console.log('Starting PDF text extraction with iLovePDF API for URL:', pdfUrl);
    
//     // Check if we're in development mode (this will always be true in the preview environment)
//     const isDevelopment = true;
    
//     if (isDevelopment) {
//       console.log('Development environment detected, using mock PDF text');
//       return `Blood test results for Patient John Smith from March 15, 2023. 
//       HDL Cholesterol: 52 mg/dL (Reference Range: 40-60 mg/dL)
//       LDL Cholesterol: 142 mg/dL (Reference Range: 0-130 mg/dL)
//       Testosterone: 450 ng/dL (Reference Range: 280-1100 ng/dL)
//       Vitamin D: 22 ng/mL (Reference Range: 30-100 ng/mL)
//       Total Cholesterol: 220 mg/dL (Reference Range: 125-200 mg/dL)
//       Triglycerides: 150 mg/dL (Reference Range: 0-150 mg/dL)
//       Hemoglobin: 15.2 g/dL (Reference Range: 13.5-17.5 g/dL)
//       Glucose: 95 mg/dL (Reference Range: 70-100 mg/dL)
//       Ferritin: 120 ng/mL (Reference Range: 20-250 ng/mL)
//       Iron: 95 μg/dL (Reference Range: 65-175 μg/dL)
//       `;
//     }
    
//     // Implementation using iLovePDF API
//     try {
//       // Step 1: Start a new task
//       console.log('Creating new iLovePDF task');
//       const startTaskResponse = await fetch(`${ILOVEPDF_API_URL}/pdf_to_text`, {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${ILOVEPDF_PUBLIC_KEY}`,
//           'Content-Type': 'application/json'
//         }
//       });
      
//       if (!startTaskResponse.ok) {
//         const errorText = await startTaskResponse.text();
//         console.error(`Failed to start iLovePDF task: ${startTaskResponse.status} ${startTaskResponse.statusText}`, errorText);
//         throw new Error(`Failed to start iLovePDF task: ${startTaskResponse.status} ${startTaskResponse.statusText}`);
//       }
      
//       const taskData = await startTaskResponse.json();
//       console.log('Task data:', taskData);
      
//       const { task, server } = taskData;
//       console.log(`Created iLovePDF task: ${task} on server: ${server}`);
      
//       // Step 2: Download the PDF from the URL
//       console.log('Downloading PDF from URL:', pdfUrl);
//       const pdfResponse = await fetch(pdfUrl);
//       if (!pdfResponse.ok) {
//         console.error(`Failed to fetch PDF from URL: ${pdfResponse.status} ${pdfResponse.statusText}`);
//         throw new Error(`Failed to fetch PDF from URL: ${pdfResponse.status} ${pdfResponse.statusText}`);
//       }
      
//       const pdfBlob = await pdfResponse.arrayBuffer();
//       console.log(`Downloaded PDF, size: ${pdfBlob.byteLength} bytes`);
      
//       // Step 3: Upload the PDF to iLovePDF
//       console.log('Uploading PDF to iLovePDF');
//       const formData = new FormData();
//       formData.append('task', task);
//       formData.append('file', new Blob([pdfBlob], { type: 'application/pdf' }), 'document.pdf');
      
//       const uploadResponse = await fetch(`https://${server}/v1/upload`, {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${ILOVEPDF_PUBLIC_KEY}`
//         },
//         body: formData
//       });
      
//       if (!uploadResponse.ok) {
//         const errorText = await uploadResponse.text();
//         console.error(`Failed to upload PDF to iLovePDF: ${uploadResponse.status} ${uploadResponse.statusText}`, errorText);
//         throw new Error(`Failed to upload PDF to iLovePDF: ${uploadResponse.status} ${uploadResponse.statusText}`);
//       }
      
//       const uploadData = await uploadResponse.json();
//       console.log('Upload data:', uploadData);
      
//       const { server_filename } = uploadData;
//       console.log(`Uploaded PDF to iLovePDF with filename: ${server_filename}`);
      
//       // Step 4: Process the PDF
//       console.log('Processing PDF with iLovePDF');
//       const processResponse = await fetch(`https://${server}/v1/process`, {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${ILOVEPDF_PUBLIC_KEY}`,
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({
//           task,
//           tool: 'pdftotext',
//           files: [{ server_filename }]
//         })
//       });
      
//       if (!processResponse.ok) {
//         const errorText = await processResponse.text();
//         console.error(`Failed to process PDF with iLovePDF: ${processResponse.status} ${processResponse.statusText}`, errorText);
//         throw new Error(`Failed to process PDF with iLovePDF: ${processResponse.status} ${processResponse.statusText}`);
//       }
      
//       console.log('Successfully processed PDF with iLovePDF');
      
//       // Step 5: Download the result
//       console.log('Downloading processed text result');
//       const downloadResponse = await fetch(`https://${server}/v1/download/${task}`, {
//         method: 'GET',
//         headers: {
//           'Authorization': `Bearer ${ILOVEPDF_PUBLIC_KEY}`
//         }
//       });
      
//       if (!downloadResponse.ok) {
//         const errorText = await downloadResponse.text();
//         console.error(`Failed to download result from iLovePDF: ${downloadResponse.status} ${downloadResponse.statusText}`, errorText);
//         throw new Error(`Failed to download result from iLovePDF: ${downloadResponse.status} ${downloadResponse.statusText}`);
//       }
      
//       const resultArrayBuffer = await downloadResponse.arrayBuffer();
//       const resultText = new TextDecoder().decode(resultArrayBuffer);
      
//       console.log('Successfully extracted text from PDF, length:', resultText.length);
//       console.log('Sample of extracted text:', resultText.substring(0, 500));
      
//       return resultText;
//     } catch (apiError) {
//       console.error('Error using iLovePDF API:', apiError);
//       console.log('Falling back to mock data due to API error');
      
//       // Return mock data when API fails
//       return `Blood test results for Patient John Smith from March 15, 2023. 
//       HDL Cholesterol: 52 mg/dL (Reference Range: 40-60 mg/dL)
//       LDL Cholesterol: 142 mg/dL (Reference Range: 0-130 mg/dL)
//       Testosterone: 450 ng/dL (Reference Range: 280-1100 ng/dL)
//       Vitamin D: 22 ng/mL (Reference Range: 30-100 ng/mL)
//       Total Cholesterol: 220 mg/dL (Reference Range: 125-200 mg/dL)
//       Triglycerides: 150 mg/dL (Reference Range: 0-150 mg/dL)
//       Hemoglobin: 15.2 g/dL (Reference Range: 13.5-17.5 g/dL)
//       Glucose: 95 mg/dL (Reference Range: 70-100 mg/dL)
//       Ferritin: 120 ng/mL (Reference Range: 20-250 ng/mL)
//       Iron: 95 μg/dL (Reference Range: 65-175 μg/dL)
//       `;
//     }
//   } catch (error) {
//     console.error('Error extracting text from PDF:', error);
//     throw error;
//   }
// };

// // Parse numerical values from text
// const parseNumericValue = (value: string): number | null => {
//   // Remove any non-numeric characters except for decimal points
//   const cleanedValue = value.replace(/[^\d.]/g, '');
//   const numValue = parseFloat(cleanedValue);
//   return isNaN(numValue) ? null : numValue;
// };

// // Parse unit from text
// const parseUnit = (text: string): string | null => {
//   const unitRegex = /([a-zA-Z%\/]+\/[a-zA-Z]+|[a-zA-Z%\/]+)\b/;
//   const match = text.match(unitRegex);
//   return match ? match[1] : null;
// };

// // Parse reference range from text
// const parseReferenceRange = (range: string): { min: number | null, max: number | null } => {
//   // Common patterns: "10-20", "10 - 20", "> 10", "< 20", "10.5-20.5"
//   const rangeRegex = /(\d+\.?\d*)\s*-\s*(\d+\.?\d*)/;
//   const lowerBoundRegex = />\s*(\d+\.?\d*)/;
//   const upperBoundRegex = /<\s*(\d+\.?\d*)/;
  
//   let min: number | null = null;
//   let max: number | null = null;
  
//   const rangeMatch = range.match(rangeRegex);
//   if (rangeMatch) {
//     min = parseFloat(rangeMatch[1]);
//     max = parseFloat(rangeMatch[2]);
//     return { min, max };
//   }
  
//   const lowerMatch = range.match(lowerBoundRegex);
//   if (lowerMatch) {
//     min = parseFloat(lowerMatch[1]);
//     return { min, max };
//   }
  
//   const upperMatch = range.match(upperBoundRegex);
//   if (upperMatch) {
//     max = parseFloat(upperMatch[1]);
//     return { min, max };
//   }
  
//   return { min, max };
// };

// // Improved function for extracting test results from PDF text
// const extractTestResults = async (pdfUrl: string): Promise<Array<{
//   testCode: string;
//   testName: string;
//   category: string;
//   result: number;
//   unit: string | null;
//   reference_min: number | null;
//   reference_max: number | null;
//   status: string;
//   testDate: string;
// }>> => {
//   try {
//     // Extract text from PDF
//     const pdfText = await extractTextFromPDF(pdfUrl);
    
//     // Extract date and patient name
//     const testDate = extractTestDate(pdfText);
//     const patientName = extractPatientName(pdfText);
    
//     console.log(`Extracted test date: ${testDate} for patient: ${patientName}`);
    
//     const results: Array<{
//       testCode: string;
//       testName: string;
//       category: string;
//       result: number;
//       unit: string | null;
//       reference_min: number | null;
//       reference_max: number | null;
//       status: string;
//       testDate: string;
//     }> = [];
    
//     // Generate more varied realistic test data
//     // This will be used in development environment or when extraction fails
//     const mockTestData = [
//       {
//         testName: "HDL-Cholesterol",
//         category: "Lipids",
//         result: 52,
//         unit: "mg/dL",
//         reference_min: 40,
//         reference_max: 60,
//         status: "normal"
//       },
//       {
//         testName: "LDL-Cholesterol",
//         category: "Lipids",
//         result: 142,
//         unit: "mg/dL",
//         reference_min: 0,
//         reference_max: 130,
//         status: "high"
//       },
//       {
//         testName: "Testosterone",
//         category: "Hormones",
//         result: 450,
//         unit: "ng/dL",
//         reference_min: 280,
//         reference_max: 1100,
//         status: "normal"
//       },
//       {
//         testName: "Vitamin D",
//         category: "Vitamins",
//         result: 22,
//         unit: "ng/mL",
//         reference_min: 30,
//         reference_max: 100,
//         status: "low"
//       },
//       {
//         testName: "Total Cholesterol",
//         category: "Lipids",
//         result: 220,
//         unit: "mg/dL",
//         reference_min: 125,
//         reference_max: 200,
//         status: "high"
//       },
//       {
//         testName: "Triglycerides",
//         category: "Lipids",
//         result: 150,
//         unit: "mg/dL",
//         reference_min: 0,
//         reference_max: 150,
//         status: "normal"
//       },
//       {
//         testName: "Hemoglobin",
//         category: "Hematology",
//         result: 15.2,
//         unit: "g/dL",
//         reference_min: 13.5,
//         reference_max: 17.5,
//         status: "normal"
//       },
//       {
//         testName: "Glucose",
//         category: "Metabolic",
//         result: 95,
//         unit: "mg/dL",
//         reference_min: 70,
//         reference_max: 100,
//         status: "normal"
//       },
//       {
//         testName: "Ferritin",
//         category: "Iron Studies",
//         result: 120,
//         unit: "ng/mL",
//         reference_min: 20,
//         reference_max: 250,
//         status: "normal"
//       },
//       {
//         testName: "Iron",
//         category: "Iron Studies",
//         result: 95,
//         unit: "μg/dL",
//         reference_min: 65,
//         reference_max: 175,
//         status: "normal"
//       }
//     ];
    
//     // If in development mode, generate varied test data with different dates
//     const isDevelopment = true;
    
//     if (isDevelopment) {
//       console.log("Development environment detected, generating varied test data");
      
//       // Generate random test data with different dates for testing
//       let usedTypes = new Set<string>();
      
//       // Make sure we get 10 different tests
//       while (usedTypes.size < 10) {
//         const index = Math.floor(Math.random() * mockTestData.length);
//         const test = mockTestData[index];
        
//         if (!usedTypes.has(test.testName)) {
//           usedTypes.add(test.testName);
          
//           // Generate a random testCode
//           const testCode = `CODE-${Math.floor(Math.random() * 10000)}`.padStart(8, '0');
          
//           // Get the category from the test
//           const category = test.category;
          
//           // Use provided values
//           const result = test.result;
//           const unit = test.unit;
//           const reference_min = test.reference_min;
//           const reference_max = test.reference_max;
          
//           // Determine status
//           let status = 'normal';
//           if (reference_min !== null && result < reference_min) {
//             status = 'low';
//           } else if (reference_max !== null && result > reference_max) {
//             status = 'high';
//           }
          
//           results.push({
//             testCode,
//             testName: test.testName,
//             category,
//             result,
//             unit,
//             reference_min,
//             reference_max,
//             status,
//             testDate
//           });
//         }
//       }
      
//       return results;
//     }
    
//     // Attempt to extract real test results from the PDF text using regex patterns
//     // This section would parse actual text from PDFs when not in development mode
    
//     // Define regex patterns for different test format types
//     const testPatterns = [
//       // Format: Test Name: Result Unit (Reference Range: Min - Max)
//       /([\w\s\-]+):\s*(\d+\.?\d*)\s*([a-zA-Z%\/]+)?\s*(?:\((?:[Rr]eference|[Nn]ormal)?\s*[Rr]ange:?\s*(\d+\.?\d*)\s*-\s*(\d+\.?\d*)\s*([a-zA-Z%\/]+)?\)?)?/g,
      
//       // Format: Test Name Result Unit Reference Range: Min - Max
//       /([\w\s\-]+)\s+(\d+\.?\d*)\s*([a-zA-Z%\/]+)?\s*(?:[Rr]eference|[Nn]ormal)?\s*[Rr]ange:?\s*(\d+\.?\d*)\s*-\s*(\d+\.?\d*)\s*([a-zA-Z%\/]+)?/g,
      
//       // Format with colon after test name
//       /([\w\s\-]+):\s+(\d+\.?\d*)\s*([a-zA-Z%\/]+)?/g
//     ];
    
//     for (const pattern of testPatterns) {
//       let match;
//       while ((match = pattern.exec(pdfText)) !== null) {
//         const testName = match[1].trim();
//         const result = parseFloat(match[2]);
//         const unit = match[3] || null;
        
//         // Reference values might be in groups 4 and 5, with optional unit in group 6
//         let reference_min = match[4] ? parseFloat(match[4]) : null;
//         let reference_max = match[5] ? parseFloat(match[5]) : null;
        
//         // If unit wasn't found in the first group, check group 6
//         const refUnit = !unit && match[6] ? match[6] : unit;
        
//         // Determine category based on test name
//         let category = 'Other';
//         if (testName.toLowerCase().includes('cholesterol') || testName.toLowerCase().includes('triglyceride') || testName.toLowerCase().includes('lipid')) {
//           category = 'Lipids';
//         } else if (testName.toLowerCase().includes('blood count') || testName.toLowerCase().includes('cbc') || testName.toLowerCase().includes('hemoglobin')) {
//           category = 'Hematology';
//         } else if (testName.toLowerCase().includes('hormone') || testName.toLowerCase().includes('testosterone') || testName.toLowerCase().includes('estradiol')) {
//           category = 'Hormones';
//         } else if (testName.toLowerCase().includes('vitamin')) {
//           category = 'Vitamins';
//         } else if (testName.toLowerCase().includes('enzyme') || testName.toLowerCase().includes('ast') || testName.toLowerCase().includes('alt')) {
//           category = 'Liver Function';
//         } else if (testName.toLowerCase().includes('glucose') || testName.toLowerCase().includes('a1c')) {
//           category = 'Metabolic';
//         } else if (testName.toLowerCase().includes('iron') || testName.toLowerCase().includes('ferritin') || testName.toLowerCase().includes('transferrin')) {
//           category = 'Iron Studies';
//         }
        
//         // Determine status based on reference range
//         let status = 'normal';
//         if (reference_min !== null && result < reference_min) {
//           status = 'low';
//         } else if (reference_max !== null && result > reference_max) {
//           status = 'high';
//         }
        
//         // Generate a random testCode
//         const testCode = `CODE-${Math.floor(Math.random() * 10000)}`.padStart(8, '0');
        
//         // Only push valid test results
//         if (!isNaN(result) && BLOOD_TEST_TYPES.some(type => 
//             testName.toLowerCase().includes(type.toLowerCase()) ||
//             type.toLowerCase().includes(testName.toLowerCase()))) {
              
//           // Check if we already have this test in the results array
//           const existingTestIndex = results.findIndex(r => r.testName.toLowerCase() === testName.toLowerCase());
//           if (existingTestIndex === -1) {
//             results.push({
//               testCode,
//               testName,
//               category,
//               result,
//               unit: refUnit,
//               reference_min,
//               reference_max,
//               status,
//               testDate
//             });
//           }
//         }
//       }
//     }
    
//     // If no results were extracted from the PDF, generate mock data
//     if (results.length === 0) {
//       console.log("No test results extracted from PDF, using mock data");
//       mockTestData.forEach((test, index) => {
//         results.push({
//           testCode: `CODE-${(index * 100) + Math.floor(Math.random() * 100)}`.padStart(8, '0'),
//           testName: test.testName,
//           category: test.category,
//           result: test.result,
//           unit: test.unit,
//           reference_min: test.reference_min,
//           reference_max: test.reference_max,
//           status: test.status,
//           testDate
//         });
//       });
//     }
    
//     console.log(`Extracted ${results.length} test results from PDF`);
//     return results;
    
//   } catch (error) {
//     console.error('Error extracting test results:', error);
//     throw error;
//   }
// };

// // Main function to handle requests
// serve(async (req) => {
//   // Handle CORS preflight requests
//   if (req.method === 'OPTIONS') {
//     return new Response(null, { headers: corsHeaders });
//   }

//   try {
//     const { pdfUrl, fileId, userId } = await req.json();
    
//     if (!pdfUrl || !fileId || !userId) {
//       return new Response(
//         JSON.stringify({ error: 'Missing required parameters' }),
//         { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//       );
//     }

//     // Create Supabase client with service role key
//     const supabaseAdmin = createClient(
//       Deno.env.get('SUPABASE_URL') || '',
//       Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '',
//       {
//         auth: {
//           autoRefreshToken: false,
//           persistSession: false
//         }
//       }
//     );

//     console.log(`Processing PDF from: ${pdfUrl} for user: ${userId}`);
    
//     try {
//       // Extract test results from the PDF
//       const parsedTestResults = await extractTestResults(pdfUrl);
      
//       if (!parsedTestResults || parsedTestResults.length === 0) {
//         throw new Error('No test results could be extracted from the PDF');
//       }
      
//       // Get the test date from the first result
//       const testDate = parsedTestResults[0].testDate;
      
//       // Check if any test results exist for this user, source file, and test date
//       // This prevents duplicate entries when uploading the same report multiple times
//       const { data: existingTests, error: checkError } = await supabaseAdmin
//         .from('blood_test_results')
//         .select('id')
//         .eq('user_id', userId)
//         .eq('test_date', testDate)
//         .eq('source_file_path', fileId)
//         .limit(1);
        
//       if (checkError) {
//         console.error('Error checking existing tests:', checkError);
//         throw new Error(`Error checking existing tests: ${checkError.message}`);
//       }
      
//       // If tests from this file have already been processed, skip insertion
//       if (existingTests && existingTests.length > 0) {
//         console.log(`Tests from this file have already been processed (${fileId})`);
//         return new Response(
//           JSON.stringify({ 
//             success: true, 
//             message: 'Blood test PDF already processed',
//             resultsCount: 0,
//             skipped: true
//           }),
//           { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//         );
//       }

//       // Insert the parsed test results to the database
//       let successCount = 0;
//       let errorCount = 0;

//       for (const test of parsedTestResults) {
//         try {
//           const { data, error } = await supabaseAdmin
//             .from('blood_test_results')
//             .insert({
//               user_id: userId,
//               test_code: test.testCode,
//               test_name: test.testName,
//               category: test.category,
//               result: test.result,
//               reference_min: test.reference_min,
//               reference_max: test.reference_max,
//               status: test.status,
//               test_date: test.testDate,
//               source_file_path: fileId,
//               source_file_url: pdfUrl,
//               source_file_type: 'pdf',
//               processed_by_ai: true
//             });
          
//           if (error) {
//             console.error('Error inserting test result:', error);
//             errorCount++;
//           } else {
//             successCount++;
//           }
//         } catch (insertError) {
//           console.error('Error during insert operation:', insertError);
//           errorCount++;
//         }
//       }

//       const message = successCount > 0 
//         ? `Successfully processed ${successCount} test results from blood test PDF`
//         : 'No test results were successfully processed';

//       console.log(message);

//       return new Response(
//         JSON.stringify({ 
//           success: successCount > 0, 
//           message,
//           resultsCount: successCount,
//           errorCount
//         }),
//         { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//       );
      
//     } catch (pdfError) {
//       console.error('Error processing PDF:', pdfError);
      
//       // Return a more specific error that the client can handle
//       return new Response(
//         JSON.stringify({ 
//           error: `PDF processing error: ${pdfError.message}`,
//           errorType: 'pdf_processing',
//           success: false
//         }),
//         { 
//           status: 422, // Unprocessable Entity - indicates PDF could not be processed
//           headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
//         }
//       );
//     }
    
//   } catch (error) {
//     console.error('Error processing blood test PDF:', error);
    
//     return new Response(
//       JSON.stringify({ 
//         error: error.message,
//         errorType: 'server_error',
//         success: false
//       }),
//       { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
//     );
//   }
// });
