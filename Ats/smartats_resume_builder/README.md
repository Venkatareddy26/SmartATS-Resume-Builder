# 🚀 SmartATS Resume Builder

An AI-powered ATS (Applicant Tracking System) Resume Builder that helps you create optimized resumes with intelligent suggestions, real-time scoring, and professional templates.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)

## 📋 Table of Contents

- [Features](#-features)
- [Architecture](#-architecture)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Running the Application](#-running-the-application)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

### Core Features
- 🤖 **AI-Powered Resume Assistant** - Get intelligent suggestions using Cohere AI
- 📊 **Real-time ATS Score** - Instant feedback on resume optimization (0-100 scale)
- 🎨 **Professional Templates** - 6 ATS-friendly resume templates:
  - Modern - Clean and contemporary design
  - Executive - Professional leadership-focused layout
  - Creative - Unique design for creative professionals
  - Minimal - Simple and elegant
  - Academic - Research and education focused
  - Technical - Developer and engineer optimized
- 💡 **Smart Suggestions** - AI-driven content recommendations
- 🔍 **Keyword Optimization** - Industry-specific keyword analysis
- 📱 **Responsive Design** - Works seamlessly on all devices
- 💾 **Auto-save** - Automatic saving to localStorage
- 📄 **PDF Export** - Download professional PDF resumes
- 📈 **Analytics Dashboard** - Track views, downloads, and applications
- 🎯 **Template Switcher** - Switch between templates in real-time

## 🏗️ Architecture

```
┌─────────────────┐
│  React Frontend │ (Port 5173)
│   (TypeScript)  │
└────────┬────────┘
         │
         │ HTTP/REST
         │
┌────────▼────────┐
│   Backend API   │ (Port 3000)
│   (Node.js +    │
│    Express)     │
└────────┬────────┘
         │
         ├──────────┐
         │          │
┌────────▼──┐  ┌───▼──────┐
│ In-Memory │  │ Cohere   │
│ Database  │  │ AI API   │
└───────────┘  └──────────┘
```

### Components

1. **Frontend** - React 18 + TypeScript + Vite (Port 5173)
2. **Backend API** - Node.js/Express (Port 3000)
3. **Database** - In-memory storage (for demo)
4. **AI Service** - Cohere API integration

## 🛠️ Tech Stack

### Backend
- **Node.js** (v18+) - Runtime environment
- **Express.js** - Web framework
- **Cohere AI** - AI-powered resume assistance
- **CORS** - Cross-origin resource sharing
- **Body-parser** - Request body parsing

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **TailwindCSS** - Utility-first CSS framework
- **React Query** - Data fetching and caching
- **Lucide React** - Icon library
- **jsPDF** - PDF generation

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** >= 18.0.0 ([Download](https://nodejs.org/))
- **npm** or **yarn** - Package manager
- **Git** ([Download](https://git-scm.com/))

### API Keys Required
- **Cohere API Key** - Get a free trial key from [Cohere Platform](https://dashboard.cohere.com/)

## 🚀 Installation

### 1. Clone the Repository
```bash
git clone https://github.com/Venkatareddy26/SmartATS-Resume-Builder.git
cd SmartATS-Resume-Builder/Ats/smartats_resume_builder
```

### 2. Install Backend Dependencies
```bash
npm install
```

### 3. Install Frontend Dependencies
```bash
cd frontend-react
npm install
cd ..
```

### 4. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
PORT=3000
JWT_SECRET=smartats_secret_key_2024_demo
NODE_ENV=development
COHERE_API_KEY=your_cohere_api_key_here
```

Replace `your_cohere_api_key_here` with your actual Cohere API key.

## 🏃 Running the Application

### Development Mode

Open two terminal windows:

**Terminal 1 - Backend API:**
```bash
npm run dev
```
Server runs on `http://localhost:3000`

**Terminal 2 - React Frontend:**
```bash
cd frontend-react
npm run dev
```
Frontend runs on `http://localhost:5173`

Then open your browser and navigate to `http://localhost:5173`

### Production Mode

#### 1. Build Frontend
```bash
cd frontend-react
npm run build
cd ..
```

#### 2. Start Backend
```bash
NODE_ENV=production npm start
```

## 📡 API Documentation

### Base URL
```
http://localhost:3000/api
```

### Resume Endpoints

#### Create Resume
```http
POST /api/resumes
Content-Type: application/json

{
  "title": "Software Engineer Resume",
  "template": "modern",
  "personalInfo": {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "location": "San Francisco, CA"
  },
  "summary": "Experienced software engineer...",
  "experience": [...],
  "education": [...],
  "skills": [...]
}
```

#### Get All Resumes
```http
GET /api/resumes
```

#### Get Resume by ID
```http
GET /api/resumes/:id
```

#### Update Resume
```http
PUT /api/resumes/:id
Content-Type: application/json

{
  "title": "Updated Title",
  "content": { ... }
}
```

#### Delete Resume
```http
DELETE /api/resumes/:id
```

#### Track Resume View
```http
POST /api/resumes/:id/view
```

#### Track Resume Download
```http
POST /api/resumes/:id/download
```

#### Track Resume Application
```http
POST /api/resumes/:id/application
```

### AI Endpoints

#### Get AI Suggestions
```http
POST /api/ai/chat
Content-Type: application/json

{
  "message": "How can I improve my resume summary?"
}
```

Response:
```json
{
  "response": "AI-generated suggestion..."
}
```

### Health Check
```http
GET /api/health
```

Response:
```json
{
  "status": "ok",
  "message": "SmartATS API is running",
  "uptime": 12345.67,
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## 📁 Project Structure

```
smartats_resume_builder/
├── backend/                # Node.js Backend
│   ├── routes/
│   │   ├── resumes.js     # Resume CRUD operations
│   │   └── ai.js          # AI integration
│   ├── database.js        # In-memory database
│   └── server.js          # Express server
│
├── frontend-react/        # React Frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   │   ├── LandingPage.tsx
│   │   │   ├── EditorPage.tsx
│   │   │   ├── TemplatesPage.tsx
│   │   │   ├── AnalyticsPage.tsx
│   │   │   └── AIAssistantPage.tsx
│   │   ├── services/      # API services
│   │   ├── types/         # TypeScript types
│   │   ├── App.tsx        # Main app component
│   │   └── main.tsx       # Entry point
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.js
│
├── .env                   # Environment variables
├── .env.example           # Environment template
├── package.json           # Backend dependencies
└── README.md              # This file
```

## 🎨 Available Templates

1. **Modern** - Clean, contemporary design perfect for tech professionals
2. **Executive** - Professional layout for leadership positions
3. **Creative** - Unique design for creative industries
4. **Minimal** - Simple and elegant for any profession
5. **Academic** - Research and education focused
6. **Technical** - Optimized for developers and engineers

## 🔧 Development

### Code Style

#### Backend (JavaScript)
```bash
npm run lint
```

#### Frontend (TypeScript)
```bash
cd frontend-react
npm run lint
npm run type-check
```

### Adding New Features

1. Create feature branch: `git checkout -b feature/your-feature`
2. Make changes and commit: `git commit -am 'Add new feature'`
3. Push to branch: `git push origin feature/your-feature`
4. Create Pull Request

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Contribution Guidelines
- Follow the existing code style
- Write clean, maintainable code
- Update documentation as needed
- Keep commits atomic and well-described

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Author

- **Venkata Reddy** - [GitHub](https://github.com/Venkatareddy26)

## 🙏 Acknowledgments

- Cohere AI for providing the AI API
- React and Vite communities
- TailwindCSS team
- All contributors and supporters

## 📞 Support

- 🐛 Issues: [GitHub Issues](https://github.com/Venkatareddy26/SmartATS-Resume-Builder/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/Venkatareddy26/SmartATS-Resume-Builder/discussions)

## 🗺️ Roadmap

- [ ] User authentication and accounts
- [ ] Cloud database integration (PostgreSQL/MongoDB)
- [ ] More resume templates
- [ ] LinkedIn profile import
- [ ] Job board integration
- [ ] Cover letter generator
- [ ] Mobile app (React Native)
- [ ] Chrome extension
- [ ] Team collaboration features
- [ ] Advanced analytics dashboard

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/Venkatareddy26/SmartATS-Resume-Builder.git

# Navigate to project directory
cd SmartATS-Resume-Builder/Ats/smartats_resume_builder

# Install backend dependencies
npm install

# Install frontend dependencies
cd frontend-react && npm install && cd ..

# Create .env file and add your Cohere API key
echo "COHERE_API_KEY=your_key_here" > .env

# Start backend (Terminal 1)
npm run dev

# Start frontend (Terminal 2)
cd frontend-react && npm run dev
```

Visit `http://localhost:5173` and start building your resume!

---

Made with ❤️ by Venkata Reddy
