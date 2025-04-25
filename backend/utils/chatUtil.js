require('dotenv').config();
const config = require('config');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const aiResponse = async (prompt, image = null) => {
  const apiKey = process.env.GOOGLE_AI_API_KEY || config.get('googleAI.apiKey');
  
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

  let content;
  if (image) {
    content = [
      {
        inlineData: {
          data: image.toString('base64'),
          mimeType: 'image/jpeg'
        }
      },
      { text: prompt || 'Describe this image' }
    ];
  } else {
    content = prompt;
  }

  try {
    const result = await model.generateContent(content);
    return result.response.text().trim();
  } catch (error) {
    console.error('Gemini Generation Error:', error);
    throw new Error('Failed to generate Gemini response');
  }
};

module.exports = aiResponse;