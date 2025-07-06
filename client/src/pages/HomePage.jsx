// client/src/pages/HomePage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { predefinedTopics, difficultyLevels } from '../utils/mockData';

function HomePage() {
  const [selectedTopic, setSelectedTopic] = useState('');
  const [customTopic, setCustomTopic] = useState('');
  const [difficulty, setDifficulty] = useState('medium');
  const navigate = useNavigate();

  const handleTopicSelect = (topic) => {
    setSelectedTopic(topic);
    setCustomTopic(''); // Clear custom input when dropdown is selected
  };

  const handleCustomTopicChange = (e) => {
    setCustomTopic(e.target.value);
    if (e.target.value) {
      setSelectedTopic(''); // Clear dropdown when typing
    }
  };

  const handleStartQuiz = () => {
    const finalTopic = customTopic || selectedTopic;
    if (!finalTopic) {
      alert('Please select a topic or enter a custom topic');
      return;
    }
    
    // Navigate to quiz with state
    navigate('/quiz', { 
      state: { 
        topic: finalTopic, 
        difficulty: difficulty 
      } 
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-500 flex items-center justify-center p-3">
      <div className="w-full max-w-md md:max-w-lg lg:max-w-xl">
        {/* Main Card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-4 md:p-5 lg:p-6 shadow-2xl border border-white/20">
          {/* Header */}
          <div className="text-center mb-4 md:mb-5 lg:mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 md:w-14 md:h-14 bg-white/20 backdrop-blur-sm rounded-xl mb-3 shadow-lg">
              <span className="text-2xl md:text-3xl">🧠</span>
            </div>
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-white mb-1 tracking-tight">
              Topic Trivia Time
            </h1>
            <p className="text-white/80 text-sm md:text-base">
              Test your knowledge with AI-generated questions
            </p>
          </div>

          {/* Form Container */}
          <div className="space-y-4 md:space-y-5">
            {/* Topic Selection Card */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 md:p-4 lg:p-5 border border-white/20">
              <h3 className="text-white font-semibold text-base md:text-lg mb-3 md:mb-4">Choose Your Topic</h3>
              
              {/* Topic inputs - side by side on larger screens */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Dropdown */}
                <div>
                  <select
                    value={selectedTopic}
                    onChange={(e) => handleTopicSelect(e.target.value)}
                    className="w-full px-3 py-2 md:py-3 bg-white/90 backdrop-blur-sm border border-white/30 rounded-lg focus:ring-2 focus:ring-white/50 focus:border-white/50 text-gray-800 font-medium shadow-sm transition-all duration-200 text-sm"
                  >
                    <option value="">Select a topic...</option>
                    {predefinedTopics.map((topic) => (
                      <option key={topic} value={topic}>
                        {topic}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Custom Topic Input */}
                <div>
                  <input
                    type="text"
                    placeholder="Or enter your own topic..."
                    value={customTopic}
                    onChange={handleCustomTopicChange}
                    className="w-full px-3 py-2 md:py-3 bg-white/90 backdrop-blur-sm border border-white/30 rounded-lg focus:ring-2 focus:ring-white/50 focus:border-white/50 text-gray-800 placeholder-gray-500 font-medium shadow-sm transition-all duration-200 text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Compact Difficulty Selection */}
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 md:p-4 lg:p-5 border border-white/20">
              <h3 className="text-white font-semibold text-base md:text-lg mb-3 md:mb-4">Difficulty Level</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 md:gap-3">
                {difficultyLevels.map((level) => (
                  <label 
                    key={level.id} 
                    className={`px-3 md:px-4 py-3 md:py-4 rounded-lg border-2 cursor-pointer transition-all duration-200 text-center hover:scale-105 ${
                      difficulty === level.id
                        ? 'border-white/60 bg-white/20 shadow-lg'
                        : 'border-white/30 bg-white/5 hover:bg-white/10 hover:border-white/40'
                    }`}
                  >
                    <input
                      type="radio"
                      name="difficulty"
                      value={level.id}
                      checked={difficulty === level.id}
                      onChange={(e) => setDifficulty(e.target.value)}
                      className="sr-only"
                    />
                    <div className="text-white font-medium text-sm md:text-base">
                      {level.label}
                    </div>
                    <div className="text-white/70 text-xs md:text-sm mt-1">
                      {level.description}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Start Button */}
            <button
              onClick={handleStartQuiz}
              className="w-full bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 text-white font-bold py-3 md:py-4 px-5 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-200 text-base md:text-lg"
            >
              Start Quiz 🚀
            </button>
          </div>
        </div>

        {/* Bottom decorative element */}
        <div className="text-center mt-4">
          <p className="text-white/60 text-xs">
            Powered by AI • 10 Questions per Quiz
          </p>
        </div>
      </div>
    </div>
  );
}

export default HomePage;