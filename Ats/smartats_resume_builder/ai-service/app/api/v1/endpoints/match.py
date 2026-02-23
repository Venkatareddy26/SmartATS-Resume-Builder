"""
Job Matching Endpoint
"""

from fastapi import APIRouter
from pydantic import BaseModel, Field
from typing import List, Dict

router = APIRouter()


class MatchRequest(BaseModel):
    resume_text: str
    job_description: str


class MatchResponse(BaseModel):
    match_score: int = Field(..., ge=0, le=100)
    matching_skills: List[str]
    missing_skills: List[str]
    recommendations: List[str]


@router.post("/", response_model=MatchResponse)
async def match_job(request: MatchRequest):
    """Match resume against job description"""
    return MatchResponse(
        match_score=75,
        matching_skills=["Python", "React", "AWS"],
        missing_skills=["Kubernetes", "GraphQL"],
        recommendations=["Add Kubernetes experience", "Highlight cloud architecture skills"]
    )
