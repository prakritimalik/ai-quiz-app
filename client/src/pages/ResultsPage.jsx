import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

function ResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { topic, difficulty, answers, questions } = location.state || {};

  const [score, setScore] = useState(0);

  useEffect(() => {
    if (!answers || !questions) {
      navigate('/');
      return;
    }

    // Calculate score
    let correctCount = 0;
    Object.entries(answers).forEach(([questionIndex, answerIndex]) => {
      if (questions[questionIndex].correctAnswer === answerIndex) {
        correctCount++;
      }
    });
    setScore(correctCount);
  }, [answers, questions, navigate]);

  const handleTryAgain = () => {
    navigate('/quiz', { state: { topic, difficulty } });
  };

  const handleNewTopic = () => {
    navigate('/');
  };

  if (!answers || !questions) return null;

  const scorePercentage = (score / questions.length) * 100;
  const getScoreMessage = () => {
    if (scorePercentage >= 80) return "Excellent work! You're a quiz master!";
    if (scorePercentage >= 60) return "Good job! Keep up the learning!";
    if (scorePercentage >= 40) return "Not bad! Room for improvement!";
    return "Keep studying and try again!";
  };

  const getScoreColor = () => {
    if (scorePercentage >= 80) return "from-green-400 to-emerald-400";
    if (scorePercentage >= 60) return "from-blue-400 to-indigo-400";
    if (scorePercentage >= 40) return "from-yellow-400 to-orange-400";
    return "from-red-400 to-pink-400";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-500">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-lg border-b border-white/20">
        <div className="max-w-3xl mx-auto px-3 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-lg">🧠</span>
              </div>
              <span className="ml-2 text-lg font-bold text-white">Topic Trivia Time</span>
            </div>
            <button
              onClick={handleNewTopic}
              className="px-3 py-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 font-medium transition-colors duration-200 border border-white/20 text-sm"
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </div>

      {/* Results Content */}
      <div className="max-w-3xl mx-auto px-3 py-5">
        {/* Score Display */}
        <div className="text-center mb-6">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-5 mb-4 border border-white/20 shadow-2xl">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl mb-3 shadow-lg">
              <span className="text-2xl">🎯</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
              Your Score: {score}/{questions.length}
            </h1>
            <div className={`inline-block px-4 py-2 rounded-full bg-gradient-to-r ${getScoreColor()} text-white font-semibold text-sm mb-3`}>
              {Math.round(scorePercentage)}% Complete
            </div>
            <p className="text-base text-white/90 mb-3">
              {getScoreMessage()}
            </p>
            <div className="flex justify-center gap-3 text-sm">
              <div className="bg-white/15 px-3 py-1 rounded-lg border border-white/20">
                <span className="text-white/80">Topic:</span> <span className="font-semibold text-white">{topic}</span>
              </div>
              <div className="bg-white/15 px-3 py-1 rounded-lg border border-white/20">
                <span className="text-white/80">Difficulty:</span> <span className="font-semibold text-white capitalize">{difficulty}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Review Section */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 mb-5 border border-white/20 shadow-2xl">
          <div className="flex items-center mb-4 pb-3 border-b border-white/20">
            <span className="text-xl mr-2">📋</span>
            <h2 className="text-lg font-bold text-white">
              Review Your Answers
            </h2>
          </div>
          
          <div className="space-y-4">
            {questions.map((question, index) => {
              const userAnswer = answers[index];
              const isCorrect = userAnswer === question.correctAnswer;
              
              return (
                <div key={index} className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-sm font-medium text-white flex-1 leading-relaxed">
                      {index + 1}. {question.question}
                    </h3>
                    <div className={`ml-3 flex items-center px-2 py-1 rounded-lg font-medium text-xs ${
                      isCorrect 
                        ? 'bg-green-500/20 text-green-100 border border-green-400/30' 
                        : 'bg-red-500/20 text-red-100 border border-red-400/30'
                    }`}>
                      {isCorrect ? (
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      )}
                      <span>
                        {isCorrect ? 'Correct' : 'Incorrect'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-xs text-white/90 mb-1">
                    <span className="font-semibold text-white">Your answer:</span> 
                    <span className={`ml-1 ${isCorrect ? 'text-green-200' : 'text-red-200'}`}>
                      {question.options[userAnswer]}
                    </span>
                  </div>
                  
                  {!isCorrect && (
                    <div className="text-xs text-white/90 mb-1">
                      <span className="font-semibold text-white">Correct answer:</span> 
                      <span className="ml-1 text-green-200">
                        {question.options[question.correctAnswer]}
                      </span>
                    </div>
                  )}
                  
                  <div className="text-xs text-white/85 italic mt-2 bg-white/5 rounded-lg p-2 border border-white/10">
                    <span className="font-medium text-white/95">💡 Explanation:</span> {question.explanation}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-3 mb-4">
          <button
            onClick={handleTryAgain}
            className="bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 text-white px-5 py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-sm"
          >
            Try Again 🔄
          </button>
          <button
            onClick={handleNewTopic}
            className="bg-white/20 backdrop-blur-sm text-white px-5 py-3 rounded-xl hover:bg-white/30 font-medium border border-white/30 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 text-sm"
          >
            New Topic 📚
          </button>
        </div>

        {/* Share Score */}
        <div className="text-center">
          <button className="text-white/80 hover:text-white font-medium text-sm transition-colors duration-200">
            Share Score 📤
          </button>
        </div>
      </div>
    </div>
  );
}

export default ResultsPage;