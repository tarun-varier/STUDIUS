from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Studius API"
    API_V1_STR: str = "/api/v1"
    
    # Add other env vars here (DB, Keys, etc.)
    # SUPABASE_URL: str
    # SUPABASE_KEY: str
    # MISTRAL_API_KEY: str

    class Config:
        env_file = ".env"

settings = Settings()
