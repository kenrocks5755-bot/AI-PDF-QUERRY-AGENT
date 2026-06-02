"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Settings,
  Trash2,
  Upload,
  Sparkles,
} from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { UploadDropzone } from "@/components/upload/UploadDropzone";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const { documents, removeDocument, isSidebarOpen, isUploading } =
    useAppStore();

  return (
    <AnimatePresence>
      {isSidebarOpen && (
        <motion.aside
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 320, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="fixed left-0 top-16 z-30 flex h-[calc(100vh-4rem)] flex-col border-r border-border/40 bg-background/95 backdrop-blur-xl"
        >
          <div className="flex flex-col h-full w-[320px]">
            <div className="flex items-center gap-2 border-b border-border/40 px-6 py-4">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
                <Sparkles className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="text-sm font-semibold">PDF RAG AI</span>
            </div>

            <div className="border-b border-border/40 p-4">
              <UploadDropzone />
            </div>

            <div className="flex-1 overflow-hidden">
              <div className="flex items-center justify-between px-6 py-3">
                <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Documents
                </span>
                <span className="text-xs text-muted-foreground">
                  {documents.length}
                </span>
              </div>
              <ScrollArea className="h-[calc(100%-40px)] px-4">
                {documents.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <FileText className="mb-3 h-8 w-8 text-muted-foreground/50" />
                    <p className="text-sm text-muted-foreground/70">
                      No documents uploaded yet
                    </p>
                    <p className="text-xs text-muted-foreground/50">
                      Upload a PDF to get started
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {documents.map((doc) => (
                      <motion.div
                        key={doc.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="group flex items-center gap-3 rounded-lg border border-border/40 p-3 transition-colors hover:bg-accent/50"
                      >
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-blue-500/20 to-purple-600/20">
                          <FileText className="h-4 w-4 text-blue-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="truncate text-sm font-medium">
                            {doc.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {doc.chunks} chunks
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeDocument(doc.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5 text-destructive" />
                        </Button>
                      </motion.div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </div>

            <div className="border-t border-border/40 p-4">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start gap-2 text-muted-foreground"
              >
                <Settings className="h-4 w-4" />
                Settings
              </Button>
            </div>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
