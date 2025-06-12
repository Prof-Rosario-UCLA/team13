import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

// Configure axios to use your backend URL
axios.defaults.baseURL = 'http://localhost:3001';
axios.defaults.withCredentials = true;

function App() {
  const [serverStatus, setServerStatus] = useState('Checking...');
  const [user, setUser] = useState(null);
  const [showLogin, setShowLogin] = useState(true);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [announcement, setAnnouncement] = useState('');

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setAnnouncement('Connection restored. You are now online.');
    };
    const handleOffline = () => {
      setIsOnline(false);
      setAnnouncement('Connection lost. You are now in offline mode.');
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    const testServer = async () => {
      try {
        const response = await axios.get('/api/health');
        setServerStatus('✅ Connected to server');
        setAnnouncement('Successfully connected to AI Life Coach server');
        console.log('Server response:', response.data);
      } catch (error) {
        setServerStatus('❌ Server connection failed');
        setAnnouncement('Failed to connect to server. Some features may be limited.');
        console.error('Server connection error:', error);
      }
    };
    testServer();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Skip to main content link for screen readers */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded z-50"
        aria-label="Skip to main content"
      >
        Skip to main content
      </a>

      {/* Live region for announcements */}
      <div 
        aria-live="polite" 
        aria-atomic="true" 
        className="sr-only"
        role="status"
      >
        {announcement}
      </div>

      {/* Header */}
      <header 
        className="bg-blue-600 text-white p-4 shadow-md"
        role="banner"
      >
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">AI Life Coach</h1>
          <div className="flex items-center gap-4">
            {!isOnline && (
              <span 
                className="bg-orange-500 px-2 py-1 rounded text-xs"
                role="status"
                aria-label="Currently in offline mode"
              >
                Offline Mode
              </span>
            )}
            <div 
              className="text-sm"
              role="status"
              aria-label={`Server status: ${serverStatus}`}
            >
              {serverStatus}
            </div>
          </div>
        </div>
      </header>

      {/* Cookie Banner */}
      <CookieBanner />

      {/* Main Content */}
      <main 
        id="main-content"
        className="container mx-auto p-4"
        role="main"
        tabIndex={-1}
      >
        {user ? (
          <ChatInterface user={user} setUser={setUser} />
        ) : (
          <div className="max-w-md mx-auto mt-8">
            <div role="tabpanel" aria-labelledby={showLogin ? "login-tab" : "register-tab"}>
              {showLogin ? (
                <LoginForm 
                  onLogin={setUser} 
                  onToggle={() => setShowLogin(false)} 
                />
              ) : (
                <RegisterForm 
                  onRegister={setUser} 
                  onToggle={() => setShowLogin(true)} 
                />
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// Cookie Banner Component
const CookieBanner = () => {
  const [showBanner, setShowBanner] = useState(true);

  if (!showBanner) return null;

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 bg-gray-800 text-white p-4 z-50"
      role="dialog"
      aria-labelledby="cookie-banner-title"
      aria-describedby="cookie-banner-description"
    >
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <h2 id="cookie-banner-title" className="sr-only">Cookie Consent</h2>
          <p id="cookie-banner-description" className="text-sm">
            We use cookies to enhance your experience and provide personalized mental health support.
          </p>
        </div>
        <button
          onClick={() => setShowBanner(false)}
          className="bg-blue-600 px-4 py-2 rounded text-sm hover:bg-blue-700 focus:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors"
          aria-label="Accept cookies and close this banner"
        >
          Accept Cookies
        </button>
      </div>
    </div>
  );
};

// Login Form Component
const LoginForm = ({ onLogin, onToggle }) => {
  const [email, setEmail] = useState('test@example.com');
  const [password, setPassword] = useState('password');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('/api/auth/login', { email, password });
      onLogin(response.data.user);
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 id="login-tab" className="text-2xl font-bold mb-6 text-center text-gray-800">
        Welcome Back
      </h2>
      
      {error && (
        <div 
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"
          role="alert"
          aria-labelledby="error-title"
          aria-describedby="error-message"
        >
          <h3 id="error-title" className="sr-only">Error</h3>
          <p id="error-message">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label 
            htmlFor="login-email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Email Address
          </label>
          <input
            id="login-email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-colors"
            required
            aria-required="true"
            aria-describedby="email-help"
            autoComplete="email"
          />
          <div id="email-help" className="sr-only">
            Enter the email address associated with your account
          </div>
        </div>
        
        <div>
          <label 
            htmlFor="login-password"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Password
          </label>
          <div className="relative">
            <input
              id="login-password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-colors pr-12"
              required
              aria-required="true"
              aria-describedby="password-help"
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-gray-500 hover:text-gray-700 focus:text-gray-700 focus:outline-none"
              aria-label={showPassword ? "Hide password" : "Show password"}
              tabIndex={0}
            >
              {showPassword ? "👁️" : "👁️‍🗨️"}
            </button>
          </div>
          <div id="password-help" className="sr-only">
            Enter your account password
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 focus:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors"
          aria-describedby="login-button-help"
        >
          {loading ? (
            <>
              <span aria-hidden="true">⏳</span> Signing In...
            </>
          ) : (
            'Sign In'
          )}
        </button>
        <div id="login-button-help" className="sr-only">
          {loading ? "Please wait while we sign you in" : "Click to sign in to your account"}
        </div>
      </form>

      <p className="mt-4 text-center text-gray-600">
        Don't have an account?{' '}
        <button 
          onClick={onToggle} 
          className="text-blue-600 hover:text-blue-800 focus:text-blue-800 focus:outline-none focus:underline font-medium"
          aria-label="Switch to create new account form"
        >
          Create Account
        </button>
      </p>
    </div>
  );
};

// Register Form Component (keeping your existing one for brevity)
const RegisterForm = ({ onRegister, onToggle }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
  
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }
  
    try {
      const response = await axios.post('/api/auth/register', {
        email: formData.email,
        password: formData.password,
        name: formData.name
      });
      onRegister(response.data.user);
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 id="register-tab" className="text-2xl font-bold mb-6 text-center text-gray-800">Create Account</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="register-name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input
            id="register-name"
            type="text"
            name="name"
            placeholder="Enter your full name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
            aria-required="true"
          />
        </div>

        <div>
          <label htmlFor="register-email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            id="register-email"
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
            aria-required="true"
          />
        </div>

        <div>
          <label htmlFor="register-password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input
            id="register-password"
            type="password"
            name="password"
            placeholder="Create a password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
            minLength="6"
            aria-required="true"
          />
        </div>

        <div>
          <label htmlFor="register-confirm-password" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
          <input
            id="register-confirm-password"
            type="password"
            name="confirmPassword"
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
            aria-required="true"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>

      <p className="mt-4 text-center text-gray-600">
        Already have an account?{' '}
        <button 
          onClick={onToggle} 
          className="text-blue-600 hover:text-blue-800 font-medium focus:outline-none focus:underline"
        >
          Sign In
        </button>
      </p>
    </div>
  );
};

// Enhanced Chat Interface Component
const ChatInterface = ({ user, setUser }) => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: `Hello ${user.name}! I'm your AI Life Coach. I'm here to help with mental health support, relationship advice, and personal development. You can also upload text files for mood analysis! What's on your mind today?`,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || loading) return;

    const userMessage = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setLoading(true);

    try {
      const response = await axios.post('/api/chat/message', {
        message: inputMessage
      });

      if (response.data.success) {
        setMessages(prev => [...prev, response.data.message]);
      } else {
        throw new Error('Failed to get AI response');
      }

    } catch (error) {
      console.error('Chat error:', error);
      
      const fallbackMessage = {
        role: 'assistant',
        content: "I'm having trouble connecting right now, but I'm still here to listen. Can you tell me more about what's on your mind?",
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, fallbackMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleFileAnalyzed = (analysis) => {
    const analysisMessage = {
      role: 'assistant',
      content: `I've analyzed your file "${analysis.fileName}". Based on ${analysis.wordCount} words, I detected a mood score of ${analysis.moodScore}/10 (${analysis.moodLabel}). ${
        analysis.moodScore >= 6 
          ? "It seems like you're expressing positive emotions! That's wonderful to see." 
          : analysis.moodScore >= 4
          ? "Your text shows neutral emotions. Would you like to talk about what's on your mind?"
          : "I notice some concerning emotions in your text. I'm here to support you. Would you like to discuss what you're going through?"
      }`,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, analysisMessage]);
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Navigation */}
      <nav 
        className="mb-6 bg-white p-4 rounded-lg shadow-md"
        role="navigation"
        aria-labelledby="user-nav-title"
      >
        <div className="flex justify-between items-center">
          <div>
            <h2 id="user-nav-title" className="text-xl font-semibold text-gray-800">
              Welcome back, {user.name}!
            </h2>
            <p className="text-gray-600">How can I help you today?</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 focus:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300 transition-colors"
            aria-label="Sign out of your account"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* File Upload Area */}
      <FileUpload onFileAnalyzed={handleFileAnalyzed} />

      {/* Chat Messages */}
      <section
        className="bg-white rounded-lg shadow-md p-4 h-96 overflow-y-auto mb-4"
        role="log"
        aria-labelledby="chat-title"
        aria-live="polite"
        aria-relevant="additions"
      >
        <h3 id="chat-title" className="sr-only">Chat Messages</h3>
        {messages.map((msg, index) => (
          <div 
            key={index} 
            className={`mb-4 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}
            role="article"
            aria-labelledby={`message-${index}-author`}
          >
            <div className={`inline-block max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
              msg.role === 'user' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-200 text-gray-800'
            }`}>
              <div id={`message-${index}-author`} className="sr-only">
                {msg.role === 'user' ? 'You said' : 'AI Life Coach responded'}
              </div>
              <p className="text-sm">{msg.content}</p>
              <p className="text-xs mt-1 opacity-70">
                <time dateTime={msg.timestamp instanceof Date ? msg.timestamp.toISOString() : msg.timestamp}>
                  {msg.timestamp instanceof Date 
                    ? msg.timestamp.toLocaleTimeString()
                    : new Date(msg.timestamp).toLocaleTimeString()
                  }
                </time>
              </p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="text-left mb-4" role="status" aria-label="AI is typing a response">
            <div className="inline-block bg-gray-200 text-gray-800 px-4 py-2 rounded-lg">
              <p className="text-sm">AI is typing...</p>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </section>

      {/* Message Input */}
      <form 
        onSubmit={handleSendMessage} 
        className="flex gap-2"
        aria-labelledby="message-form-title"
      >
        <h3 id="message-form-title" className="sr-only">Send a message</h3>
        <label htmlFor="message-input" className="sr-only">
          Type your message to the AI Life Coach
        </label>
        <input
          id="message-input"
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type your message... (e.g., 'I'm feeling stressed about work')"
          className="flex-1 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-colors"
          disabled={loading}
          aria-describedby="message-help"
          autoComplete="off"
        />
        <div id="message-help" className="sr-only">
          Share your thoughts, feelings, or questions with your AI Life Coach
        </div>
        <button
          type="submit"
          disabled={loading || !inputMessage.trim()}
          className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 focus:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors"
          aria-label="Send your message to the AI Life Coach"
        >
          Send
        </button>
      </form>
    </div>
  );
};

// Keep your existing FileUpload component
const FileUpload = ({ onFileAnalyzed }) => {
  const [dragOver, setDragOver] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [lastAnalysis, setLastAnalysis] = useState(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const textFile = files.find(file => 
      file.type === 'text/plain' || 
      file.name.endsWith('.txt') || 
      file.name.endsWith('.md')
    );

    if (!textFile) {
      alert('Please drop a text file (.txt or .md)');
      return;
    }

    if (textFile.size > 10000) {
      alert('File too large. Please use files under 10KB.');
      return;
    }

    await analyzeFile(textFile);
  };

  const handleFileInput = async (e) => {
    const file = e.target.files[0];
    if (file) {
      await analyzeFile(file);
    }
  };

  const analyzeFile = async (file) => {
    setAnalyzing(true);
    
    try {
      const text = await readFileAsText(file);
      const moodScore = analyzeSentiment(text);
      const analysis = {
        fileName: file.name,
        wordCount: text.split(' ').length,
        moodScore: moodScore,
        moodLabel: getMoodLabel(moodScore),
        preview: text.substring(0, 100) + (text.length > 100 ? '...' : '')
      };
      
      setLastAnalysis(analysis);
      onFileAnalyzed(analysis);
      
    } catch (error) {
      console.error('File analysis error:', error);
      alert('Failed to analyze file. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  const readFileAsText = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target.result);
      reader.onerror = (e) => reject(e);
      reader.readAsText(file);
    });
  };

  const analyzeSentiment = (text) => {
    const positiveWords = ['happy', 'joy', 'love', 'great', 'excellent', 'amazing', 'wonderful', 'good', 'fantastic', 'awesome'];
    const negativeWords = ['sad', 'angry', 'hate', 'terrible', 'awful', 'horrible', 'bad', 'worst', 'depressed', 'anxious'];
    
    const words = text.toLowerCase().split(/\W+/);
    let score = 5;
    
    words.forEach(word => {
      if (positiveWords.includes(word)) score += 0.5;
      if (negativeWords.includes(word)) score -= 0.5;
    });
    
    return Math.max(1, Math.min(10, Math.round(score * 10) / 10));
  };

  const getMoodLabel = (score) => {
    if (score >= 8) return 'Very Positive';
    if (score >= 6) return 'Positive';
    if (score >= 4) return 'Neutral';
    if (score >= 2) return 'Negative';
    return 'Very Negative';
  };

  return (
    <div className="mb-4">
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        role="button"
        aria-label="Drag and drop text files here for mood analysis"
        tabIndex={0}
      >
        {analyzing ? (
          <div className="flex items-center justify-center" role="status" aria-label="Analyzing uploaded file">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-2"></div>
            <span className="text-gray-600">Analyzing your text...</span>
          </div>
        ) : (
          <>
            <div className="mb-2">
              <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <p className="text-lg font-medium text-gray-900 mb-1">
              Drop your text file here
            </p>
            <p className="text-sm text-gray-600 mb-3">
              or{' '}
              <button 
                onClick={() => document.getElementById('file-input').click()}
                className="text-blue-600 hover:text-blue-800 font-medium focus:outline-none focus:underline"
               aria-label="Browse for files to upload"
             >
               browse files
             </button>
           </p>
           <p className="text-xs text-gray-500">
             Supports .txt and .md files (max 10KB)
           </p>
           <input
             id="file-input"
             type="file"
             accept=".txt,.md,text/plain"
             onChange={handleFileInput}
             className="sr-only"
             aria-label="Select text file for mood analysis"
           />
         </>
       )}
     </div>

     {lastAnalysis && (
       <div 
         className="mt-4 p-4 bg-white rounded-lg border border-gray-200"
         role="region"
         aria-labelledby="analysis-results-title"
       >
         <h4 id="analysis-results-title" className="font-medium text-gray-900 mb-2">📄 File Analysis Results</h4>
         <div className="grid grid-cols-2 gap-4 text-sm">
           <div>
             <span className="text-gray-600">File:</span>
             <span className="ml-2 font-medium">{lastAnalysis.fileName}</span>
           </div>
           <div>
             <span className="text-gray-600">Words:</span>
             <span className="ml-2 font-medium">{lastAnalysis.wordCount}</span>
           </div>
           <div>
             <span className="text-gray-600">Mood Score:</span>
             <span className="ml-2 font-medium">{lastAnalysis.moodScore}/10</span>
           </div>
           <div>
             <span className="text-gray-600">Mood:</span>
             <span className={`ml-2 font-medium ${
               lastAnalysis.moodScore >= 6 ? 'text-green-600' : 
               lastAnalysis.moodScore >= 4 ? 'text-yellow-600' : 'text-red-600'
             }`}>
               {lastAnalysis.moodLabel}
             </span>
           </div>
         </div>
         <div className="mt-2">
           <span className="text-gray-600 text-sm">Preview:</span>
           <p className="text-sm text-gray-800 mt-1 italic">"{lastAnalysis.preview}"</p>
         </div>
       </div>
     )}
   </div>
 );
};

export default App;
