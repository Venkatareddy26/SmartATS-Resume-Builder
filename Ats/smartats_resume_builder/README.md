# 🚀 SmartATS Resume Builder

An enterprise-grade AI-powered ATS (Applicant Tracking System) Resume Builder with microservices architecture. Build ATS-optimized resumes with intelligent keyword suggestions, real-time scoring, and professional templates.

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)
![Python](https://img.shields.io/badge/python-%3E%3D3.9-blue.svg)

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
- [Development](#-development)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

### Core Features
- 🤖 **AI-Powered Resume Analysis** - Intelligent keyword extraction and ATS scoring
- 📊 **Real-time ATS Score** - Get instant feedback on resume optimization
- 🎨 **Professional Templates** - Multiple ATS-friendly resume templates
- � **Smart Suggestions** - AI-driven content recommendations
- 🔍 **Keyword Optimization** - Industry-specific keyword suggestions
- 📱 **Responsive Design** - Works seamlessly on all devices
- 🔐 **Secure Authentication** - JWT-based user authentication
- 💾 **Auto-save** - Never lose your work with automatic saving
- 📄 **PDF Export** - Download professional PDF resumes
- 🌐 **Multi-language Support** - Support for multiple languages

### Enterprise Features
- 🏗️ **Microservices Architecture** - Scalable and maintainable
- 🐳 **Docker Support** - Easy deployment with Docker Compose
- 📈 **Performance Optimized** - Compression, caching, and CDN ready
- 🔒 **Security Hardened** - Helmet.js, CORS, rate limiting
- 📊 **Monitoring Ready** - Prometheus metrics and health checks
- 🗄️ **Database Backed** - PostgreSQL with Redis caching
- 🔄 **CI/CD Ready** - GitHub Actions workflows included

## 🏗️ Architecture

```
┌─────────────────┐
│   Nginx Proxy   │ (Port 80/443)
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
┌───▼──┐  ┌──▼───┐
│ API  │  │  AI  │
│Gateway│  │Service│
│(Node)│  │(Python)│
└───┬──┘  └──┬───┘
    │        │
    └────┬───┘
         │
    ┌────┴────┐
    │         │
┌───▼──┐  ┌──▼───┐
│Postgres│ │Redis │
└───────┘  └──────┘
```

### Components

1. **Frontend** - Vanilla JS + React (TypeScript)
2. **API Gateway** - Node.js/Express (Port 3000)
3. **AI Service** - Python/FastAPI (Port 8000)
4. **Database** - PostgreSQL (Port 5432)
5. **Cache** - Redis (Port 6379)
6. **Reverse Proxy** - Nginx (Port 80)

## 🛠️ Tech Stack

### Backend
- **Node.js** (v18+) - API Gateway
- **Express.js** - Web framework
- **Python** (v3.9+) - AI Service
- **FastAPI** - Python web framework
- **PostgreSQL** - Primary database
- **Redis** - Caching layer

### AI/ML
- **OpenAI GPT-4** - Resume analysis and suggestions
- **Anthropic Claude** - Alternative AI model
- **Transformers** - NLP processing
- **spaCy** - Text analysis
- **scikit-learn** - ML algorithms

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **Redux Toolkit** - State management
- **React Query** - Data fetching
- **Framer Motion** - Animations

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Multi-container orchestration
- **Nginx** - Reverse proxy
- **GitHub Actions** - CI/CD

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** >= 18.0.0 ([Download](https://nodejs.org/))
- **Python** >= 3.9 ([Download](https://www.python.org/))
- **PostgreSQL** >= 15 ([Download](https://www.postgresql.org/))
- **Redis** >= 7 ([Download](https://redis.io/))
- **Docker** & **Docker Compose** (Optional, for containerized deployment)
- **Git** ([Download](https://git-scm.com/))

### API Keys Required
- **OpenAI API Key** - Get from [OpenAI Platform](https://platform.openai.com/)

## 🚀 Installation

### Option 1: Local Development Setup

#### 1. Clone the Repository
```bash
git clone https://github.com/Venkatareddy26/SmartATS-Resume-Builder.git
cd SmartATS-Resume-Builder/Ats/smartats_resume_builder
```

#### 2. Install Backend Dependencies
```bash
npm install
```

#### 3. Install AI Service Dependencies
```bash
cd ai-service
pip install -r requirements.txt
# or using virtual environment (recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cd ..
```

#### 4. Install Frontend Dependencies (React)
```bash
cd frontend-react
npm install
cd ..
```

#### 5. Setup Database
```bash
# Start PostgreSQL and create database
createdb smartats

# Run schema
psql -d smartats -f database/schema.sql
```

#### 6. Setup Redis
```bash
# Start Redis server
redis-server
```

### Option 2: Docker Setup (Recommended)

#### 1. Clone the Repository
```bash
git clone https://github.com/Venkatareddy26/SmartATS-Resume-Builder.git
cd SmartATS-Resume-Builder/Ats/smartats_resume_builder
```

#### 2. Build and Start All Services
```bash
docker-compose up -d
```

That's it! All services will be automatically configured and started.

## ⚙️ Configuration

### 1. Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Security
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production

# OpenAI Configuration
OPENAI_API_KEY=sk-your-openai-api-key-here

# Database (if not using Docker)
DATABASE_URL=postgresql://smartats_user:smartats_password@localhost:5432/smartats

# Redis (if not using Docker)
REDIS_URL=redis://localhost:6379/0

# AI Service URL
AI_SERVICE_URL=http://localhost:8000
```

### 2. AI Service Configuration

Create `.env` in `ai-service/` directory:

```env
ENVIRONMENT=development
DEBUG=true
OPENAI_API_KEY=sk-your-openai-api-key-here
DATABASE_URL=postgresql+asyncpg://smartats_user:smartats_password@localhost:5432/smartats
REDIS_URL=redis://localhost:6379/0
```

### 3. Frontend Configuration

Create `.env` in `frontend-react/` directory:

```env
VITE_API_URL=http://localhost:3000/api
VITE_APP_NAME=SmartATS Resume Builder
```

## 🏃 Running the Application

### Development Mode

#### Option 1: Run All Services Separately

**Terminal 1 - Backend API:**
```bash
npm run dev
# Server runs on http://localhost:3000
```

**Terminal 2 - AI Service:**
```bash
npm run ai:dev
# AI Service runs on http://localhost:8000
```

**Terminal 3 - React Frontend:**
```bash
cd frontend-react
npm run dev
# Frontend runs on http://localhost:5173
```

#### Option 2: Using Docker Compose
```bash
# Start all services
docker-compose up

# Or run in detached mode
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

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

#### 3. Using Docker
```bash
docker-compose -f docker-compose.prod.yml up -d
```

## 📡 API Documentation

### Base URL
```
http://localhost:3000/api
```

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123",
  "name": "John Doe"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

### Resume Endpoints

#### Create Resume
```http
POST /api/resumes
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Software Engineer Resume",
  "content": { ... }
}
```

#### Get All Resumes
```http
GET /api/resumes
Authorization: Bearer <token>
```

#### Get Resume by ID
```http
GET /api/resumes/:id
Authorization: Bearer <token>
```

#### Update Resume
```http
PUT /api/resumes/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Title",
  "content": { ... }
}
```

#### Delete Resume
```http
DELETE /api/resumes/:id
Authorization: Bearer <token>
```

### AI Endpoints

#### Analyze Resume
```http
POST /api/ai/analyze
Authorization: Bearer <token>
Content-Type: application/json

{
  "resumeText": "Your resume content here...",
  "jobDescription": "Job description (optional)"
}
```

#### Get Keyword Suggestions
```http
POST /api/ai/keywords
Authorization: Bearer <token>
Content-Type: application/json

{
  "industry": "Software Engineering",
  "role": "Full Stack Developer"
}
```

#### Improve Content
```http
POST /api/ai/improve
Authorization: Bearer <token>
Content-Type: application/json

{
  "text": "Content to improve",
  "context": "work_experience"
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
├── ai-service/              # Python AI microservice
│   ├── app/
│   │   ├── main.py         # FastAPI application
│   │   ├── models/         # AI models
│   │   ├── services/       # Business logic
│   │   └── utils/          # Utilities
│   ├── requirements.txt    # Python dependencies
│   └── Dockerfile
│
├── backend/                # Node.js API Gateway
│   ├── routes/            # API routes
│   │   ├── auth.js        # Authentication
│   │   ├── resumes.js     # Resume CRUD
│   │   └── ai.js          # AI integration
│   ├── database.js        # Database connection
│   └── server.js          # Express server
│
├── frontend/              # Vanilla JS frontend
│   ├── index.html         # Login page
│   ├── editor.html        # Resume editor
│   ├── landing.html       # Landing page
│   └── js/                # JavaScript files
│
├── frontend-react/        # React frontend (TypeScript)
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── store/         # Redux store
│   │   ├── hooks/         # Custom hooks
│   │   ├── services/      # API services
│   │   └── utils/         # Utilities
│   ├── package.json
│   └── vite.config.ts
│
├── database/              # Database files
│   └── schema.sql         # Database schema
│
├── docs/                  # Documentation
│   ├── architecture/      # Architecture docs
│   └── guides/            # User guides
│
├── docker-compose.yml     # Docker orchestration
├── package.json           # Node dependencies
├── .env.example           # Environment template
└── README.md              # This file
```

## 🔧 Development

### Code Style

#### Backend (JavaScript)
```bash
# Format code
npm run format

# Lint code
npm run lint
```

#### Frontend (TypeScript)
```bash
cd frontend-react
npm run lint
npm run format
npm run type-check
```

### Database Migrations

```bash
# Create new migration
npm run migrate:create

# Run migrations
npm run migrate:up

# Rollback migration
npm run migrate:down
```

### Adding New Features

1. Create feature branch: `git checkout -b feature/your-feature`
2. Make changes and commit: `git commit -am 'Add new feature'`
3. Push to branch: `git push origin feature/your-feature`
4. Create Pull Request

## 🧪 Testing

### Backend Tests
```bash
npm test
```

### AI Service Tests
```bash
npm run ai:test
# or
cd ai-service
pytest tests/ -v
```

### Frontend Tests
```bash
cd frontend-react
npm test
```

### Integration Tests
```bash
npm run test:integration
```

### E2E Tests
```bash
npm run test:e2e
```

## 🚢 Deployment

### Docker Deployment

#### 1. Build Images
```bash
docker-compose build
```

#### 2. Deploy to Production
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Manual Deployment

#### 1. Build Frontend
```bash
cd frontend-react
npm run build
```

#### 2. Set Environment
```bash
export NODE_ENV=production
export PORT=3000
```

#### 3. Start Services
```bash
# Start backend
npm start

# Start AI service
cd ai-service
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

### Cloud Deployment

#### AWS
- Use ECS/EKS for container orchestration
- RDS for PostgreSQL
- ElastiCache for Redis
- S3 for static assets
- CloudFront for CDN

#### Heroku
```bash
heroku create smartats-app
heroku addons:create heroku-postgresql
heroku addons:create heroku-redis
git push heroku main
```

#### DigitalOcean
- Use App Platform or Kubernetes
- Managed PostgreSQL
- Managed Redis

## 📊 Monitoring

### Health Checks
```bash
# API Health
curl http://localhost:3000/api/health

# AI Service Health
curl http://localhost:8000/health
```

### Logs
```bash
# Docker logs
docker-compose logs -f

# Specific service
docker-compose logs -f api-gateway
docker-compose logs -f ai-service
```

### Metrics
- Prometheus metrics available at `/metrics`
- Grafana dashboards included in `monitoring/`

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Contribution Guidelines
- Follow the existing code style
- Write tests for new features
- Update documentation
- Keep commits atomic and well-described

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Venkata Reddy** - [GitHub](https://github.com/Venkatareddy26)

## 🙏 Acknowledgments

- OpenAI for GPT-4 API
- FastAPI framework
- React and Vite communities
- All contributors and supporters

## 📞 Support

- 📧 Email: support@smartats.com
- 🐛 Issues: [GitHub Issues](https://github.com/Venkatareddy26/SmartATS-Resume-Builder/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/Venkatareddy26/SmartATS-Resume-Builder/discussions)

## 🗺️ Roadmap

- [ ] Multi-language support
- [ ] Advanced AI models integration
- [ ] Resume templates marketplace
- [ ] LinkedIn integration
- [ ] Job board integration
- [ ] Mobile app (React Native)
- [ ] Chrome extension
- [ ] Team collaboration features
- [ ] Analytics dashboard
- [ ] API rate limiting
- [ ] GraphQL API

---

Made with ❤️ by the SmartATS Team
