# SmartATS Enterprise - Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Prerequisites
- Docker Desktop installed and running
- Git (to clone the repository)

### Step 1: Start the System

```bash
# Navigate to project directory
cd smartats_resume_builder

# Start all services with Docker
docker-compose up -d
```

That's it! The system will automatically:
- Start PostgreSQL database
- Start Redis cache
- Start Python AI Service
- Start Node.js API Gateway
- Initialize the database schema

### Step 2: Access the Application

Open your browser and visit:
- **Application**: http://localhost:3000
- **AI Service Docs**: http://localhost:8000/docs

### Step 3: Test the AI Service

Visit http://localhost:8000/docs and try the `/api/v1/analyze/` endpoint with this sample:

```json
{
  "resume_text": "John Doe\nSoftware Engineer\n\nExperience:\n- Led team of 5 developers\n- Increased performance by 40%\n- Implemented CI/CD pipeline",
  "analysis_type": "comprehensive"
}
```

## 📊 What You Get

### Current Features (Working Now)
✅ User authentication
✅ Resume editor with auto-save
✅ Multiple export formats
✅ AI-powered analysis
✅ ATS scoring
✅ Keyword extraction

### New Enterprise Features
✅ Advanced AI service (Python/FastAPI)
✅ Comprehensive ATS scoring
✅ Job matching capabilities
✅ Cover letter generation
✅ PostgreSQL database
✅ Redis caching
✅ Docker containerization

## 🔧 Useful Commands

```bash
# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Restart services
docker-compose restart

# View service status
docker-compose ps

# Rebuild services
docker-compose build
```

## 🎯 Next Steps

1. **Add OpenAI API Key** (Optional)
   - Edit `ai-service/.env`
   - Add: `OPENAI_API_KEY=sk-your-key-here`
   - Restart: `docker-compose restart ai-service`

2. **Explore AI Endpoints**
   - Visit http://localhost:8000/docs
   - Try different analysis types
   - Test job matching

3. **Integrate with Frontend**
   - Update API calls to use AI service
   - Add new features to UI
   - Enhance user experience

## 📚 Documentation

- **Architecture**: See `ENTERPRISE_ARCHITECTURE.md`
- **Implementation**: See `ENTERPRISE_IMPLEMENTATION.md`
- **Full README**: See `README_ENTERPRISE.md`

## 🆘 Troubleshooting

**Services not starting?**
- Check Docker is running: `docker info`
- Check ports are free: `netstat -an | grep "3000\|8000\|5432\|6379"`

**Database connection errors?**
- Wait 30 seconds for PostgreSQL to initialize
- Check logs: `docker-compose logs postgres`

**AI Service errors?**
- Check logs: `docker-compose logs ai-service`
- Verify Python dependencies installed

## 🎉 Success!

You now have a professional, enterprise-grade resume builder running locally!

---

**Need help?** Check the full documentation or open an issue.
