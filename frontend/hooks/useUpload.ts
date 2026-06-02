"use client";

import { useCallback } from "react";
import { useAppStore } from "@/store/useAppStore";
import { api } from "@/lib/api";
import { toast } from "sonner";

export function useUpload() {
  const isUploading = useAppStore((s) => s.isUploading);
  const setUploading = useAppStore((s) => s.setUploading);
  const addDocument = useAppStore((s) => s.addDocument);
  const setUploadProgress = useAppStore((s) => s.setUploadProgress);

  const uploadFile = useCallback(
    async (file: File) => {
      if (!file.name.toLowerCase().endsWith(".pdf")) {
        toast.error("Only PDF files are supported");
        return false;
      }
      if (file.size > 50 * 1024 * 1024) {
        toast.error("File too large. Max 50MB");
        return false;
      }

      setUploading(true);
      setUploadProgress(0);

      try {
        const progressInterval = setInterval(() => {
          setUploadProgress((prev) => Math.min(prev + 10, 90));
        }, 200);

        const response = await api.uploadPdf(file);
        clearInterval(progressInterval);
        setUploadProgress(100);

        addDocument({
          id: response.document_id,
          name: response.filename,
          chunks: response.chunks,
          uploadedAt: new Date(),
        });

        toast.success(response.message);
        setTimeout(() => setUploadProgress(0), 1000);
        return true;
      } catch (error) {
        setUploadProgress(0);
        toast.error(
          error instanceof Error ? error.message : "Upload failed"
        );
        return false;
      } finally {
        setUploading(false);
      }
    },
    [setUploading, setUploadProgress, addDocument]
  );

  return {
    isUploading,
    uploadFile,
  };
}
