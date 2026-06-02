import { API_BASE_URL } from "./constants";

export interface ChatResponse {
  answer: string;
  sources: {
    content: string;
    metadata: Record<string, unknown>;
    score: number;
  }[];
}

export interface UploadResponse {
  success: boolean;
  filename: string;
  chunks: number;
  document_id: string;
  message: string;
}

export interface HealthResponse {
  status: string;
  version: string;
  documents_indexed: number;
  collections: string[];
}

class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(
        `API Error (${response.status}): ${errorBody || response.statusText}`
      );
    }

    return response.json();
  }

  async health(): Promise<HealthResponse> {
    return this.request<HealthResponse>("/health");
  }

  async uploadPdf(file: File): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append("file", file);

    const url = `${this.baseUrl}/upload`;
    const response = await fetch(url, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(
        `Upload Error (${response.status}): ${errorBody || response.statusText}`
      );
    }

    return response.json();
  }

  async chat(question: string): Promise<ChatResponse> {
    return this.request<ChatResponse>("/chat", {
      method: "POST",
      body: JSON.stringify({ question }),
    });
  }

  async getDocuments() {
    return this.request<{ collections: string[]; total_chunks: number }>(
      "/documents"
    );
  }
}

export const api = new ApiClient();
