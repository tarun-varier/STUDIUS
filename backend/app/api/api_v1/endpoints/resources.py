from typing import Any
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, BackgroundTasks
from sqlmodel.ext.asyncio.session import AsyncSession
import shutil
import os
from datetime import datetime
from uuid import UUID

from app.core.db import get_session
from app.models.domain import QuestionBank, StudyMaterial
from app.services import crud_services

router = APIRouter()

# --- Question Banks ---

@router.get("/question-banks/", response_model=list[QuestionBank])
async def read_question_banks(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_session),
) -> Any:
    """
    Retrieve question banks.
    """
    return await crud_services.question_bank.get_multi(db, skip=skip, limit=limit)

@router.post("/question-banks/", response_model=QuestionBank)
async def create_question_bank(
    title: str,
    description: str | None = None,
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_session),
) -> Any:
    """
    Create new question bank and upload file.
    """
    # Simply saving to local "uploads" folder for now
    upload_dir = "uploads/question_banks"
    os.makedirs(upload_dir, exist_ok=True)
    file_path = f"{upload_dir}/{file.filename}"
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    obj_in = QuestionBank(title=title, description=description, file_path=file_path)
    return await crud_services.question_bank.create(db, obj_in=obj_in)

# --- Study Materials ---

@router.get("/study-materials/", response_model=list[StudyMaterial])
async def read_study_materials(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_session),
) -> Any:
    """
    Retrieve study materials.
    """
    return await crud_services.study_material.get_multi(db, skip=skip, limit=limit)

@router.post("/study-materials/", response_model=StudyMaterial)
async def create_study_material(
    background_tasks: BackgroundTasks,
    title: str,
    description: str | None = None,
    file: UploadFile = File(...),
    db: AsyncSession = Depends(get_session),
) -> Any:
    """
    Create new study material and upload file.
    """
    upload_dir = "uploads/study_materials"
    os.makedirs(upload_dir, exist_ok=True)
    file_path = f"{upload_dir}/{file.filename}"
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    obj_in = StudyMaterial(title=title, description=description, file_path=file_path)
    db_obj = await crud_services.study_material.create(db, obj_in=obj_in)
    
    # Trigger RAG Ingestion in background
    background_tasks.add_task(ingest_and_update, db_obj.id, file_path)
    
    return db_obj

async def ingest_and_update(material_id: UUID, file_path: str):
    """Refactored task to handle async session and RAG ingestion."""
    from app.services.pipeline import RAGService
    from app.core.db import engine
    from sqlmodel.ext.asyncio.session import AsyncSession
    from sqlalchemy.orm import sessionmaker
    
    rag = RAGService()
    try:
        rag.ingest_file(file_path)
        
        # Update DB status
        async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
        async with async_session() as session:
            material = await session.get(StudyMaterial, material_id)
            if material:
                material.is_indexed = True
                material.indexed_at = datetime.utcnow().isoformat()
                session.add(material)
                await session.commit()
    except Exception as e:
        print(f"Ingestion failed for {file_path}: {e}")
