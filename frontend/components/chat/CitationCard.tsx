"use client";

import { motion } from "framer-motion";
import { FileText, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface CitationCardProps {
  content: string;
  metadata: Record<string, unknown>;
  score: number;
  index: number;
}

export function CitationCard({
  content,
  metadata,
  score,
  index,
}: CitationCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group rounded-lg border border-border/40 p-3 transition-colors hover:bg-accent/30"
    >
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-5 w-5 items-center justify-center rounded bg-blue-500/20 text-[10px] font-bold text-blue-400">
            {index + 1}
          </span>
          <span className="text-xs font-medium text-muted-foreground">
            {metadata.source as string}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground/70">
            Score: {(score * 100).toFixed(0)}%
          </span>
          <ExternalLink className="h-3 w-3 text-muted-foreground/50 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
      <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
        {content}
      </p>
    </motion.div>
  );
}
