from app.core.config import Settings
from supabase import create_client, Client

settings = Settings()
url: str = settings.SUPABASE_URL
key: str = settings.SUPABASE_KEY

supabase: Client = create_client(url, key)