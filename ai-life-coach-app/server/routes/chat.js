const express = require('express');
const authMiddleware = require('../middleware/auth');
const Chat = require('../models/Chat');
const { generateResponse } = require('../utils/openai');

const router = express.Router();

// Send message
router.post('/message', authMiddleware, async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ message: 'Message content is required' });
    }

    // For now, we'll create a simple message array for context
    const messages = [
      {
        role: 'user',
        content: message.trim()
      }
    ];

    // Generate AI response
    const aiResponse = await generateResponse(messages);
    
    const assistantMessage = {
      role: 'assistant',
      content: aiResponse.success ? aiResponse.message : aiResponse.fallback,
      timestamp: new Date()
    };

    res.json({
      success: true,
      message: assistantMessage,
      aiSuccess: aiResponse.success
    });

  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ message: 'Failed to send message' });
  }
});

module.exports = router;
