
/**
 * API Configuration
 * Centralizes all API URL and connection settings
 */

/**
 * Gets the backend URL based on environment and user settings
 */
export function getBackendUrl(): string {
  // Check if a custom backend URL is set in localStorage (for testing/development)
  const customBackendUrl = localStorage.getItem('BACKEND_URL');
  if (customBackendUrl) return customBackendUrl;
  
  // Check if using local backend is enabled
  const useLocalBackend = localStorage.getItem('USE_LOCAL_BACKEND') === 'true';
  
  // Check if using HuggingFace backend is enabled
  const useHuggingFaceBackend = localStorage.getItem('USE_HUGGINGFACE_BACKEND') === 'true';
  
  if (useHuggingFaceBackend) {
    return "https://ngum-alu-chatbot.hf.space"; // HuggingFace deployment URL
  }
  
  // Local development mode
  if (useLocalBackend) return "http://localhost:8000";
  
  // Production deployment URL
  return "https://alu-chatbot-backend.onrender.com";
}

/**
 * Configuration object for all API-related settings
 */
export const apiConfig = {
  backendUrl: getBackendUrl(),
  endpoints: {
    health: '/health',
    chat: '/chat',
    generate: '/generate',
    documents: '/documents',
    nypthoStatus: '/nyptho/status',
  },
  defaultTimeout: 5000, // 5 seconds
}
