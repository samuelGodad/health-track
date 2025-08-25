# Enhanced Health - AI-Powered Health Tracking Platform

![Enhanced Health](https://img.shields.io/badge/Enhanced-Health-brightgreen)
![React](https://img.shields.io/badge/React-18.3.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-blue)
![AI-Powered](https://img.shields.io/badge/AI-Powered-GPT--4-orange)

A comprehensive health tracking application that leverages AI to automatically parse blood test results from PDF documents, providing intelligent health analytics, cycle planning, and personalized health insights.

## 🚀 Features

### 🔬 AI-Powered PDF Parsing
- **Automatic Blood Test Analysis**: Upload PDF blood test reports and get instant, accurate results
- **GPT-4 Vision Integration**: Advanced AI extracts test names, values, reference ranges, and status
- **Smart Date Extraction**: Automatically identifies collection dates and normalizes them
- **Category Standardization**: AI maps test categories to standardized medical classifications

### 📊 Comprehensive Health Analytics
- **Interactive Charts**: Visualize health trends over time with dynamic charts
- **Progress Tracking**: Monitor health metrics and set personalized targets
- **Trend Analysis**: Identify patterns and correlations in your health data
- **Export Capabilities**: Download your health data for external analysis

### 🩺 Blood Test Management
- **Smart Grouping**: Tests from the same day are automatically combined
- **Status Indicators**: Clear visual indicators for normal, high, and low results
- **Reference Range Tracking**: Compare your results against standard ranges
- **Historical Comparison**: Track changes in your health metrics over time

### 🗓️ Advanced Cycle Planning
- **Intelligent Cycle Tracking**: Plan and track menstrual cycles with precision
- **Hormone Integration**: Correlate blood test results with cycle phases
- **Predictive Analytics**: AI-powered insights for cycle optimization
- **Comprehensive Planning**: Weekly and monthly cycle management tools

### 🔐 Secure & Private
- **Supabase Authentication**: Secure user authentication and data protection
- **Encrypted Storage**: All health data is encrypted and securely stored
- **Privacy-First**: Your health data belongs to you
- **GDPR Compliant**: Built with privacy regulations in mind

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript for type-safe development
- **Vite** for fast development and optimized builds
- **Tailwind CSS** with shadcn/ui for beautiful, responsive UI
- **React Router** for seamless navigation
- **Recharts** for interactive data visualization
- **React Hook Form** with Zod validation

### Backend
- **Node.js** with Express for robust API development
- **OpenAI GPT-4 Vision** for intelligent PDF parsing
- **Multer** for secure file upload handling
- **CORS** enabled for cross-origin requests

### Database & Storage
- **Supabase** for authentication, database, and file storage
- **PostgreSQL** for reliable data persistence
- **Real-time subscriptions** for live data updates

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- OpenAI API key (for GPT-4 Vision API)
- Supabase account and project

### 1. Clone the Repository
```bash
git clone <repository-url>
cd enhanced-health
```

### 2. Install Dependencies
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
```

### 3. Environment Configuration

Create a `.env` file in the server directory:
```env
OPENAI_API_KEY=your_openai_api_key_here
NODE_ENV=development
```

### 4. Supabase Setup
1. Create a new Supabase project
2. Set up the required database tables
3. Configure authentication settings
4. Update the Supabase client configuration

### 5. Start the Application

**Backend (Development):**
```bash
cd server
npm start
```
The server will start on `http://localhost:3000` (local development) or use the deployed version at `https://health-track-1-x8n4.onrender.com`

**Frontend (Development):**
```bash
npm run dev
```
The frontend will start on `http://localhost:5173`

## 🚀 Deployment

### Backend Deployment (Render)
1. Connect your GitHub repository to Render
2. Configure the build settings
3. Set environment variables in Render dashboard
4. Deploy the Express server

### Frontend Deployment (Vercel)
1. Connect your GitHub repository to Vercel
2. Configure build settings and environment variables
3. Deploy the React application

## 📱 Usage Guide

### Blood Test Upload
1. Navigate to the Blood Tests page
2. Click "Upload Test Results"
3. Select your PDF blood test report
4. Wait for AI processing (typically 10-30 seconds)
5. Review and save your results

### Health Analytics
1. Visit the Analytics page to view your health trends
2. Use filters to focus on specific time periods
3. Export data for external analysis
4. Set health targets and track progress

### Cycle Planning
1. Access the Cycle Planner from the main navigation
2. Input your cycle information
3. Use AI-powered insights for optimization
4. Track correlations with blood test results

## 🔧 API Endpoints

### PDF Processing
- `POST /api/parse-pdf`: Process blood test PDFs with AI
- `GET /api/health`: Health check endpoint
- `GET /api/test`: Backend status endpoint

### Authentication
- Integrated with Supabase Auth
- Secure user sessions
- Role-based access control

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines for details.

### Development Guidelines
- Follow TypeScript best practices
- Use conventional commit messages
- Write comprehensive tests
- Maintain code documentation

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the documentation
- Review the troubleshooting guide

## 🔮 Roadmap

### Upcoming Features
- [ ] Mobile app development
- [ ] Advanced AI health insights
- [ ] Integration with wearable devices
- [ ] Telemedicine features
- [ ] Family health tracking
- [ ] Advanced analytics dashboard

### Planned Improvements
- [ ] Enhanced PDF parsing accuracy
- [ ] More comprehensive health metrics
- [ ] Advanced cycle prediction algorithms
- [ ] Integration with health providers

---

**Built with ❤️ for better health tracking and insights**

