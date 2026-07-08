const fs = require('fs');
const pdfParse = require('pdf-parse');
const { cleanText } = require('./utils/textCleaner');
const { extractStructuredData } = require('./utils/resumeExtractor');

const run = async () => {
  const files = ['uploads/file-1783174474358-188015434.pdf', 'uploads/file-1783174467246-536519088.pdf'];
  
  for (const file of files) {
    if (!fs.existsSync(file)) continue;
    console.log(`\n\n--- Testing ${file} ---`);
    const dataBuffer = fs.readFileSync(file);
    const pdfData = await pdfParse(dataBuffer);
    const cleanedText = cleanText(pdfData.text);
    const parsedData = extractStructuredData(cleanedText);
    
    console.log(JSON.stringify({
       name: parsedData.name,
       location: parsedData.location,
       education: parsedData.education,
       skills: parsedData.skills,
       experience: parsedData.experience,
       projects: parsedData.projects
    }, null, 2));
  }
};
run();
