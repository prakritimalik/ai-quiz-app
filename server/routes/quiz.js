const express = require('express');
const router = express.Router();

// Get quiz questions by topic and difficulty
router.get('/questions', async (req, res) => {
  try {
    const { topic, difficulty } = req.query;
    
    if (!topic || !difficulty) {
      return res.status(400).json({ 
        error: 'Topic and difficulty are required' 
      });
    }

    // For now, return sample questions (fallback when DB is not available)
    const questions = getSampleQuestions(topic, difficulty);

    res.json({ 
      success: true, 
      questions: questions.map(q => ({
        id: q.id,
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer,
        explanation: q.explanation
      }))
    });
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ 
      error: 'Failed to fetch questions' 
    });
  }
});

// Submit quiz answers and get results
router.post('/submit', async (req, res) => {
  try {
    const { questions, answers } = req.body;
    
    if (!questions || !answers) {
      return res.status(400).json({ 
        error: 'Questions and answers are required' 
      });
    }

    let score = 0;
    const results = questions.map((question, index) => {
      const userAnswer = answers[index];
      const isCorrect = userAnswer === question.correctAnswer;
      
      if (isCorrect) score++;
      
      return {
        questionId: question.id,
        question: question.question,
        options: question.options,
        correctAnswer: question.correctAnswer,
        userAnswer,
        isCorrect,
        explanation: question.explanation
      };
    });

    res.json({
      success: true,
      score,
      totalQuestions: questions.length,
      percentage: Math.round((score / questions.length) * 100),
      results
    });
  } catch (error) {
    console.error('Error submitting quiz:', error);
    res.status(500).json({ 
      error: 'Failed to submit quiz' 
    });
  }
});

// Get sample questions (fallback when DB is not available)
function getSampleQuestions(topic, difficulty) {
  const allQuestions = [
    {
      id: 1,
      question: "What is the capital of France?",
      options: ["London", "Berlin", "Paris", "Madrid"],
      correctAnswer: 2,
      explanation: "Paris is the capital and largest city of France.",
      topic: "Geography",
      difficulty: "easy"
    },
    {
      id: 2,
      question: "In what year did the first man land on the moon?",
      options: ["1968", "1969", "1970", "1971"],
      correctAnswer: 1,
      explanation: "Neil Armstrong and Buzz Aldrin landed on the moon on July 20, 1969.",
      topic: "History",
      difficulty: "medium"
    },
    {
      id: 3,
      question: "What is the highest mountain in the world?",
      options: ["K2", "Mount Everest", "Kangchenjunga", "Lhotse"],
      correctAnswer: 1,
      explanation: "Mount Everest is the highest mountain in the world at 8,848.86 meters.",
      topic: "Geography",
      difficulty: "easy"
    },
    {
      id: 4,
      question: "Who painted the Mona Lisa?",
      options: ["Vincent van Gogh", "Leonardo da Vinci", "Pablo Picasso", "Michelangelo"],
      correctAnswer: 1,
      explanation: "The Mona Lisa was painted by Leonardo da Vinci between 1503 and 1519.",
      topic: "Art & Culture",
      difficulty: "medium"
    },
    {
      id: 5,
      question: "What is the chemical symbol for gold?",
      options: ["Go", "Gd", "Au", "Ag"],
      correctAnswer: 2,
      explanation: "Au is the chemical symbol for gold, derived from the Latin word 'aurum'.",
      topic: "Science & Technology",
      difficulty: "medium"
    },
    {
      id: 6,
      question: "Which planet is known as the Red Planet?",
      options: ["Venus", "Mars", "Jupiter", "Saturn"],
      correctAnswer: 1,
      explanation: "Mars is known as the Red Planet due to iron oxide on its surface.",
      topic: "Science & Technology",
      difficulty: "easy"
    },
    {
      id: 7,
      question: "What is the largest ocean on Earth?",
      options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
      correctAnswer: 3,
      explanation: "The Pacific Ocean is the largest ocean, covering about 46% of Earth's water surface.",
      topic: "Geography",
      difficulty: "easy"
    },
    {
      id: 8,
      question: "Who wrote the play 'Romeo and Juliet'?",
      options: ["Charles Dickens", "William Shakespeare", "Jane Austen", "Mark Twain"],
      correctAnswer: 1,
      explanation: "Romeo and Juliet was written by William Shakespeare around 1594-1596.",
      topic: "Literature",
      difficulty: "medium"
    },
    {
      id: 9,
      question: "What is the smallest prime number?",
      options: ["0", "1", "2", "3"],
      correctAnswer: 2,
      explanation: "2 is the smallest prime number and the only even prime number.",
      topic: "Mathematics",
      difficulty: "easy"
    },
    {
      id: 10,
      question: "Which country hosted the 2016 Summer Olympics?",
      options: ["China", "Brazil", "United Kingdom", "Russia"],
      correctAnswer: 1,
      explanation: "Brazil hosted the 2016 Summer Olympics in Rio de Janeiro.",
      topic: "Sports",
      difficulty: "medium"
    }
  ];

  // Return 10 questions, filtering by topic if available
  return allQuestions.slice(0, 10);
}

module.exports = router;