const express = require('express');
const router = express.Router();
const aiService = require('../services/aiService');

// Generate questions using AI
router.post('/questions', async (req, res) => {
  console.log('🎯 AI Generation request received');
  try {
    const { topic, difficulty, count = 10 } = req.body;
    
    if (!topic || !difficulty) {
      return res.status(400).json({ 
        error: 'Topic and difficulty are required' 
      });
    }

    // Validate difficulty level
    if (!['easy', 'medium', 'hard'].includes(difficulty)) {
      return res.status(400).json({ 
        error: 'Difficulty must be easy, medium, or hard' 
      });
    }

    // Validate count
    if (count < 1 || count > 20) {
      return res.status(400).json({ 
        error: 'Count must be between 1 and 20' 
      });
    }

    console.log(`📝 Generating ${count} ${difficulty} questions about "${topic}"`);
    
    // Use AI service to generate questions
    const questions = await aiService.generateQuestions(topic, difficulty, count);
    
    res.json({
      success: true,
      topic,
      difficulty,
      count: questions.length,
      questions,
      aiConfigured: aiService.isConfigured(),
      source: questions[0]?.source || 'unknown'
    });
  } catch (error) {
    console.error('🚨 CRITICAL: Error in generate route:', error);
    console.error('Error stack:', error.stack);
    
    // Always respond, even if there's an error
    if (!res.headersSent) {
      res.status(500).json({ 
        error: 'Failed to generate questions',
        details: error.message,
        fallback: true
      });
    }
  }
});

// Get API status endpoint
router.get('/status', (req, res) => {
  res.json({
    success: true,
    aiConfigured: aiService.isConfigured(),
    message: aiService.isConfigured() 
      ? 'AI question generation is ready' 
      : 'AI not configured, using fallback questions'
  });
});

module.exports = router;