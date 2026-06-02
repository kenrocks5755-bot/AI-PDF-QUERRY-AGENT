export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const ROUTES = {
  HOME: "/",
  DASHBOARD: "/dashboard",
} as const;

export const ACCEPTED_FILE_TYPES = [".pdf"];
export const MAX_FILE_SIZE = 50 * 1024 * 1024;

export const PLACEHOLDER_QUESTIONS = [
  "Summarize the key points from my documents",
  "What are the main findings?",
  "Can you explain the methodology?",
  "What conclusions are drawn?",
];
