const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Quiz App API is running!' });
});

// Import routes
const quizRoutes = require('./routes/quiz');
const generateRoutes = require('./routes/generate');
app.use('/api/quiz', quizRoutes);
app.use('/api/generate', generateRoutes);

// Error handling for uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('🚨 Uncaught Exception:', error);
  console.error('Stack:', error.stack);
  // Don't exit, just log the error
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('🚨 Unhandled Rejection at:', promise, 'reason:', reason);
  // Don't exit, just log the error
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});