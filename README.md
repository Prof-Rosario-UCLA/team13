# AI Life Coach App - Testing Deployment

A comprehensive AI-powered mental health and relationship advice platform designed to provide personalized guidance and support through intelligent conversations.

## Purpose and Overview

The AI Life Coach is a web-based application that serves as a digital mental health companion, offering users a safe space to discuss their emotional wellbeing, relationship challenges, and personal development goals. Built as a progressive web app (PWA), it combines modern web technologies with artificial intelligence to deliver accessible mental health support.

## Key Functionality

### Core Features
- **AI-Powered Conversations**: Engage with an intelligent life coach that specializes in mental health support, relationship advice, and personal development guidance
- **Document Analysis**: Upload text documents for mood analysis and sentiment scoring using WebAssembly-powered processing
- **Secure User Accounts**: Create and manage personal accounts with JWT-based authentication
- **Responsive Design**: Fully functional across all devices, from mobile phones (320px+) to desktop computers
- **Offline Capability**: Continue using the app even without internet connection through PWA technology

### Mental Health Support
The AI coach is trained to help with:
- Stress and anxiety management
- Depression support and coping strategies
- Emotional regulation techniques
- Self-care recommendations
- Crisis intervention guidance (with professional referrals)

### Relationship Guidance
Provides assistance with:
- Communication skills improvement
- Conflict resolution strategies
- Family relationship dynamics
- Friendship challenges
- Romantic relationship advice
- Boundary setting and maintenance

### Personal Development
Supports users in:
- Goal setting and achievement
- Motivation and accountability
- Confidence building
- Life planning and direction
- Habit formation and breaking
- Self-reflection and awareness

## Technical Architecture

### Frontend Technologies
- **React.js**: Modern component-based user interface
- **Progressive Web App (PWA)**: Installable app with offline functionality
- **WebAssembly**: High-performance mood analysis and text processing
- **Responsive CSS**: Mobile-first design supporting screens from 320px
- **Drag & Drop API**: Intuitive file upload interface

### Backend Infrastructure
- **Node.js & Express**: Robust server-side framework
- **MongoDB with Mongoose**: Scalable NoSQL database with object modeling
- **JWT Authentication**: Secure token-based user authentication with HTTP-only cookies
- **OpenAI API Integration**: Advanced AI conversation capabilities
- **Security Middleware**: Protection against XSS, CSRF, and injection attacks

### Key Security Features
- HTTP-only cookie storage for JWT tokens
- Bcrypt password hashing with salt rounds
- Input validation and sanitization
- CORS protection and security headers
- HTTPS enforcement in production

## Local Deployment

1. Clone the repository:
```bash
git clone <repository-url>
cd ai-life-coach
```

2. Install dependencies:
```bash
cd server
npm install
```

3. Create a `.env` file in the server directory with the following variables:
```
NODE_ENV=development
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
OPENAI_API_KEY=your_openai_api_key
PORT=8080
```

4. Ensure MongoDB is running and accessible via your connection string

5. Start the development server:
```bash
npm start
```

The app will be available at `http://localhost:8080`

### Prerequisites
- Node.js (version 18 or higher)
- MongoDB database (local installation or cloud service like MongoDB Atlas)
- OpenAI API key for AI conversation functionality
- Modern web browser with JavaScript enabled

## Google App Engine Deployment

### Prerequisites for Production Deployment
- Google Cloud Platform account
- Google Cloud SDK installed locally
- Project created in Google Cloud Console
- App Engine API enabled for your project

### Deployment Steps

1. Install Google Cloud SDK:
```bash
# On macOS with Homebrew
brew install google-cloud-sdk

# On Windows, download from: https://cloud.google.com/sdk/docs/install
# On Linux, follow: https://cloud.google.com/sdk/docs/install
```

2. Initialize and authenticate with Google Cloud:
```bash
gcloud init
gcloud auth login
```

3. Set your project ID:
```bash
gcloud config set project YOUR_PROJECT_ID
```

4. Ensure your environment variables are properly configured in `app.yaml`:
```yaml
runtime: nodejs20

env_variables:
  NODE_ENV: production
  MONGODB_URI: your_production_mongodb_uri
  JWT_SECRET: your_production_jwt_secret
  OPENAI_API_KEY: your_openai_api_key

automatic_scaling:
  min_instances: 1
  max_instances: 5

resources:
  cpu: 1
  memory_gb: 0.5
```

5. Build the React frontend (if applicable):
```bash
npm run build
```

6. Deploy to App Engine:
```bash
gcloud app deploy
```

7. View your deployed application:
```bash
gcloud app browse
```

### Environment Configuration
For production deployment, ensure all sensitive environment variables are properly configured:
- Use MongoDB Atlas or another cloud MongoDB service for production
- Generate a strong JWT secret for production
- Verify OpenAI API key has sufficient credits and rate limits

### Post-Deployment
- Monitor application logs: `gcloud app logs tail -s default`
- Check application health at: `https://YOUR_PROJECT_ID.appspot.com/api/health`
- Configure custom domain (optional): Use Google Cloud Console to map custom domains

## REST API Endpoints

### Authentication Routes (`/api/auth`)

**POST `/api/auth/register`**
Create a new user account with email and password.

Request Body:
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```
Response: User object with authentication token set as HTTP-only cookie

**POST `/api/auth/login`**
Authenticate existing user credentials.

Request Body:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```
Response: User object with authentication token set as HTTP-only cookie

**POST `/api/auth/logout`**
End current user session by clearing authentication cookie.

Response: Success message confirming logout

**GET `/api/auth/me`**
Retrieve current authenticated user information.

Authentication: Requires valid JWT token in HTTP-only cookie
Response: Current user profile data

### Chat Routes (`/api/chat`)

**POST `/api/chat/message`**
Send a message to the AI life coach and receive personalized response.

Authentication: Requires valid JWT token in HTTP-only cookie

Request Body:
```json
{
  "message": "I'm feeling really overwhelmed with work stress lately and don't know how to cope"
}
```
Response: AI-generated response with mental health guidance and follow-up questions

### Utility Routes

**GET `/api/health`**
Monitor server status and connectivity.

Response: Server health information including timestamp and environment status

## User Experience Flow

### Getting Started
1. **Account Creation**: New users register with email, password, and display name
2. **Secure Login**: Existing users authenticate with email and password
3. **Chat Interface**: Access the main conversation interface with the AI life coach
4. **Document Upload**: Optionally upload text documents for mood analysis via drag-and-drop

### Conversation Experience
- **Natural Dialogue**: Chat naturally with the AI about mental health concerns, relationship issues, or personal goals
- **Personalized Responses**: Receive tailored advice based on your specific situation and needs
- **Follow-up Questions**: The AI asks thoughtful questions to better understand your circumstances
- **Resource Recommendations**: Get practical coping strategies, and exercises


