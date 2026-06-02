import { create } from "zustand";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: {
    content: string;
    metadata: Record<string, unknown>;
    score: number;
  }[];
  timestamp: Date;
}

interface Document {
  id: string;
  name: string;
  chunks: number;
  uploadedAt: Date;
}

interface AppState {
  // Chat
  messages: Message[];
  isChatLoading: boolean;
  addMessage: (message: Omit<Message, "id" | "timestamp">) => void;
  setChatLoading: (loading: boolean) => void;
  clearMessages: () => void;

  // Documents
  documents: Document[];
  addDocument: (doc: Document) => void;
  removeDocument: (id: string) => void;
  setDocuments: (docs: Document[]) => void;

  // Upload
  isUploading: boolean;
  uploadProgress: number;
  setUploading: (uploading: boolean) => void;
  setUploadProgress: (progress: number | ((prev: number) => number)) => void;

  // UI
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  // Chat
  messages: [],
  isChatLoading: false,
  addMessage: (message) =>
    set((state) => ({
      messages: [
        ...state.messages,
        {
          ...message,
          id: Math.random().toString(36).substring(2, 15),
          timestamp: new Date(),
        },
      ],
    })),
  setChatLoading: (loading) => set({ isChatLoading: loading }),
  clearMessages: () => set({ messages: [] }),

  // Documents
  documents: [],
  addDocument: (doc) =>
    set((state) => ({
      documents: [doc, ...state.documents],
    })),
  removeDocument: (id) =>
    set((state) => ({
      documents: state.documents.filter((d) => d.id !== id),
    })),
  setDocuments: (docs) => set({ documents: docs }),

  // Upload
  isUploading: false,
  uploadProgress: 0,
  setUploading: (uploading) => set({ isUploading: uploading }),
  setUploadProgress: (progress) =>
    set((state) => ({
      uploadProgress: typeof progress === "function" ? progress(state.uploadProgress) : progress,
    })),

  // UI
  isSidebarOpen: true,
  toggleSidebar: () =>
    set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
}));
