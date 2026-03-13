"""
Quick Scoring Endpoint
"""

from fastapi import APIRouter
from pydantic import BaseModel

from app.services.ats.scorer import ATSScorer

router = APIRouter()


class ScoreRequest(BaseModel):
    resume_text: str


class ScoreResponse(BaseModel):
    ats_score: int
    grade: str
    quick_tips: list


@router.post("/", response_model=ScoreResponse)
async def score_resume(request: ScoreRequest):
    """Quick ATS score"""
    scorer = ATSScorer()
    result = scorer.score_resume(request.resume_text)
    
    return ScoreResponse(
        ats_score=result["score"],
        grade=result["grade"],
        quick_tips=result["recommendations"][:3]
    )
