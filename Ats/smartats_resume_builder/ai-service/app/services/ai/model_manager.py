"""
AI Model Manager
Handles loading and caching of AI models
"""

import logging
from typing import Optional
from app.core.config import settings

logger = logging.getLogger(__name__)


class ModelManager:
    """Manages AI model loading and caching"""
    
    def __init__(self):
        self.models = {}
        self.loaded = False
    
    async def load_models(self):
        """Load all required AI models"""
        if self.loaded:
            return
        
        try:
            if settings.USE_LOCAL_MODELS:
                await self._load_sentence_transformer()
            
            self.loaded = True
            logger.info("All models loaded successfully")
            
        except Exception as e:
            logger.error(f"Model loading failed: {e}")
            raise
    
    async def _load_sentence_transformer(self):
        """Load sentence transformer model for embeddings"""
        try:
            from sentence_transformers import SentenceTransformer
            
            model_name = settings.SENTENCE_TRANSFORMER_MODEL
            logger.info(f"Loading sentence transformer: {model_name}")
            
            self.models['sentence_transformer'] = SentenceTransformer(model_name)
            logger.info("Sentence transformer loaded")
            
        except Exception as e:
            logger.warning(f"Sentence transformer loading failed: {e}")
    
    def get_model(self, model_name: str) -> Optional[any]:
        """Get a loaded model by name"""
        return self.models.get(model_name)
