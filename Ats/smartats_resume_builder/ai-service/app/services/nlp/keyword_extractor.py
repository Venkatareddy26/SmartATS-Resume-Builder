"""
Keyword Extraction Service
Uses KeyBERT and NLP techniques for intelligent keyword extraction
"""

import re
from typing import List, Dict, Tuple
from collections import Counter
import logging

logger = logging.getLogger(__name__)


class KeywordExtractor:
    """
    Advanced keyword extraction using multiple techniques:
    - TF-IDF
    - KeyBERT (when available)
    - Named Entity Recognition
    - Custom domain-specific extraction
    """
    
    def __init__(self):
        self.stop_words = self._load_stop_words()
        self.technical_skills = self._load_technical_skills()
        
        # Try to load KeyBERT model
        try:
            from keybert import KeyBERT
            self.keybert_model = KeyBERT()
            self.use_keybert = True
            logger.info("KeyBERT model loaded successfully")
        except Exception as e:
            logger.warning(f"KeyBERT not available: {e}")
            self.use_keybert = False
    
    def extract_keywords(self, text: str, top_n: int = 20) -> List[str]:
        """
        Extract top N keywords from text
        
        Args:
            text: Input text
            top_n: Number of keywords to return
            
        Returns:
            List of keywords sorted by relevance
        """
        try:
            if self.use_keybert:
                return self._extract_with_keybert(text, top_n)
            else:
                return self._extract_with_tfidf(text, top_n)
        except Exception as e:
            logger.error(f"Keyword extraction failed: {e}")
            return self._extract_simple(text, top_n)
    
    def extract_skills(self, text: str) -> Dict[str, List[str]]:
        """
        Extract technical and soft skills from text
        
        Returns:
            Dict with 'technical' and 'soft' skill lists
        """
        text_lower = text.lower()
        
        technical = []
        for skill in self.technical_skills:
            if skill.lower() in text_lower:
                technical.append(skill)
        
        # Soft skills patterns
        soft_skills_patterns = [
            "leadership", "communication", "teamwork", "problem solving",
            "critical thinking", "time management", "adaptability",
            "creativity", "collaboration", "analytical"
        ]
        
        soft = []
        for skill in soft_skills_patterns:
            if skill in text_lower:
                soft.append(skill.title())
        
        return {
            "technical": technical,
            "soft": soft
        }
    
    def calculate_keyword_density(self, text: str, keywords: List[str]) -> Dict[str, float]:
        """
        Calculate keyword density for given keywords
        
        Returns:
            Dict mapping keywords to their density (0-1)
        """
        text_lower = text.lower()
        word_count = len(text.split())
        
        densities = {}
        for keyword in keywords:
            count = text_lower.count(keyword.lower())
            densities[keyword] = count / word_count if word_count > 0 else 0
        
        return densities
    
    def _extract_with_keybert(self, text: str, top_n: int) -> List[str]:
        """Extract keywords using KeyBERT"""
        keywords = self.keybert_model.extract_keywords(
            text,
            keyphrase_ngram_range=(1, 2),
            stop_words='english',
            top_n=top_n,
            use_maxsum=True,
            nr_candidates=50
        )
        return [kw[0] for kw in keywords]
    
    def _extract_with_tfidf(self, text: str, top_n: int) -> List[str]:
        """Extract keywords using TF-IDF approach"""
        # Clean and tokenize
        words = re.findall(r'\b[a-zA-Z]{3,}\b', text.lower())
        
        # Remove stop words
        words = [w for w in words if w not in self.stop_words]
        
        # Count frequencies
        word_freq = Counter(words)
        
        # Get top N
        return [word for word, _ in word_freq.most_common(top_n)]
    
    def _extract_simple(self, text: str, top_n: int) -> List[str]:
        """Simple keyword extraction fallback"""
        words = re.findall(r'\b[A-Z][a-z]+\b|\b[a-z]{4,}\b', text)
        words = [w.lower() for w in words if w.lower() not in self.stop_words]
        word_freq = Counter(words)
        return [word for word, _ in word_freq.most_common(top_n)]
    
    def _load_stop_words(self) -> set:
        """Load stop words"""
        return {
            'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
            'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been',
            'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would',
            'could', 'should', 'may', 'might', 'must', 'can', 'this', 'that',
            'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they',
            'my', 'your', 'his', 'her', 'its', 'our', 'their'
        }
    
    def _load_technical_skills(self) -> List[str]:
        """Load common technical skills"""
        return [
            # Programming Languages
            "Python", "JavaScript", "Java", "C++", "C#", "Ruby", "Go", "Rust",
            "TypeScript", "PHP", "Swift", "Kotlin", "Scala", "R", "MATLAB",
            
            # Web Technologies
            "React", "Angular", "Vue.js", "Node.js", "Express", "Django", "Flask",
            "Spring Boot", "ASP.NET", "HTML", "CSS", "SASS", "Tailwind CSS",
            
            # Databases
            "PostgreSQL", "MySQL", "MongoDB", "Redis", "Elasticsearch", "Cassandra",
            "Oracle", "SQL Server", "DynamoDB", "Firebase",
            
            # Cloud & DevOps
            "AWS", "Azure", "Google Cloud", "Docker", "Kubernetes", "Jenkins",
            "GitLab CI", "GitHub Actions", "Terraform", "Ansible", "CircleCI",
            
            # Data Science & ML
            "TensorFlow", "PyTorch", "scikit-learn", "Pandas", "NumPy", "Keras",
            "Apache Spark", "Hadoop", "Tableau", "Power BI",
            
            # Tools & Platforms
            "Git", "Jira", "Confluence", "Slack", "VS Code", "IntelliJ",
            "Postman", "Figma", "Adobe XD",
            
            # Methodologies
            "Agile", "Scrum", "Kanban", "CI/CD", "TDD", "Microservices",
            "REST API", "GraphQL", "WebSocket"
        ]
