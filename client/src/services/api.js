import axios from 'axios';

// Base URL for the API - supports both development and production
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // Increased timeout for AI generation
  headers: {
    'Content-Type': 'application/json',
  },
});

// Quiz API functions
export const quizApi = {
  // Get quiz questions by topic and difficulty
  getQuestions: async (topic, difficulty) => {
    try {
      const response = await api.get('/quiz/questions', {
        params: { topic, difficulty }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching questions:', error);
      throw new Error('Failed to fetch quiz questions');
    }
  },

  // Submit quiz answers and get results
  submitQuiz: async (questionIds, answers) => {
    try {
      const response = await api.post('/quiz/submit', {
        questionIds,
        answers
      });
      return response.data;
    } catch (error) {
      console.error('Error submitting quiz:', error);
      throw new Error('Failed to submit quiz answers');
    }
  },

  // Generate new questions using AI
  generateQuestions: async (topic, difficulty, count = 10) => {
    try {
      console.log(`🎯 Requesting ${count} ${difficulty} questions about "${topic}"`);
      const response = await api.post('/generate/questions', {
        topic,
        difficulty,
        count
      });
      console.log('✅ Questions generated successfully');
      return response.data;
    } catch (error) {
      console.error('🚨 Error generating questions:', error);
      
      if (error.code === 'ECONNABORTED') {
        throw new Error('Request timed out - AI generation took too long');
      } else if (error.response) {
        console.error('Server responded with error:', error.response.status, error.response.data);
        throw new Error(`Server error: ${error.response.data?.error || 'Unknown error'}`);
      } else if (error.request) {
        console.error('No response received from server');
        throw new Error('Cannot connect to server - please check if the backend is running');
      } else {
        console.error('Request setup error:', error.message);
        throw new Error('Failed to generate questions');
      }
    }
  }
};

// Health check function
export const healthCheck = async () => {
  try {
    const response = await axios.get('http://localhost:5000/');
    return response.data;
  } catch (error) {
    console.error('Server health check failed:', error);
    return null;
  }
};

export default api;