# 🧠 AI-Powered Quiz App

A modern, full-stack quiz application that generates dynamic questions using AI. Built with React, Node.js, and OpenAI's API.

## ✨ Features

- **🤖 AI-Generated Questions**: Unlimited questions on any topic using OpenAI GPT-3.5
- **🎯 Multiple Difficulty Levels**: Easy, Medium, and Hard questions
- **📱 Responsive Design**: Beautiful glass-morphism UI with Tailwind CSS
- **⚡ Real-time Generation**: Fresh questions generated on-demand
- **📊 Detailed Results**: Review answers with explanations
- **🔄 Smart Retry**: Practice same topics with new questions

## 🚀 Tech Stack

### Frontend
- **React 19** with Vite
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Axios** for API calls

### Backend
- **Node.js** with Express
- **OpenAI API** for question generation
- **CORS** enabled for cross-origin requests
- **Environment-based configuration**

## 📦 Getting Started

### Prerequisites
- Node.js 16+ installed
- OpenAI API key ([Get one here](https://platform.openai.com/api-keys))

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd quiz-app
   ```

2. **Install dependencies**
   ```bash
   # Install server dependencies
   cd server
   npm install

   # Install client dependencies
   cd ../client
   npm install
   ```

3. **Configure environment variables**
   ```bash
   # In the server directory, update .env file
   cd ../server
   # Add your OpenAI API key to .env:
   OPENAI_API_KEY=sk-your-actual-api-key-here
   ```

4. **Start the development servers**
   ```bash
   # Terminal 1 - Start backend server
   cd server
   npm run dev

   # Terminal 2 - Start frontend server  
   cd client
   npm run dev
   ```

5. **Open your browser**
   - Frontend: http://localhost:5175
   - Backend API: http://localhost:5000

## 🎮 How to Use

1. **Choose a Topic**: Select from predefined topics or enter your own
2. **Set Difficulty**: Choose Easy, Medium, or Hard
3. **Take the Quiz**: Answer 10 AI-generated questions
4. **Review Results**: See your score and learn from explanations
5. **Try Again**: Practice more with fresh questions on the same topic

## 🛠 Project Structure

```
quiz-app/
├── client/                 # React frontend
│   ├── src/
│   │   ├── pages/         # Quiz pages (Home, Quiz, Results)
│   │   ├── services/      # API service layer
│   │   └── utils/         # Utilities and constants
│   └── package.json
├── server/                # Node.js backend
│   ├── routes/           # API routes
│   ├── services/         # AI service
│   └── package.json
└── README.md
```

## 🔧 API Endpoints

- `GET /` - Health check
- `GET /api/quiz/questions` - Get sample questions
- `POST /api/generate/questions` - Generate AI questions
- `GET /api/generate/status` - Check AI configuration

## 🌟 Key Features

### AI Question Generation
- Generates unique questions for any topic
- Adapts to difficulty levels
- Provides educational explanations
- Fallback to sample questions if AI unavailable

### Smart UX Design
- Loading states during AI generation
- Error handling with graceful fallbacks
- Mobile-responsive interface
- Intuitive navigation flow

## 💰 Cost Considerations

- AI generation costs ~$0.01-0.02 per 10 questions
- Very affordable for personal/educational use
- Fallback questions available when offline

## 🚀 Deployment

The app is ready for deployment on platforms like:
- **Frontend**: Vercel, Netlify
- **Backend**: Railway, Render, Heroku

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- OpenAI for the powerful GPT API
- React and Vite teams for excellent developer tools
- Tailwind CSS for beautiful styling utilities

---

**Built with ❤️ and AI**