"use client";

import { motion } from "framer-motion";
import { User, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

interface MessageBubbleProps {
  role: "user" | "assistant";
  content: string;
  sources?: {
    content: string;
    metadata: Record<string, unknown>;
    score: number;
  }[];
}

export function MessageBubble({ role, content, sources }: MessageBubbleProps) {
  const isUser = role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "group flex gap-4",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      <div
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
          isUser
            ? "bg-gradient-to-br from-blue-500 to-purple-600"
            : "bg-secondary"
        )}
      >
        {isUser ? (
          <User className="h-4 w-4 text-white" />
        ) : (
          <Sparkles className="h-4 w-4 text-blue-400" />
        )}
      </div>

      <div
        className={cn(
          "flex max-w-[80%] flex-col gap-2",
          isUser ? "items-end" : "items-start"
        )}
      >
        <div
          className={cn(
            "rounded-2xl px-4 py-3 text-sm leading-relaxed",
            isUser
              ? "bg-gradient-to-br from-blue-500 to-purple-600 text-white"
              : "bg-secondary/50"
          )}
        >
          {isUser ? (
            <p>{content}</p>
          ) : (
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {content}
              </ReactMarkdown>
            </div>
          )}
        </div>

        {sources && sources.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {sources.map((source, i) => (
              <div
                key={i}
                className="flex items-center gap-1.5 rounded-lg border border-border/40 bg-background/50 px-2.5 py-1.5 text-xs text-muted-foreground"
              >
                <span className="font-medium text-blue-400">#{i + 1}</span>
                <span className="truncate max-w-[120px]">
                  {source.metadata.source as string}
                </span>
                <span className="text-muted-foreground/50">
                  p.{source.metadata.page as string}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
