const express = require('express');
const router = express.Router();
const multer = require('multer');
const aiResponse = require('../utils/aiResponse');

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only images are allowed'), false);
    }
  }
});

router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { prompt } = req.body;
    const image = req.file ? req.file.buffer.toString('base64') : null;
    const sessionId = req.query.sessionId || 'default'; 

    if (!prompt && !image) {
      return res.status(400).json({ error: 'Prompt or image required' });
    }

    const aiResult = await aiResponse(prompt, image, sessionId);
    res.json({ message: aiResult });
  } catch (error) { 
    console.error('Error in AI route:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

module.exports = router;