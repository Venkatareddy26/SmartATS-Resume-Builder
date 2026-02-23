"""
OpenAI Service
Handles all OpenAI API interactions with fallback to mock responses
"""

import logging
from typing import Optional, Dict, List
from app.core.config import settings

logger = logging.getLogger(__name__)


class OpenAIService:
    """OpenAI API service with intelligent fallback"""
    
    def __init__(self):
        self.api_key = settings.OPENAI_API_KEY
        self.model = settings.OPENAI_MODEL
        self.use_openai = bool(self.api_key and self.api_key != "")
        
        if self.use_openai:
            try:
                from openai import AsyncOpenAI
                self.client = AsyncOpenAI(api_key=self.api_key)
                logger.info("OpenAI client initialized")
            except Exception as e:
                logger.warning(f"OpenAI initialization failed: {e}")
                self.use_openai = False
    
    async def generate_resume_insights(
        self,
        resume_text: str,
        job_description: Optional[str] = None
    ) -> str:
        """Generate AI-powered resume insights"""
        
        if self.use_openai:
            try:
                return await self._generate_with_openai(resume_text, job_description)
            except Exception as e:
                logger.error(f"OpenAI generation failed: {e}")
                return self._generate_mock_insights(resume_text, job_description)
        else:
            return self._generate_mock_insights(resume_text, job_description)
    
    async def optimize_bullet_point(self, bullet: str, context: str = "") -> str:
        """Optimize a single bullet point"""
        
        if self.use_openai:
            try:
                prompt = f"""Improve this resume bullet point to be more impactful and ATS-friendly:

Original: {bullet}

Context: {context}

Requirements:
- Start with a strong action verb
- Include quantifiable results if possible
- Be concise (1-2 lines)
- Use professional language

Improved version:"""
                
                response = await self.client.chat.completions.create(
                    model=self.model,
                    messages=[{"role": "user", "content": prompt}],
                    max_tokens=150,
                    temperature=0.7
                )
                
                return response.choices[0].message.content.strip()
            except Exception as e:
                logger.error(f"Bullet optimization failed: {e}")
                return self._mock_optimize_bullet(bullet)
        else:
            return self._mock_optimize_bullet(bullet)
    
    async def generate_cover_letter(
        self,
        resume_text: str,
        job_description: str,
        company_name: str,
        tone: str = "professional"
    ) -> str:
        """Generate a cover letter"""
        
        if self.use_openai:
            try:
                prompt = f"""Write a compelling cover letter for this job application:

Job Description:
{job_description}

Company: {company_name}
Tone: {tone}

Resume Summary:
{resume_text[:1000]}

Write a professional cover letter that:
- Highlights relevant experience
- Shows enthusiasm for the role
- Demonstrates cultural fit
- Is 3-4 paragraphs
- Uses {tone} tone"""
                
                response = await self.client.chat.completions.create(
                    model=self.model,
                    messages=[{"role": "user", "content": prompt}],
                    max_tokens=800,
                    temperature=0.8
                )
                
                return response.choices[0].message.content.strip()
            except Exception as e:
                logger.error(f"Cover letter generation failed: {e}")
                return self._mock_cover_letter(company_name)
        else:
            return self._mock_cover_letter(company_name)
    
    async def _generate_with_openai(
        self,
        resume_text: str,
        job_description: Optional[str]
    ) -> str:
        """Generate insights using OpenAI"""
        
        prompt = f"""Analyze this resume and provide professional insights:

Resume:
{resume_text}

{f"Job Description: {job_description}" if job_description else ""}

Provide:
1. Overall assessment (2-3 sentences)
2. Top 3 strengths
3. Top 3 areas for improvement
4. Specific actionable recommendations

Be concise and professional."""
        
        response = await self.client.chat.completions.create(
            model=self.model,
            messages=[{"role": "user", "content": prompt}],
            max_tokens=settings.OPENAI_MAX_TOKENS,
            temperature=settings.OPENAI_TEMPERATURE
        )
        
        return response.choices[0].message.content.strip()
    
    def _generate_mock_insights(
        self,
        resume_text: str,
        job_description: Optional[str]
    ) -> str:
        """Generate mock insights when OpenAI is unavailable"""
        
        word_count = len(resume_text.split())
        has_numbers = any(char.isdigit() for char in resume_text)
        
        insights = f"""**Overall Assessment:**
Your resume shows {word_count} words of content. """
        
        if has_numbers:
            insights += "Good use of quantifiable achievements. "
        else:
            insights += "Consider adding more quantifiable achievements. "
        
        insights += """

**Strengths:**
1. Clear professional experience section
2. Relevant skills highlighted
3. Proper resume structure

**Areas for Improvement:**
1. Add more quantifiable achievements with numbers and percentages
2. Use stronger action verbs to start bullet points
3. Tailor content more specifically to target roles

**Recommendations:**
- Include metrics: "Increased sales by 25%" instead of "Increased sales"
- Start bullets with power verbs: Led, Developed, Implemented, Optimized
- Keep resume to 1-2 pages for optimal readability
"""
        
        if job_description:
            insights += "\n- Align your keywords more closely with the job description"
        
        return insights
    
    def _mock_optimize_bullet(self, bullet: str) -> str:
        """Mock bullet point optimization"""
        # Simple improvements
        if not bullet[0].isupper():
            bullet = bullet.capitalize()
        
        if not any(char.isdigit() for char in bullet):
            return f"Achieved measurable results by {bullet.lower()}, improving efficiency by 20%"
        
        return f"Successfully {bullet.lower()}"
    
    def _mock_cover_letter(self, company_name: str) -> str:
        """Mock cover letter generation"""
        return f"""Dear Hiring Manager,

I am writing to express my strong interest in the position at {company_name}. With my proven track record of success and passion for innovation, I am confident I would be a valuable addition to your team.

Throughout my career, I have consistently delivered results by combining technical expertise with strong problem-solving abilities. My experience aligns well with the requirements of this role, and I am excited about the opportunity to contribute to {company_name}'s continued success.

I am particularly drawn to {company_name} because of your commitment to excellence and innovation. I believe my skills and experience would enable me to make immediate contributions while continuing to grow professionally.

Thank you for considering my application. I look forward to the opportunity to discuss how I can contribute to your team's success.

Sincerely,
[Your Name]"""
