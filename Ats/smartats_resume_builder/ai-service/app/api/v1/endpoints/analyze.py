"""
Resume Analysis Endpoint
Comprehensive resume analysis with AI-powered insights
"""

from fastapi import APIRouter, HTTPException, BackgroundTasks
from pydantic import BaseModel, Field
from typing import List, Dict, Optional
import logging

from app.services.ats.scorer import ATSScorer
from app.services.nlp.keyword_extractor import KeywordExtractor
from app.services.ai.openai_service import OpenAIService

logger = logging.getLogger(__name__)
router = APIRouter()


class ResumeAnalysisRequest(BaseModel):
    """Request model for resume analysis"""
    resume_text: str = Field(..., description="Resume content as text")
    job_description: Optional[str] = Field(None, description="Optional job description for targeted analysis")
    analysis_type: str = Field("comprehensive", description="Type of analysis: basic, comprehensive, or detailed")


class ResumeAnalysisResponse(BaseModel):
    """Response model for resume analysis"""
    ats_score: int = Field(..., description="ATS compatibility score (0-100)")
    overall_score: int = Field(..., description="Overall resume quality score (0-100)")
    
    # Detailed scores
    scores: Dict[str, int] = Field(..., description="Breakdown of scores by category")
    
    # Keywords
    keywords: List[str] = Field(..., description="Extracted keywords from resume")
    missing_keywords: List[str] = Field(default_factory=list, description="Keywords missing from job description")
    
    # Suggestions
    suggestions: List[Dict[str, str]] = Field(..., description="Improvement suggestions")
    
    # Strengths and weaknesses
    strengths: List[str] = Field(..., description="Resume strengths")
    weaknesses: List[str] = Field(..., description="Areas for improvement")
    
    # Metrics
    metrics: Dict[str, any] = Field(..., description="Various resume metrics")
    
    # AI insights
    ai_insights: Optional[str] = Field(None, description="AI-generated insights")


@router.post("/", response_model=ResumeAnalysisResponse)
async def analyze_resume(
    request: ResumeAnalysisRequest,
    background_tasks: BackgroundTasks
):
    """
    Analyze resume comprehensively
    
    This endpoint provides:
    - ATS compatibility scoring
    - Keyword extraction and matching
    - Content quality analysis
    - Improvement suggestions
    - AI-powered insights
    """
    try:
        logger.info(f"Analyzing resume (type: {request.analysis_type})")
        
        # Initialize services
        ats_scorer = ATSScorer()
        keyword_extractor = KeywordExtractor()
        ai_service = OpenAIService()
        
        # 1. ATS Scoring
        ats_result = ats_scorer.score_resume(request.resume_text)
        
        # 2. Keyword Extraction
        keywords = keyword_extractor.extract_keywords(request.resume_text, top_n=20)
        
        # 3. Job Matching (if job description provided)
        missing_keywords = []
        if request.job_description:
            job_keywords = keyword_extractor.extract_keywords(request.job_description, top_n=30)
            missing_keywords = [kw for kw in job_keywords if kw.lower() not in request.resume_text.lower()]
        
        # 4. Content Analysis
        metrics = {
            "word_count": len(request.resume_text.split()),
            "character_count": len(request.resume_text),
            "bullet_points": request.resume_text.count("•") + request.resume_text.count("-"),
            "sections": _count_sections(request.resume_text),
            "action_verbs": _count_action_verbs(request.resume_text),
            "quantifiable_achievements": _count_numbers(request.resume_text),
        }
        
        # 5. Generate Suggestions
        suggestions = _generate_suggestions(ats_result, metrics, missing_keywords)
        
        # 6. Identify Strengths and Weaknesses
        strengths = _identify_strengths(ats_result, metrics)
        weaknesses = _identify_weaknesses(ats_result, metrics, missing_keywords)
        
        # 7. Calculate Overall Score
        overall_score = _calculate_overall_score(ats_result, metrics)
        
        # 8. AI Insights (async, optional)
        ai_insights = None
        if request.analysis_type in ["comprehensive", "detailed"]:
            try:
                ai_insights = await ai_service.generate_resume_insights(
                    request.resume_text,
                    request.job_description
                )
            except Exception as e:
                logger.warning(f"AI insights generation failed: {e}")
        
        # Log analytics in background
        background_tasks.add_task(_log_analysis, request.analysis_type, overall_score)
        
        return ResumeAnalysisResponse(
            ats_score=ats_result["score"],
            overall_score=overall_score,
            scores=ats_result["breakdown"],
            keywords=keywords,
            missing_keywords=missing_keywords[:10],  # Top 10 missing
            suggestions=suggestions,
            strengths=strengths,
            weaknesses=weaknesses,
            metrics=metrics,
            ai_insights=ai_insights
        )
        
    except Exception as e:
        logger.error(f"Resume analysis failed: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")


def _count_sections(text: str) -> int:
    """Count resume sections"""
    common_sections = [
        "experience", "education", "skills", "summary", "objective",
        "certifications", "projects", "awards", "publications"
    ]
    return sum(1 for section in common_sections if section in text.lower())


def _count_action_verbs(text: str) -> int:
    """Count action verbs in resume"""
    action_verbs = [
        "achieved", "improved", "developed", "managed", "led", "created",
        "implemented", "designed", "built", "increased", "reduced", "optimized"
    ]
    return sum(text.lower().count(verb) for verb in action_verbs)


def _count_numbers(text: str) -> int:
    """Count quantifiable achievements (numbers in text)"""
    import re
    return len(re.findall(r'\d+', text))


def _generate_suggestions(ats_result: Dict, metrics: Dict, missing_keywords: List[str]) -> List[Dict[str, str]]:
    """Generate improvement suggestions"""
    suggestions = []
    
    if ats_result["score"] < 70:
        suggestions.append({
            "category": "ATS Compatibility",
            "priority": "high",
            "suggestion": "Improve ATS compatibility by using standard section headings and avoiding complex formatting"
        })
    
    if metrics["action_verbs"] < 10:
        suggestions.append({
            "category": "Content",
            "priority": "high",
            "suggestion": "Use more action verbs to describe your achievements (e.g., 'Led', 'Developed', 'Improved')"
        })
    
    if metrics["quantifiable_achievements"] < 5:
        suggestions.append({
            "category": "Impact",
            "priority": "high",
            "suggestion": "Add quantifiable achievements with numbers and percentages to demonstrate impact"
        })
    
    if missing_keywords:
        suggestions.append({
            "category": "Keywords",
            "priority": "medium",
            "suggestion": f"Consider adding these relevant keywords: {', '.join(missing_keywords[:5])}"
        })
    
    if metrics["word_count"] < 300:
        suggestions.append({
            "category": "Length",
            "priority": "medium",
            "suggestion": "Resume is too short. Aim for 400-800 words to provide sufficient detail"
        })
    elif metrics["word_count"] > 1000:
        suggestions.append({
            "category": "Length",
            "priority": "low",
            "suggestion": "Resume is lengthy. Consider condensing to 1-2 pages for better readability"
        })
    
    return suggestions


def _identify_strengths(ats_result: Dict, metrics: Dict) -> List[str]:
    """Identify resume strengths"""
    strengths = []
    
    if ats_result["score"] >= 80:
        strengths.append("Excellent ATS compatibility")
    
    if metrics["action_verbs"] >= 15:
        strengths.append("Strong use of action verbs")
    
    if metrics["quantifiable_achievements"] >= 10:
        strengths.append("Good quantification of achievements")
    
    if metrics["sections"] >= 5:
        strengths.append("Comprehensive section coverage")
    
    if 400 <= metrics["word_count"] <= 800:
        strengths.append("Optimal resume length")
    
    return strengths if strengths else ["Resume has potential for improvement"]


def _identify_weaknesses(ats_result: Dict, metrics: Dict, missing_keywords: List[str]) -> List[str]:
    """Identify areas for improvement"""
    weaknesses = []
    
    if ats_result["score"] < 60:
        weaknesses.append("Low ATS compatibility score")
    
    if metrics["action_verbs"] < 8:
        weaknesses.append("Limited use of action verbs")
    
    if metrics["quantifiable_achievements"] < 5:
        weaknesses.append("Few quantifiable achievements")
    
    if len(missing_keywords) > 10:
        weaknesses.append("Missing many relevant keywords from job description")
    
    if metrics["sections"] < 4:
        weaknesses.append("Missing important resume sections")
    
    return weaknesses if weaknesses else []


def _calculate_overall_score(ats_result: Dict, metrics: Dict) -> int:
    """Calculate overall resume quality score"""
    score = 0
    
    # ATS score (40% weight)
    score += ats_result["score"] * 0.4
    
    # Content quality (30% weight)
    content_score = min(100, (
        (metrics["action_verbs"] / 15 * 100) * 0.4 +
        (metrics["quantifiable_achievements"] / 10 * 100) * 0.3 +
        (metrics["sections"] / 6 * 100) * 0.3
    ))
    score += content_score * 0.3
    
    # Length appropriateness (15% weight)
    if 400 <= metrics["word_count"] <= 800:
        length_score = 100
    elif metrics["word_count"] < 400:
        length_score = (metrics["word_count"] / 400) * 100
    else:
        length_score = max(50, 100 - (metrics["word_count"] - 800) / 10)
    score += length_score * 0.15
    
    # Bullet points (15% weight)
    bullet_score = min(100, (metrics["bullet_points"] / 15) * 100)
    score += bullet_score * 0.15
    
    return int(score)


async def _log_analysis(analysis_type: str, score: int):
    """Log analysis for analytics (background task)"""
    logger.info(f"Analysis completed: type={analysis_type}, score={score}")
    # TODO: Store in database for analytics
