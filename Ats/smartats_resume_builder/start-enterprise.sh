#!/bin/bash

# SmartATS Enterprise Startup Script
# This script starts all services for the enterprise system

set -e

echo "🚀 Starting SmartATS Enterprise System..."
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  Docker is not running. Please start Docker first.${NC}"
    exit 1
fi

# Check if .env files exist
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  .env file not found. Creating from example...${NC}"
    cp .env.example .env
    echo -e "${BLUE}ℹ️  Please edit .env file with your configuration${NC}"
fi

if [ ! -f ai-service/.env ]; then
    echo -e "${YELLOW}⚠️  ai-service/.env file not found. Creating from example...${NC}"
    cp ai-service/.env.example ai-service/.env
    echo -e "${BLUE}ℹ️  Please edit ai-service/.env file with your configuration${NC}"
fi

# Start services with Docker Compose
echo -e "${BLUE}📦 Starting Docker containers...${NC}"
docker-compose up -d

# Wait for services to be healthy
echo -e "${BLUE}⏳ Waiting for services to be ready...${NC}"
sleep 10

# Check service health
echo ""
echo -e "${GREEN}✅ Checking service health...${NC}"
echo ""

# Check PostgreSQL
if docker-compose exec -T postgres pg_isready -U smartats_user > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} PostgreSQL is ready"
else
    echo -e "${YELLOW}⚠${NC} PostgreSQL is not ready yet"
fi

# Check Redis
if docker-compose exec -T redis redis-cli ping > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} Redis is ready"
else
    echo -e "${YELLOW}⚠${NC} Redis is not ready yet"
fi

# Check AI Service
if curl -s http://localhost:8000/health > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} AI Service is ready"
else
    echo -e "${YELLOW}⚠${NC} AI Service is starting..."
fi

# Check API Gateway
if curl -s http://localhost:3000/health > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} API Gateway is ready"
else
    echo -e "${YELLOW}⚠${NC} API Gateway is starting..."
fi

echo ""
echo -e "${GREEN}🎉 SmartATS Enterprise is starting!${NC}"
echo ""
echo "📍 Access Points:"
echo "   Frontend:        http://localhost"
echo "   API Gateway:     http://localhost:3000"
echo "   AI Service:      http://localhost:8000"
echo "   AI Service Docs: http://localhost:8000/docs"
echo ""
echo "📊 Monitoring:"
echo "   Metrics:         http://localhost:8000/metrics"
echo "   Health Check:    http://localhost:3000/health"
echo ""
echo "🔧 Useful Commands:"
echo "   View logs:       docker-compose logs -f"
echo "   Stop services:   docker-compose down"
echo "   Restart:         docker-compose restart"
echo "   View status:     docker-compose ps"
echo ""
echo -e "${BLUE}💡 Tip: Run 'docker-compose logs -f' to view real-time logs${NC}"
echo ""
