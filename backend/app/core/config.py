from pydantic import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    """
    Application settings loaded from environment variables
    """
    # Supabase configuration
    SUPABASE_URL: str
    SUPABASE_SERVICE_ROLE_KEY: str
    
    # OpenAI configuration
    OPENAI_API_KEY: Optional[str] = None
    
    # SMTP configuration
    SMTP_HOST: Optional[str] = None
    SMTP_PORT: Optional[int] = 587
    SMTP_USER: Optional[str] = None
    SMTP_PASS: Optional[str] = None
    
    # Email recipient for authority notifications
    AUTHORITY_EMAIL_TO: Optional[str] = None
    
    # CORS origins
    CORS_ORIGINS: list[str] = ["*"]
    
    class Config:
        env_file = ".env"
        case_sensitive = True


# Create global settings instance
settings = Settings()
