from fastapi import APIRouter

api_router = APIRouter()

from app.api.api_v1.endpoints import resources

api_router.include_router(resources.router, prefix="/resources", tags=["resources"])

@api_router.get("/")
async def api_root():
    return {"message": "API v1 root"}
