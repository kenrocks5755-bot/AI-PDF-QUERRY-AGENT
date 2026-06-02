import os
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    openrouter_api_key: str = ""
    jina_api_key: str = ""
    chroma_api_key: str = ""
    chroma_api_url: str = "https://api.chroma.dev"
    chroma_persist_dir: str = os.path.join(os.path.dirname(os.path.dirname(__file__)), "chroma_db")
    upload_dir: str = os.path.join(os.path.dirname(os.path.dirname(__file__)), "uploads")
    openrouter_base_url: str = "https://openrouter.ai/api/v1"
    llm_model: str = "deepseek/deepseek-v4-flash:free"
    chunk_size: int = 1000
    chunk_overlap: int = 200
    k_retrieval: int = 4
    app_name: str = "PDF RAG AI"
    debug: bool = False

    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()
