from typing import List, Dict, Any
import logging
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import PyPDFLoader
from langchain_core.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI
from app.config import settings
from app.vectorstore import vector_store
import uuid
import os

logger = logging.getLogger(__name__)

RAG_PROMPT = ChatPromptTemplate.from_messages([
    (
        "system",
        """You are an AI assistant that answers questions based ONLY on the provided document context.
        
Rules:
- Answer ONLY using the context provided below.
- If the context does not contain enough information to answer, say "I cannot find information about this in the uploaded documents."
- Do NOT make up or infer information outside the context.
- Cite the relevant source chunks in your answer.
- Be concise but thorough.
- Use markdown formatting for clarity.

Context:
{context}

Question: {question}

Answer based strictly on the above context. Include citations from the source material where relevant."""
    ),
    ("human", "{question}"),
])


def get_llm():
    return ChatOpenAI(
        model=settings.llm_model,
        openai_api_key=settings.openrouter_api_key,
        openai_api_base=settings.openrouter_base_url,
        temperature=0.1,
        max_tokens=2048,
        streaming=False,
    )


def process_pdf(file_path: str) -> List[Dict[str, Any]]:
    loader = PyPDFLoader(file_path)
    documents = loader.load()

    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=settings.chunk_size,
        chunk_overlap=settings.chunk_overlap,
        separators=["\n\n", "\n", ".", " ", ""],
    )

    chunks = text_splitter.split_documents(documents)

    texts = []
    metadatas = []
    ids = []

    for i, chunk in enumerate(chunks):
        chunk_id = str(uuid.uuid4())
        texts.append(chunk.page_content)
        metadatas.append({
            "source": os.path.basename(file_path),
            "chunk": i,
            "page": chunk.metadata.get("page", 0),
            "total_chunks": len(chunks),
        })
        ids.append(chunk_id)

    vector_store.add_documents(texts, metadatas, ids)
    logger.info(f"Processed PDF: {file_path} into {len(chunks)} chunks")
    return [{"content": t, "metadata": metadatas[i]} for i, t in enumerate(texts)]


def retrieve_context(query: str, k: int = settings.k_retrieval) -> List[Dict[str, Any]]:
    results = vector_store.similarity_search(query, k=k)
    return results


def generate_answer(question: str, context_docs: List[Dict[str, Any]]) -> Dict[str, Any]:
    context_text = "\n\n".join([
        f"[Source {i+1}]: {doc['content']}" for i, doc in enumerate(context_docs)
    ])

    llm = get_llm()
    chain = RAG_PROMPT | llm

    response = chain.invoke({
        "context": context_text,
        "question": question,
    })

    sources = []
    for doc in context_docs:
        sources.append({
            "content": doc["content"][:500],
            "metadata": doc.get("metadata", {}),
            "score": doc.get("score", 0.0),
        })

    return {
        "answer": response.content,
        "sources": sources,
    }
