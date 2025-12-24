from pydantic_settings import BaseSettings
import os

class Settings(BaseSettings):
    PROJECT_NAME: str = "Studius API"
    API_V1_STR: str = "/api/v1"
    
    # Add other env vars here (DB, Keys, etc.)
    SUPABASE_URL: str | None = None
    SUPABASE_KEY: str | None = None
    MISTRAL_API_KEY: str | None = None

    # Database
    POSTGRES_SERVER: str = "localhost"
    POSTGRES_USER: str = "postgres"
    POSTGRES_PASSWORD: str = "password"
    POSTGRES_DB: str = "studius_db"
    SUPABASE_DB_URL: str | None = None
    
    @property
    def SQLALCHEMY_DATABASE_URI(self) -> str:
        if self.SUPABASE_DB_URL:
             # Ensure async resolver is used if not present
            if self.SUPABASE_DB_URL.startswith("postgresql://"):
                return self.SUPABASE_DB_URL.replace("postgresql://", "postgresql+asyncpg://")
            return self.SUPABASE_DB_URL
        return f"postgresql+asyncpg://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_SERVER}/{self.POSTGRES_DB}"

    class Config:
        env_file = ".env"

settings = Settings()
