from typing import Optional
from sqlmodel import Field
from app.models.base import UUIDModel, TimestampModel

class QuestionBank(UUIDModel, TimestampModel, table=True):
    title: str = Field(index=True)
    description: Optional[str] = None
    file_path: str = Field(nullable=False) # Path to the stored file (local or cloud)
    is_processed: bool = Field(default=False)
    processed_at: Optional[str] = None

class StudyMaterial(UUIDModel, TimestampModel, table=True):
    title: str = Field(index=True)
    description: Optional[str] = None
    file_path: str = Field(nullable=False)
    is_indexed: bool = Field(default=False)
    indexed_at: Optional[str] = None
