from pydantic_settings import BaseSettings
import os

class Settings(BaseSettings):
    PROJECT_NAME: str = "Studius API"
    API_V1_STR: str = "/api/v1"
    
    # Add other env vars here (DB, Keys, etc.)
    SUPABASE_URL: str = os.environ.get("SUPABASE_URL")
    SUPABASE_KEY: str = os.environ.get("SUPABASE_KEY")
    MISTRAL_API_KEY: str = os.environ.get("MISTRAL_API_KEY")

    class Config:
        env_file = ".env"

settings = Settings()
