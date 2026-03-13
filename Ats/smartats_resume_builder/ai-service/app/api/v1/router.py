"""
API v1 Router - Main router for all v1 endpoints
"""

from fastapi import APIRouter
from app.api.v1.endpoints import analyze, optimize, match, generate, score

api_router = APIRouter()

# Include all endpoint routers
api_router.include_router(analyze.router, prefix="/analyze", tags=["analyze"])
api_router.include_router(optimize.router, prefix="/optimize", tags=["optimize"])
api_router.include_router(match.router, prefix="/match", tags=["match"])
api_router.include_router(generate.router, prefix="/generate", tags=["generate"])
api_router.include_router(score.router, prefix="/score", tags=["score"])
