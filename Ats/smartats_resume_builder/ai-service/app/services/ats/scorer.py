"""
ATS (Applicant Tracking System) Scorer
Advanced algorithm for scoring resume ATS compatibility
"""

import re
from typing import Dict, List
import logging

logger = logging.getLogger(__name__)


class ATSScorer:
    """
    ATS Compatibility Scorer
    
    Evaluates resumes based on:
    - Format compatibility
    - Section structure
    - Keyword optimization
    - Content quality
    """
    
    def __init__(self):
        self.standard_sections = [
            "experience", "work experience", "professional experience",
            "education", "skills", "summary", "objective",
            "certifications", "certificates", "projects"
        ]
        
        self.action_verbs = [
            "achieved", "improved", "trained", "managed", "created",
            "resolved", "volunteered", "influenced", "increased", "decreased",
            "ideas", "negotiated", "launched", "revenue", "under budget",
            "led", "developed", "implemented", "designed", "built",
            "optimized", "streamlined", "coordinated", "executed", "delivered"
        ]
        
        self.problematic_elements = [
            "tables", "columns", "text boxes", "headers", "footers",
            "images", "graphics", "special characters"
        ]
    
    def score_resume(self, resume_text: str) -> Dict:
        """
        Score resume for ATS compatibility
        
        Returns:
            Dict with overall score and breakdown by category
        """
        try:
            scores = {
                "format": self._score_format(resume_text),
                "structure": self._score_structure(resume_text),
                "keywords": self._score_keywords(resume_text),
                "content": self._score_content(resume_text),
                "readability": self._score_readability(resume_text)
            }
            
            # Calculate weighted overall score
            weights = {
                "format": 0.25,
                "structure": 0.20,
                "keywords": 0.25,
                "content": 0.20,
                "readability": 0.10
            }
            
            overall_score = sum(scores[key] * weights[key] for key in scores)
            
            return {
                "score": int(overall_score),
                "breakdown": scores,
                "grade": self._get_grade(overall_score),
                "recommendations": self._get_recommendations(scores)
            }
            
        except Exception as e:
            logger.error(f"ATS scoring failed: {e}")
            return {
                "score": 0,
                "breakdown": {},
                "grade": "F",
                "recommendations": ["Error analyzing resume"]
            }
    
    def _score_format(self, text: str) -> int:
        """Score format compatibility (0-100)"""
        score = 100
        
        # Check for problematic formatting indicators
        if re.search(r'\|{2,}', text):  # Multiple pipes (table indicator)
            score -= 15
        
        if re.search(r'[^\x00-\x7F]+', text):  # Non-ASCII characters
            score -= 10
        
        # Check for proper spacing
        if text.count('\n\n') < 3:  # Too few paragraph breaks
            score -= 10
        
        # Check for excessive special characters
        special_char_ratio = len(re.findall(r'[^a-zA-Z0-9\s\-.,;:()]', text)) / len(text)
        if special_char_ratio > 0.05:
            score -= 15
        
        return max(0, score)
    
    def _score_structure(self, text: str) -> int:
        """Score section structure (0-100)"""
        score = 0
        text_lower = text.lower()
        
        # Check for standard sections
        sections_found = sum(1 for section in self.standard_sections if section in text_lower)
        score += min(60, sections_found * 12)  # Up to 60 points for sections
        
        # Check for contact information
        if re.search(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b', text):
            score += 10  # Email found
        
        if re.search(r'\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}', text):
            score += 10  # Phone found
        
        # Check for proper section headers (capitalized or all caps)
        section_headers = re.findall(r'^[A-Z][A-Z\s]+$', text, re.MULTILINE)
        if len(section_headers) >= 3:
            score += 20
        
        return min(100, score)
    
    def _score_keywords(self, text: str) -> int:
        """Score keyword optimization (0-100)"""
        text_lower = text.lower()
        
        # Count action verbs
        action_verb_count = sum(1 for verb in self.action_verbs if verb in text_lower)
        action_score = min(50, action_verb_count * 4)
        
        # Check for industry keywords (technical skills, tools, etc.)
        # This is a simplified version - in production, use job-specific keywords
        common_keywords = [
            "python", "javascript", "java", "react", "node", "sql",
            "aws", "azure", "docker", "kubernetes", "agile", "scrum",
            "leadership", "management", "analysis", "strategy"
        ]
        keyword_count = sum(1 for keyword in common_keywords if keyword in text_lower)
        keyword_score = min(50, keyword_count * 5)
        
        return action_score + keyword_score
    
    def _score_content(self, text: str) -> int:
        """Score content quality (0-100)"""
        score = 0
        
        # Check for quantifiable achievements (numbers)
        numbers = re.findall(r'\d+', text)
        if len(numbers) >= 5:
            score += 30
        elif len(numbers) >= 3:
            score += 20
        else:
            score += 10
        
        # Check for bullet points
        bullet_count = text.count('•') + text.count('-') + text.count('*')
        if bullet_count >= 10:
            score += 30
        elif bullet_count >= 5:
            score += 20
        else:
            score += 10
        
        # Check word count (optimal range: 400-800 words)
        word_count = len(text.split())
        if 400 <= word_count <= 800:
            score += 40
        elif 300 <= word_count < 400 or 800 < word_count <= 1000:
            score += 30
        else:
            score += 20
        
        return min(100, score)
    
    def _score_readability(self, text: str) -> int:
        """Score readability (0-100)"""
        score = 100
        
        # Check average sentence length
        sentences = re.split(r'[.!?]+', text)
        sentences = [s.strip() for s in sentences if s.strip()]
        
        if sentences:
            avg_words_per_sentence = sum(len(s.split()) for s in sentences) / len(sentences)
            
            # Optimal: 15-20 words per sentence
            if 15 <= avg_words_per_sentence <= 20:
                pass  # Perfect
            elif 10 <= avg_words_per_sentence < 15 or 20 < avg_words_per_sentence <= 25:
                score -= 10
            else:
                score -= 20
        
        # Check for overly long paragraphs
        paragraphs = text.split('\n\n')
        long_paragraphs = sum(1 for p in paragraphs if len(p.split()) > 100)
        score -= long_paragraphs * 10
        
        return max(0, score)
    
    def _get_grade(self, score: float) -> str:
        """Convert score to letter grade"""
        if score >= 90:
            return "A"
        elif score >= 80:
            return "B"
        elif score >= 70:
            return "C"
        elif score >= 60:
            return "D"
        else:
            return "F"
    
    def _get_recommendations(self, scores: Dict[str, int]) -> List[str]:
        """Generate recommendations based on scores"""
        recommendations = []
        
        if scores["format"] < 70:
            recommendations.append("Use simple formatting without tables or complex layouts")
        
        if scores["structure"] < 70:
            recommendations.append("Include standard sections: Contact, Summary, Experience, Education, Skills")
        
        if scores["keywords"] < 70:
            recommendations.append("Add more action verbs and industry-specific keywords")
        
        if scores["content"] < 70:
            recommendations.append("Include quantifiable achievements with numbers and percentages")
        
        if scores["readability"] < 70:
            recommendations.append("Improve readability with shorter sentences and clear bullet points")
        
        return recommendations if recommendations else ["Great job! Your resume is ATS-friendly"]
