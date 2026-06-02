from langchain.callbacks.base import BaseCallbackHandler
from typing import Any, Dict, List
import logging

logger = logging.getLogger(__name__)


class StreamingCallbackHandler(BaseCallbackHandler):
    def __init__(self):
        self.tokens = []

    def on_llm_new_token(self, token: str, **kwargs: Any) -> None:
        self.tokens.append(token)

    def on_llm_end(self, response: Any, **kwargs: Any) -> None:
        logger.debug(f"LLM finished. Tokens: {len(self.tokens)}")

    def get_text(self) -> str:
        return "".join(self.tokens)
