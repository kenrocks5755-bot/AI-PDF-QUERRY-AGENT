import logging
import os
import uuid
from pathlib import Path
from typing import List

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.config import settings
from app.schemas import (
    UploadResponse,
    ChatRequest,
    ChatResponse,
    SourceCitation,
    HealthResponse,
    ErrorResponse,
)
from app.graph import run_chat, run_upload
from app.vectorstore import vector_store

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

app = FastAPI(
    title=settings.app_name,
    version="1.0.0",
    description="AI PDF RAG SaaS - Chat with your documents",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

os.makedirs(settings.upload_dir, exist_ok=True)


@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content=ErrorResponse(detail=str(exc), error_type="internal_error").model_dump(),
    )


@app.get("/health", response_model=HealthResponse)
async def health_check():
    try:
        collections = vector_store.list_collections()
        doc_count = vector_store.count_documents() if collections else 0
        return HealthResponse(
            status="healthy",
            version="1.0.0",
            documents_indexed=doc_count,
            collections=collections,
        )
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        return HealthResponse(
            status="degraded",
            version="1.0.0",
            documents_indexed=0,
            collections=[],
        )


@app.post("/upload", response_model=UploadResponse)
async def upload_pdf(file: UploadFile = File(...)):
    max_size = 50 * 1024 * 1024
    content = await file.read()
    if len(content) > max_size:
        raise HTTPException(status_code=413, detail="File too large. Max 50MB.")
    if not file.filename or not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=400, detail="Only PDF files are supported."
        )

    document_id = str(uuid.uuid4())
    safe_filename = f"{document_id}_{file.filename}"
    file_path = os.path.join(settings.upload_dir, safe_filename)

    with open(file_path, "wb") as f:
        f.write(content)

    try:
        result = run_upload(file_path)
        if result.get("error"):
            raise HTTPException(status_code=500, detail=result["error"])

        chunks = result.get("chunks", [])
        return UploadResponse(
            success=True,
            filename=file.filename,
            chunks=len(chunks),
            document_id=document_id,
            message=f"Successfully processed {file.filename} into {len(chunks)} chunks.",
        )
    except Exception as e:
        logger.error(f"Upload processing error: {e}")
        if os.path.exists(file_path):
            os.remove(file_path)
        raise HTTPException(
            status_code=500, detail=f"Failed to process PDF: {str(e)}"
        )


@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    try:
        result = run_chat(request.question)

        sources = []
        for src in result.get("sources", []):
            sources.append(
                SourceCitation(
                    content=src.get("content", ""),
                    metadata=src.get("metadata", {}),
                    score=src.get("score", 0.0),
                )
            )

        return ChatResponse(
            answer=result.get(
                "answer", "I could not generate an answer. Please try again."
            ),
            sources=sources,
        )
    except Exception as e:
        logger.error(f"Chat error: {e}", exc_info=True)
        raise HTTPException(
            status_code=500, detail=f"Chat processing failed: {str(e)}"
        )


@app.get("/documents")
async def list_documents():
    try:
        collections = vector_store.list_collections()
        doc_count = vector_store.count_documents() if collections else 0
        return {"collections": collections, "total_chunks": doc_count}
    except Exception as e:
        logger.error(f"List documents error: {e}")
        return {"collections": [], "total_chunks": 0}
