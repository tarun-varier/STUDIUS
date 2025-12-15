from fastapi import APIRouter

api_router = APIRouter()

# from app.api.api_v1.endpoints import questions
# api_router.include_router(questions.router, prefix="/questions", tags=["questions"])

@api_router.get("/")
async def api_root():
    return {"message": "API v1 root"}
