from pydantic import BaseModel, Field
from typing import List, Optional, Any


class UploadResponse(BaseModel):
    success: bool
    filename: str
    chunks: int
    document_id: str
    message: str


class ChatRequest(BaseModel):
    question: str = Field(..., min_length=1, max_length=4096)


class SourceCitation(BaseModel):
    content: str
    metadata: dict = {}
    score: float = 0.0


class ChatResponse(BaseModel):
    answer: str
    sources: List[SourceCitation] = []


class HealthResponse(BaseModel):
    status: str
    version: str
    documents_indexed: int
    collections: List[str]


class ErrorResponse(BaseModel):
    detail: str
    error_type: Optional[str] = None
