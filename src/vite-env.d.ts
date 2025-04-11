
/// <reference types="vite/client" />

interface ImportMeta {
  env: {
    VITE_API_URL?: string;
    VITE_GEMINI_API_KEY?: string;
    VITE_ANTHROPIC_API_KEY?: string;
    VITE_OPENAI_API_KEY?: string;
    [key: string]: string | undefined;
  };
}
