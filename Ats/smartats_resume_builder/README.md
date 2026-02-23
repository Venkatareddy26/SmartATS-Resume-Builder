# SmartATS - AI-Powered Resume Builder

Enterprise-grade resume builder with AI-powered optimization, ATS scoring, and job matching.

## 🚀 Quick Start

### Current System (Production Ready)

```bash
# Install dependencies
npm install

# Start backend server
npm start

# Access at http://localhost:3000
```

### React Frontend (Development)

```bash
# Navigate to React folder
cd frontend-react

# Install dependencies (if not done)
npm install

# Start development server
npm run dev

# Access at http://localhost:5173
```

## 📁 Project Structure

```
smartats_resume_builder/
├── backend/              # Node.js API Gateway (Port 3000)
├── frontend/             # Current Production Frontend (Vanilla JS)
├── frontend-react/       # New React Frontend (Port 5173)
├── ai-service/           # Python AI Service (Port 8000)
├── database/             # PostgreSQL Schema
└── docs/                 # Documentation
```

## 🎯 Features

### Current System
- ✅ User Authentication (JWT)
- ✅ Resume Editor with Auto-save
- ✅ AI-Powered Analysis
- ✅ ATS Scoring (0-100)
- ✅ Multiple Export Formats (PDF, Word, Text)
- ✅ Job Matching
- ✅ Keyword Extraction
- ✅ Dark Mode Support

### React System (In Development)
- ✅ Modern React 18 + TypeScript
- ✅ State Management (Zustand)
- ✅ API Client (Axios + React Query)
- ✅ Routing (React Router v6)
- ✅ Styling (Tailwind CSS)
- 🔄 Page Components (30% complete)

## 🛠️ Tech Stack

**Backend**: Node.js + Express  
**Frontend**: React 18 + TypeScript / Vanilla JS  
**AI Service**: Python + FastAPI  
**Database**: PostgreSQL + Redis  
**Infrastructure**: Docker + Docker Compose

## 📦 Installation

### Backend
```bash
npm install
```

### React Frontend
```bash
cd frontend-react
npm install
```

### AI Service
```bash
cd ai-service
pip install -r requirements.txt
```

## 🧪 Development

### Start Backend
```bash
npm start
# or with auto-reload
npm run dev
```

### Start React Frontend
```bash
cd frontend-react
npm run dev
```

### Start AI Service
```bash
cd ai-service
uvicorn app.main:app --reload
```

### Full Stack (Docker)
```bash
docker-compose up -d
```

## 📚 Documentation

- [Quick Start Guide](docs/guides/QUICKSTART.md)
- [React Migration Guide](docs/guides/REACT_MIGRATION_GUIDE.md)
- [Production Guide](docs/guides/PRODUCTION_READY.md)
- [Architecture](docs/architecture/ENTERPRISE_ARCHITECTURE.md)

## 🔧 Configuration

### Backend (.env)
```env
PORT=3000
NODE_ENV=development
JWT_SECRET=your-secret-key
```

### React Frontend (.env)
```env
VITE_API_URL=http://localhost:3000
VITE_AI_SERVICE_URL=http://localhost:8000
```

### AI Service (.env)
```env
OPENAI_API_KEY=your-openai-key
ENVIRONMENT=development
```

## 🧪 Testing

### Backend
```bash
npm test
```

### React Frontend
```bash
cd frontend-react
npm run type-check
npm run lint
npm test
```

### AI Service
```bash
cd ai-service
pytest
```

## 📦 Building for Production

### React Frontend
```bash
cd frontend-react
npm run build
# Output: dist/
```

### Docker
```bash
docker-compose -f docker-compose.prod.yml up -d
```

## 🚀 Deployment

### Frontend
- Vercel, Netlify, AWS S3 + CloudFront

### Backend
- AWS EC2, Heroku, DigitalOcean

### AI Service
- AWS ECS, Google Cloud Run

### Database
- AWS RDS, DigitalOcean Managed PostgreSQL

## 📊 API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Resumes
- `GET /api/resumes` - Get all resumes
- `POST /api/resumes` - Create resume
- `GET /api/resumes/:id` - Get resume
- `PUT /api/resumes/:id` - Update resume
- `DELETE /api/resumes/:id` - Delete resume

### AI Service
- `POST /api/v1/analyze/` - Analyze resume
- `POST /api/v1/optimize/` - Optimize content
- `POST /api/v1/match/` - Match with job
- `POST /api/v1/generate/` - Generate content
- `POST /api/v1/score/` - Quick ATS score

## 🔒 Security

- JWT Authentication
- Password Hashing (bcrypt)
- Helmet Security Headers
- CORS Configuration
- Rate Limiting (planned)
- Input Validation

## 📈 Performance

- API Caching (5-minute TTL)
- Compression (60% reduction)
- Static File Caching
- Debounced Operations
- Code Splitting (React)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests
5. Submit a pull request

## 📄 License

Proprietary - All rights reserved

## 🆘 Support

For issues or questions:
- Check documentation in `docs/`
- Review API documentation
- Check troubleshooting guides

---

**Version**: 2.0.0  
**Status**: Production Ready (Vanilla JS) / In Development (React)  
**Last Updated**: 2024
