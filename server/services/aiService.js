const OpenAI = require('openai');

class AIService {
  constructor() {
    this.openai = null;
    this.initializeOpenAI();
  }

  initializeOpenAI() {
    if (process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY !== 'your_openai_api_key_here') {
      this.openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
      console.log('✅ OpenAI API initialized successfully');
    } else {
      console.log('⚠️  OpenAI API key not configured. Using fallback questions.');
    }
  }

  createPrompt(topic, difficulty, count) {
    const difficultyDescriptions = {
      easy: 'basic level, suitable for beginners with simple concepts',
      medium: 'intermediate level, requiring some knowledge of the subject',
      hard: 'advanced level, requiring deep understanding and complex reasoning'
    };

    return `Create ${count} multiple-choice quiz questions about "${topic}" at ${difficulty} difficulty level (${difficultyDescriptions[difficulty]}).

Requirements:
- Each question should have exactly 4 answer options
- Only one correct answer per question
- Include a brief explanation for the correct answer
- Questions should be factual and educational
- Avoid trick questions or ambiguous wording
- Make sure questions are appropriate for the ${difficulty} difficulty level
- Do NOT include A), B), C), D) prefixes in the options - just the plain text

Return the response as a valid JSON array with this exact structure:
[
  {
    "question": "Question text here?",
    "options": ["First option text", "Second option text", "Third option text", "Fourth option text"],
    "correctAnswer": 0,
    "explanation": "Brief explanation of why this answer is correct."
  }
]

Topic: ${topic}
Difficulty: ${difficulty}
Number of questions: ${count}`;
  }

  async generateQuestions(topic, difficulty = 'medium', count = 10) {
    // If OpenAI is not configured, return fallback questions
    if (!this.openai) {
      return this.getFallbackQuestions(topic, difficulty, count);
    }

    try {
      console.log(`🤖 Generating ${count} ${difficulty} questions about "${topic}"`);
      
      const completion = await this.openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are an expert quiz creator. Generate high-quality, educational multiple-choice questions. Always respond with valid JSON format."
          },
          {
            role: "user",
            content: this.createPrompt(topic, difficulty, count)
          }
        ],
        max_tokens: 2000,
        temperature: 0.7,
      });

      const responseText = completion.choices[0].message.content.trim();
      
      // Parse the JSON response
      let questions;
      try {
        // Remove any markdown code block markers if present
        const cleanResponse = responseText.replace(/```json\n?|\n?```/g, '');
        questions = JSON.parse(cleanResponse);
      } catch (parseError) {
        console.error('Failed to parse AI response as JSON:', parseError);
        throw new Error('Invalid response format from AI');
      }

      // Validate and format questions
      const formattedQuestions = this.validateAndFormatQuestions(questions, topic, difficulty);
      
      console.log(`✅ Successfully generated ${formattedQuestions.length} questions`);
      return formattedQuestions;

    } catch (error) {
      console.error('🚨 OpenAI API error:', error.message);
      console.error('Error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      });
      
      // Fallback to sample questions if AI fails
      console.log('🔄 Falling back to sample questions due to AI error');
      return this.getFallbackQuestions(topic, difficulty, count);
    }
  }

  validateAndFormatQuestions(questions, topic, difficulty) {
    if (!Array.isArray(questions)) {
      throw new Error('Questions must be an array');
    }

    return questions.map((q, index) => {
      // Validate required fields
      if (!q.question || !Array.isArray(q.options) || q.correctAnswer === undefined || !q.explanation) {
        throw new Error(`Question ${index + 1} is missing required fields`);
      }

      // Validate options array
      if (q.options.length !== 4) {
        throw new Error(`Question ${index + 1} must have exactly 4 options`);
      }

      // Validate correct answer index
      if (q.correctAnswer < 0 || q.correctAnswer > 3) {
        throw new Error(`Question ${index + 1} has invalid correctAnswer index`);
      }

      // Return formatted question
      return {
        id: index + 1,
        question: q.question.trim(),
        options: q.options.map(opt => this.cleanOption(opt.trim())),
        correctAnswer: parseInt(q.correctAnswer),
        explanation: q.explanation.trim(),
        topic: topic,
        difficulty: difficulty,
        source: 'ai_generated',
        createdAt: new Date()
      };
    });
  }

  cleanOption(option) {
    // Remove A), B), C), D) prefixes ONLY when followed by ) or . and space
    // This prevents removing "B" from "Basketball"
    return option.replace(/^[A-D]\)\s+/, '').replace(/^[A-D]\.\s+/, '').trim();
  }

  getFallbackQuestions(topic, difficulty, count) {
    const fallbackQuestions = [
      {
        question: `What is a key concept in ${topic}?`,
        options: ["Basic fundamentals", "Advanced theories", "Key principles", "Core concepts"],
        correctAnswer: 1,
        explanation: `This is a sample question about ${topic} at ${difficulty} level.`
      },
      {
        question: `Which statement best describes ${topic}?`,
        options: ["It's a fundamental concept", "It's an advanced topic", "It's a basic principle", "It's a complex theory"],
        correctAnswer: 0,
        explanation: `This is another sample question about ${topic}.`
      },
      {
        question: "What is the capital of France?",
        options: ["London", "Berlin", "Paris", "Madrid"],
        correctAnswer: 2,
        explanation: "Paris is the capital and largest city of France."
      },
      {
        question: "Which planet is known as the Red Planet?",
        options: ["Venus", "Mars", "Jupiter", "Saturn"],
        correctAnswer: 1,
        explanation: "Mars is known as the Red Planet due to iron oxide on its surface."
      },
      {
        question: "What is the largest ocean on Earth?",
        options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
        correctAnswer: 3,
        explanation: "The Pacific Ocean is the largest ocean, covering about 46% of Earth's water surface."
      }
    ];

    // Return requested number of questions, cycling through available ones
    const questions = [];
    for (let i = 0; i < count; i++) {
      const baseQuestion = fallbackQuestions[i % fallbackQuestions.length];
      questions.push({
        id: i + 1,
        question: baseQuestion.question,
        options: baseQuestion.options,
        correctAnswer: baseQuestion.correctAnswer,
        explanation: baseQuestion.explanation,
        topic: topic,
        difficulty: difficulty,
        source: 'fallback',
        createdAt: new Date()
      });
    }

    return questions;
  }

  isConfigured() {
    return this.openai !== null;
  }
}

module.exports = new AIService();