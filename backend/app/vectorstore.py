import numpy as np
import json
import os
from typing import List, Dict, Any, Optional
import logging
from app.config import settings
from app.embeddings import JinaEmbeddings

logger = logging.getLogger(__name__)


class VectorStoreManager:
    def __init__(self):
        self.embedding_function = JinaEmbeddings()
        self.index_file = os.path.join(settings.chroma_persist_dir, "vector_index.json")
        self.documents: List[Dict[str, Any]] = []
        self._load_index()

    def _load_index(self):
        os.makedirs(os.path.dirname(self.index_file), exist_ok=True)
        if os.path.exists(self.index_file):
            try:
                with open(self.index_file, "r") as f:
                    self.documents = json.load(f)
                logger.info(f"Loaded {len(self.documents)} documents from index")
            except Exception as e:
                logger.warning(f"Could not load index: {e}")
                self.documents = []
        else:
            self.documents = []
            logger.info("No existing index found, starting fresh")

    def _save_index(self):
        os.makedirs(os.path.dirname(self.index_file), exist_ok=True)
        with open(self.index_file, "w") as f:
            json.dump(self.documents, f, indent=2)

    def add_documents(self, texts: List[str], metadatas: List[Dict[str, Any]], ids: List[str]):
        embeddings = self.embedding_function.embed_documents(texts)
        for i, text in enumerate(texts):
            self.documents.append({
                "id": ids[i],
                "content": text,
                "metadata": metadatas[i],
                "embedding": embeddings[i],
            })
        self._save_index()
        logger.info(f"Added {len(texts)} document chunks to vector store")
        return len(texts)

    def similarity_search(self, query: str, k: int = settings.k_retrieval) -> List[Dict[str, Any]]:
        if not self.documents:
            return []

        query_embedding = np.array(self.embedding_function.embed_query(query))
        doc_embeddings = np.array([d["embedding"] for d in self.documents])

        norms = np.linalg.norm(doc_embeddings, axis=1)
        query_norm = np.linalg.norm(query_embedding)
        if norms.size == 0 or query_norm == 0:
            return []

        similarities = np.dot(doc_embeddings, query_embedding) / (norms * query_norm + 1e-10)
        top_indices = np.argsort(similarities)[::-1][:k]

        results = []
        for idx in top_indices:
            doc = self.documents[idx]
            results.append({
                "content": doc["content"],
                "metadata": doc.get("metadata", {}),
                "score": float(similarities[idx]),
            })
        return results

    def list_collections(self) -> List[str]:
        return ["pdf_documents"] if self.documents else []

    def delete_collection(self):
        self.documents = []
        if os.path.exists(self.index_file):
            os.remove(self.index_file)
        logger.info("Deleted all documents from vector store")

    def count_documents(self) -> int:
        return len(self.documents)


vector_store = VectorStoreManager()
