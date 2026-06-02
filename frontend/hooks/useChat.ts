"use client";

import { useCallback } from "react";
import { useAppStore } from "@/store/useAppStore";
import { api } from "@/lib/api";
import { toast } from "sonner";

export function useChat() {
  const {
    messages,
    isChatLoading,
    addMessage,
    setChatLoading,
  } = useAppStore();

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isChatLoading) return;

      addMessage({ role: "user", content: content.trim() });
      setChatLoading(true);

      try {
        const response = await api.chat(content.trim());
        addMessage({
          role: "assistant",
          content: response.answer,
          sources: response.sources,
        });
      } catch (error) {
        toast.error(
          error instanceof Error ? error.message : "Failed to get response"
        );
        addMessage({
          role: "assistant",
          content: "Sorry, I encountered an error. Please try again.",
        });
      } finally {
        setChatLoading(false);
      }
    },
    [isChatLoading, addMessage, setChatLoading]
  );

  return {
    messages,
    isChatLoading,
    sendMessage,
  };
}
