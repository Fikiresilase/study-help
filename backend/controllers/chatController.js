const aiResponse = require('./chatUtil');

const chatWithAI = async (req, res) => {
  try {
    const { prompt, image } = req.body;
    
    if (!prompt && !image) {
      return res.status(400).json({ error: 'Please provide a prompt or image' });
    }

    const response = await aiResponse(prompt, image);
    res.json({ 
      message: response,
      timestamp: new Date().toISOString(),
      model: 'gemini-2.0-flash'
    });
  } catch (error) {
    res.status(500).json({ 
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
};

module.exports = { chatWithAI };