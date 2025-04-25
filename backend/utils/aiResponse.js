require('dotenv').config();
const config = require('config');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// In-memory conversation store (for demonstration)
const conversationStore = new Map(); // Key: sessionId, Value: array of messages

const aiResponse = async (prompt, image = null, sessionId = 'default') => {
  const apiKey = process.env.GOOGLE_AI_API_KEY || config.get('googleAI.apiKey');
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  // Get or initialize conversation history for this session
  let history = conversationStore.get(sessionId) || [];
  
  let content = [];

  // Add previous conversation history as context
  history.forEach((msg) => {
    content.push({
      text: `${msg.role}: ${msg.text}`
    });
  });

  // Add current user input
  if (image) {
    content.push({
      inlineData: {
        data: image, // Expects base64 string
        mimeType: 'image/jpeg'
      }
    });
  }
  if (prompt) {
    content.push({
      text: `User: ${prompt}`
    });
  } else if (image && !prompt) {
    content.push({
      text: 'User: Describe this image'
    });
  }

  if (content.length === 0) {
    throw new Error('No content provided for AI processing');
  }

  try {
    const result = await model.generateContent(content);
    const responseText = result.response.text().trim();

    // Update conversation history
    if (prompt || image) {
      history.push({ role: 'User', text: prompt || 'Describe this image' });
    }
    history.push({ role: 'AI', text: responseText });
    conversationStore.set(sessionId, history);

    return responseText;
  } catch (error) {
    console.error('Gemini Generation Error:', error);
    throw new Error('Failed to generate Gemini response');
  }
};

module.exports = aiResponse;