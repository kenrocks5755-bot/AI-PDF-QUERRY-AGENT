"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles, ArrowDown } from "lucide-react";
import { useChat } from "@/hooks/useChat";
import { useAppStore } from "@/store/useAppStore";
import { MessageBubble } from "./MessageBubble";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { PLACEHOLDER_QUESTIONS } from "@/lib/constants";

export function ChatWindow() {
  const [input, setInput] = useState("");
  const { messages, isChatLoading, sendMessage } = useChat();
  const { documents } = useAppStore();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showScrollBtn, setShowScrollBtn] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isChatLoading) return;
    sendMessage(input);
    setInput("");
  };

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      setShowScrollBtn(scrollHeight - scrollTop - clientHeight > 200);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!showScrollBtn && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, showScrollBtn]);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  const hasMessages = messages.length > 0;
  const hasDocuments = documents.length > 0;

  return (
    <div className="flex h-full flex-col">
      <ScrollArea
        ref={scrollRef}
        className="flex-1 px-6 py-6"
      >
        <AnimatePresence mode="wait">
          {!hasMessages ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex h-full flex-col items-center justify-center py-20"
            >
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-600/20">
                <Sparkles className="h-8 w-8 text-blue-400" />
              </div>
              <h2 className="mb-2 text-2xl font-semibold tracking-tight">
                Ask anything about your documents
              </h2>
              <p className="mb-8 text-muted-foreground">
                {hasDocuments
                  ? "Start a conversation with your AI assistant"
                  : "Upload a PDF to get started"}
              </p>
              {hasDocuments && (
                <div className="grid max-w-lg gap-3 sm:grid-cols-2">
                  {PLACEHOLDER_QUESTIONS.map((q, i) => (
                    <button
                      key={i}
                      onClick={() => sendMessage(q)}
                      className="rounded-xl border border-border/40 p-3 text-left text-sm text-muted-foreground transition-colors hover:bg-accent/50 hover:text-foreground"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="messages"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mx-auto max-w-3xl space-y-6"
            >
              {messages.map((msg) => (
                <MessageBubble
                  key={msg.id}
                  role={msg.role}
                  content={msg.content}
                  sources={msg.sources}
                />
              ))}
              {isChatLoading && (
                <div className="flex items-center gap-3 px-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary">
                    <Sparkles className="h-4 w-4 text-blue-400" />
                  </div>
                  <div className="flex items-center gap-1">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className="typing-dot h-2 w-2 rounded-full bg-muted-foreground/50"
                      />
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </ScrollArea>

      <AnimatePresence>
        {showScrollBtn && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-24 left-1/2 -translate-x-1/2"
          >
            <Button
              variant="secondary"
              size="icon"
              className="h-8 w-8 rounded-full shadow-lg"
              onClick={scrollToBottom}
            >
              <ArrowDown className="h-4 w-4" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="border-t border-border/40 p-4">
        <form
          onSubmit={handleSubmit}
          className="mx-auto flex max-w-3xl items-center gap-3"
        >
          <div className="relative flex-1">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                hasDocuments
                  ? "Ask a question about your documents..."
                  : "Upload a document first..."
              }
              disabled={!hasDocuments || isChatLoading}
              className="h-12 rounded-xl bg-secondary/50 pr-12 text-base transition-colors focus:bg-secondary"
            />
          </div>
          <Button
            type="submit"
            size="icon"
            disabled={!input.trim() || isChatLoading || !hasDocuments}
            className="h-12 w-12 shrink-0 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700"
          >
            <Send className="h-5 w-5" />
          </Button>
        </form>
      </div>
    </div>
  );
}
