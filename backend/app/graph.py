from typing import Dict, Any, List, TypedDict, Annotated, Sequence
from langgraph.graph import StateGraph, END
from langgraph.checkpoint.memory import MemorySaver
from app.rag import process_pdf, retrieve_context, generate_answer
from app.vectorstore import vector_store
import logging
import uuid

logger = logging.getLogger(__name__)


class GraphState(TypedDict):
    question: str
    file_path: str
    chunks: List[Dict[str, Any]]
    context: List[Dict[str, Any]]
    answer: str
    sources: List[Dict[str, Any]]
    error: str


def upload_processing_node(state: GraphState) -> Dict[str, Any]:
    file_path = state.get("file_path", "")
    if not file_path:
        return {"error": "No file path provided"}
    try:
        logger.info(f"Processing upload: {file_path}")
        chunks = process_pdf(file_path)
        return {"chunks": chunks}
    except Exception as e:
        logger.error(f"Upload processing failed: {e}")
        return {"error": str(e)}


def retrieval_node(state: GraphState) -> Dict[str, Any]:
    question = state.get("question", "")
    if not question:
        return {"error": "No question provided"}
    try:
        context = retrieve_context(question)
        return {"context": context}
    except Exception as e:
        logger.error(f"Retrieval failed: {e}")
        return {"error": str(e)}


def reasoning_generation_node(state: GraphState) -> Dict[str, Any]:
    question = state.get("question", "")
    context = state.get("context", [])
    if not context:
        logger.warning("No context retrieved for question")
        return {
            "answer": "I cannot find information about this in the uploaded documents.",
            "sources": [],
        }
    try:
        result = generate_answer(question, context)
        return {"answer": result["answer"], "sources": result["sources"]}
    except Exception as e:
        logger.error(f"Generation failed: {e}")
        return {"error": str(e), "answer": "An error occurred during answer generation."}


def check_error(state: GraphState) -> str:
    if state.get("error"):
        return "error"
    return "continue"


def check_context(state: GraphState) -> str:
    if state.get("context"):
        return "has_context"
    return "no_context"


def build_chat_graph():
    workflow = StateGraph(GraphState)

    workflow.add_node("retrieval", retrieval_node)
    workflow.add_node("reasoning_generation", reasoning_generation_node)

    workflow.set_entry_point("retrieval")

    workflow.add_conditional_edges(
        "retrieval",
        check_context,
        {
            "has_context": "reasoning_generation",
            "no_context": "reasoning_generation",
        },
    )

    workflow.add_edge("reasoning_generation", END)

    memory = MemorySaver()
    app = workflow.compile(checkpointer=memory)
    return app


def build_upload_graph():
    workflow = StateGraph(GraphState)

    workflow.add_node("upload_processing", upload_processing_node)

    workflow.set_entry_point("upload_processing")

    workflow.add_conditional_edges(
        "upload_processing",
        check_error,
        {
            "continue": END,
            "error": END,
        },
    )

    app = workflow.compile()
    return app


chat_graph = build_chat_graph()
upload_graph = build_upload_graph()


def run_chat(question: str, session_id: str = "default") -> Dict[str, Any]:
    config = {"configurable": {"thread_id": session_id}}
    initial_state = GraphState(
        question=question,
        file_path="",
        chunks=[],
        context=[],
        answer="",
        sources=[],
        error="",
    )
    result = chat_graph.invoke(initial_state, config=config)
    state = result if isinstance(result, dict) else result[-1] if isinstance(result, list) else {}
    return {
        "answer": state.get("answer", ""),
        "sources": state.get("sources", []),
    }


def run_upload(file_path: str) -> Dict[str, Any]:
    initial_state = GraphState(
        question="",
        file_path=file_path,
        chunks=[],
        context=[],
        answer="",
        sources=[],
        error="",
    )
    result = upload_graph.invoke(initial_state)
    state = result if isinstance(result, dict) else result[-1] if isinstance(result, list) else {}
    return {
        "chunks": state.get("chunks", []),
        "error": state.get("error", ""),
    }
