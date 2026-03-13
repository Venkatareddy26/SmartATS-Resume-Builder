# 🚀 SmartATS Resume Builder

An enterprise-grade AI-powered ATS (Applicant Tracking System) Resume Builder with microservices architecture. Build ATS-optimized resumes with intelligent keyword suggestions, real-time scoring, and professional templates.

![Version](https://img.shields.io/badge/version-2.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)
![Python](https://img.shields.io/badge/python-%3E%3D3.9-blue.svg)

## 📋 Quick Links

- [Full Documentation](./Ats/smartats_resume_builder/README.md)
- [Live Demo](#) (Coming Soon)
- [API Documentation](#api-documentation)

## ✨ Features

- 🤖 **AI-Powered Resume Analysis** - Intelligent keyword extraction and ATS scoring
- 📊 **Real-time ATS Score** - Get instant feedback on resume optimization
- 🎨 **Professional Templates** - Multiple ATS-friendly resume templates
- 💡 **Smart Suggestions** - AI-driven content recommendations
- 🔍 **Keyword Optimization** - Industry-specific keyword suggestions
- 📱 **Responsive Design** - Works seamlessly on all devices
- 🔐 **Secure Authentication** - JWT-based user authentication
- 💾 **Auto-save** - Never lose your work with automatic saving

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
- **Transformers** - NLP processing
- **spaCy** - Text analysis
- **scikit-learn** - ML algorithms

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **TailwindCSS** - Styling
- **Redux Toolkit** - State management

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18.0.0
- Python >= 3.9
- Docker & Docker Compose (recommended)
- OpenAI API Key

### Option 1: Docker (Recommended)

```bash
# Clone the repository
git clone https://github.com/Venkatareddy26/SmartATS-Resume-Builder.git
cd SmartATS-Resume-Builder/Ats/smartats_resume_builder

# Create .env file
cp .env.example .env
# Edit .env and add your OPENAI_API_KEY

# Start all services
docker-compose up -d
```

Access the application:
- Frontend: http://localhost:80
- API Gateway: http://localhost:3000
- AI Service: http://localhost:8000

### Option 2: Local Development

```bash
# Clone the repository
git clone https://github.com/Venkatareddy26/SmartATS-Resume-Builder.git
cd SmartATS-Resume-Builder/Ats/smartats_resume_builder

# Install dependencies
npm install

# Install AI service dependencies
cd ai-service
pip install -r requirements.txt
cd ..

# Setup environment
cp .env.example .env
# Edit .env and add your OPENAI_API_KEY

# Start backend (Terminal 1)
npm run dev

# Start AI service (Terminal 2)
npm run ai:dev

# Start React frontend (Terminal 3)
cd frontend-react
npm install
npm run dev
```

## 📡 API Endpoints

### Authentication
```http
POST /api/auth/register - Register new user
POST /api/auth/login    - Login user
```

### Resumes
```http
GET    /api/resumes     - Get all resumes
POST   /api/resumes     - Create resume
GET    /api/resumes/:id - Get resume by ID
PUT    /api/resumes/:id - Update resume
DELETE /api/resumes/:id - Delete resume
```

### AI Analysis
```http
POST /api/ai/analyze   - Analyze resume
POST /api/ai/keywords  - Get keyword suggestions
POST /api/ai/improve   - Improve content
```

## 📁 Project Structure

```
SmartATS-Resume-Builder/
└── Ats/
    └── smartats_resume_builder/
        ├── ai-service/          # Python AI microservice
        ├── backend/             # Node.js API Gateway
        ├── frontend/            # Vanilla JS frontend
        ├── frontend-react/      # React TypeScript frontend
        ├── database/            # Database schemas
        ├── docs/                # Documentation
        └── docker-compose.yml   # Docker orchestration
```

## 🧪 Testing

```bash
# Backend tests
npm test

# AI service tests
npm run ai:test

# Frontend tests
cd frontend-react
npm test
```

## 🚢 Deployment

### Docker Production
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### Cloud Platforms
- **AWS**: ECS/EKS + RDS + ElastiCache
- **Heroku**: `git push heroku main`
- **DigitalOcean**: App Platform or Kubernetes

## 📊 Monitoring

```bash
# Health checks
curl http://localhost:3000/api/health
curl http://localhost:8000/health

# View logs
docker-compose logs -f
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Author

**Venkata Reddy** - [GitHub](https://github.com/Venkatareddy26)

## 📞 Support

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

---

**For detailed documentation, setup instructions, and API reference, see the [Full Documentation](./Ats/smartats_resume_builder/README.md)**

Made with ❤️ by the SmartATS Team
