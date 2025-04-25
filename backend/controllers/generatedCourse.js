require('dotenv').config();
const config = require('config');
const fs = require('fs');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

async function generateAIContent(courseName) {
  try {
    const apiKey = config.get('googleAI.apiKey');
    const genAI = new GoogleGenerativeAI(apiKey);

    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-pro',
      tools: [{ codeExecution: {} }],
    });

    const result = await model.generateContent(
      `Create a course plan on ${courseName} in order 1, 2, 3 , ... as much as the road map needed
       without any additional explanation.`
    );

    const responseText = result.response.text();

 
    const sanitizedCourseName = String(courseName).replace(/\s+/g, '_');
    const outputDirectory = path.join(__dirname, '../course-plans');
    const outputFilePath = path.join(outputDirectory, `${sanitizedCourseName}.txt`);

   
    if (!fs.existsSync(outputDirectory)) {
      fs.mkdirSync(outputDirectory, { recursive: true });
    }

    
    fs.writeFileSync(outputFilePath, responseText, 'utf8');

    console.log(`Course plan for "${courseName}" saved to ${outputFilePath}`);
  } catch (error) {
    console.error('Error generating AI content:', error);
  }
}

module.exports = generateAIContent;
