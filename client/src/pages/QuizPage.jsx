import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { quizApi } from '../services/api';

function QuizPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { topic, difficulty } = location.state || {};

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch questions from backend
  useEffect(() => {
    const fetchQuestions = async () => {
      if (!topic) {
        navigate('/');
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        // Use AI generation for dynamic questions
        const response = await quizApi.generateQuestions(topic, difficulty, 10);
        setQuestions(response.questions);
      } catch (err) {
        setError(err.message);
        console.error('Failed to fetch questions:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [topic, difficulty, navigate]);

  // Load the saved answer when question changes
  useEffect(() => {
    setSelectedAnswer(answers[currentQuestion] ?? null);
  }, [currentQuestion, answers]);

  const handleAnswerSelect = (answerIndex) => {
    setSelectedAnswer(answerIndex);
    // Save answer immediately when selected
    setAnswers(prev => ({
      ...prev,
      [currentQuestion]: answerIndex
    }));
  };

  const handleNext = () => {
    if (selectedAnswer !== null) {
      if (currentQuestion === questions.length - 1) {
        // Quiz complete - go to results
        navigate('/results', {
          state: {
            topic,
            difficulty,
            answers: answers,
            questions: questions
          }
        });
      } else {
        // Next question
        setCurrentQuestion(prev => prev + 1);
      }
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  if (!topic) return null;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-500 flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-white text-lg">Generating quiz questions...</p>
            <p className="text-white/70 text-sm mt-2">Creating {difficulty} level questions about {topic}</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-500 flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl">
          <div className="text-center">
            <div className="text-red-400 text-4xl mb-4">⚠️</div>
            <p className="text-white text-lg mb-4">Failed to load quiz questions</p>
            <p className="text-white/70 text-sm mb-6">{error}</p>
            <button
              onClick={() => navigate('/')}
              className="bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (questions.length === 0) return null;

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-500">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-lg border-b border-white/20">
        <div className="max-w-4xl mx-auto px-3 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-lg">🧠</span>
              </div>
              <span className="ml-2 text-lg font-bold text-white">Topic Trivia Time</span>
            </div>
            <button
              onClick={handleBackToHome}
              className="px-3 py-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 font-medium transition-colors duration-200 border border-white/20 text-sm"
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </div>

      {/* Quiz Content */}
      <div className="max-w-3xl mx-auto px-3 py-5">
        {/* Question Card with Progress */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-5 mb-5 border border-white/20 shadow-2xl">
          {/* Progress Section */}
          <div className="mb-5">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center space-x-3">
                <span className="text-white font-semibold text-base">
                  Question {currentQuestion + 1} of {questions.length}
                </span>
                <div className="px-2 py-1 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
                  <span className="text-white text-xs font-medium">{Math.round(progress)}% Complete</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-white/80 text-xs">Topic</div>
                <div className="text-white font-medium text-sm">{topic}</div>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-white/20 rounded-full h-2 shadow-inner">
              <div 
                className="bg-gradient-to-l from-pink-400 to-violet-400 h-2 rounded-full transition-all duration-500 shadow-sm"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
          <div className="text-center mb-5">
            {/* <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl mb-4 shadow-lg">
              <span className="text-white text-2xl font-bold">?</span>
            </div> */}
            <h2 className="text-lg md:text-xl font-bold text-white leading-relaxed">
              {question.question}
            </h2>
          </div>

          {/* Answer Options */}
          <div className="space-y-3">
            {question.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                className={`w-full text-left p-3 rounded-xl border-2 transition-all duration-200 transform hover:scale-[1.02] ${
                  selectedAnswer === index
                    ? 'border-white/60 bg-white/20 backdrop-blur-sm shadow-lg'
                    : 'border-white/30 bg-white/5 backdrop-blur-sm hover:bg-white/10 hover:border-white/40'
                }`}
              >
                <div className="flex items-center">
                  <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center transition-colors ${
                    selectedAnswer === index
                      ? 'border-white bg-white'
                      : 'border-white/60'
                  }`}>
                    {selectedAnswer === index && (
                      <div className="w-2 h-2 rounded-full bg-gradient-to-r from-pink-500 to-violet-500"></div>
                    )}
                  </div>
                  <span className="text-white font-medium text-sm">{option}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className={`px-5 py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
              currentQuestion === 0
                ? 'bg-white/10 text-white/40 cursor-not-allowed border border-white/20'
                : 'bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 border border-white/30 shadow-lg hover:shadow-xl transform hover:scale-105'
            }`}
          >
            ← Previous
          </button>

          <div className="text-center">
            <div className="text-white/80 text-xs mb-1">Difficulty</div>
            <div className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-lg border border-white/30">
              <span className="text-white font-medium capitalize text-sm">{difficulty}</span>
            </div>
          </div>
          
          <button
            onClick={handleNext}
            disabled={selectedAnswer === null}
            className={`px-5 py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${
              selectedAnswer === null
                ? 'bg-white/10 text-white/40 cursor-not-allowed border border-white/20'
                : 'bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
            }`}
          >
            {currentQuestion === questions.length - 1 ? 'Submit Quiz 🎯' : 'Next →'}
          </button>
        </div>

        {/* Question Navigation Dots */}
        <div className="flex justify-center mt-5 space-x-2">
          {questions.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentQuestion(index)}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                index === currentQuestion
                  ? 'bg-white scale-125 shadow-lg'
                  : answers[index] !== undefined
                  ? 'bg-white/60 hover:bg-white/80'
                  : 'bg-white/30 hover:bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default QuizPage;