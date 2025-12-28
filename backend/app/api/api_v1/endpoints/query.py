from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.pipeline import RAGService

router = APIRouter()

class QueryRequest(BaseModel):
    query: str

class QueryResponse(BaseModel):
    answer: str

@router.post("/", response_model=QueryResponse)
async def query_knowledge_graph(request: QueryRequest):
    """
    Query the built knowledge graph.
    """
    try:
        # In a real app, you might cache the service or pool it
        service = RAGService()
        answer = service.query(request.query)
        return QueryResponse(answer=str(answer))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Query failed: {str(e)}")
