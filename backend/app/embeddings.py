from langchain.embeddings.base import Embeddings
from typing import List
import httpx
import logging
from app.config import settings

logger = logging.getLogger(__name__)


class JinaEmbeddings(Embeddings):
    def __init__(self, api_key: str = settings.jina_api_key):
        self.api_key = api_key
        self.api_url = "https://api.jina.ai/v1/embeddings"
        self.model = "jina-embeddings-v3"

    def _get_headers(self) -> dict:
        return {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }

    def _embed(self, texts: List[str]) -> List[List[float]]:
        with httpx.Client(timeout=60.0) as client:
            payload = {
                "model": self.model,
                "input": texts,
                "normalized": True,
            }
            response = client.post(
                self.api_url, headers=self._get_headers(), json=payload
            )
            if response.status_code != 200:
                error_text = response.text
                logger.error(f"Jina API error {response.status_code}: {error_text}")
                raise Exception(f"Embedding API error: {response.status_code}")
            data = response.json()
            embeddings = [item["embedding"] for item in data["data"]]
            return embeddings

    def embed_documents(self, texts: List[str]) -> List[List[float]]:
        return self._embed(texts)

    def embed_query(self, text: str) -> List[float]:
        return self._embed([text])[0]
