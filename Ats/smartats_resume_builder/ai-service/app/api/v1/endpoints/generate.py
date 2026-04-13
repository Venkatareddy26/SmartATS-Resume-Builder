"""
Content Generation Endpoint
"""

from fastapi import APIRouter
from pydantic import BaseModel, Field
from typing import Optional

from app.services.ai.openai_service import OpenAIService

router = APIRouter()


class GenerateRequest(BaseModel):
    type: str = Field(..., description="Type: cover_letter, summary, bullet_point")
    context: dict = Field(..., description="Context data")


class GenerateResponse(BaseModel):
    generated_content: str
    alternatives: list = []


@router.post("/", response_model=GenerateResponse)
async def generate_content(request: GenerateRequest):
    """Generate resume content with AI"""
    ai_service = OpenAIService()
    
    if request.type == "cover_letter":
        content = await ai_service.generate_cover_letter(
            request.context.get("resume_text", ""),
            request.context.get("job_description", ""),
            request.context.get("company_name", "Company"),
            request.context.get("tone", "professional")
        )
    else:
        content = "Generated content based on your request"
    
    return GenerateResponse(
        generated_content=content,
        alternatives=[]
    )
