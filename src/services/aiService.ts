
import { Message } from "@/types/chat";

interface BackendResponse {
  response: string;
  sources?: Array<{
    title: string;
    source: string;
    date?: string;
  }>;
  engine?: string;
}

// Helper function to get backend URL with improved caching
const getBackendUrl = (() => {
  let cachedUrl: string | null = null;
  
  return () => {
    if (cachedUrl) return cachedUrl;
    
    // Check if a BACKEND_URL is set in localStorage (for testing)
    const storedBackendUrl = localStorage.getItem('BACKEND_URL');
    if (storedBackendUrl) {
      cachedUrl = storedBackendUrl;
      return cachedUrl;
    }
    
    // Local development mode
    if (localStorage.getItem('USE_LOCAL_BACKEND') === 'true') {
      cachedUrl = "http://localhost:8000";
      return cachedUrl;
    }
    
    // Production deployment URL
    cachedUrl = "https://alu-chatbot-backend.onrender.com"; 
    return cachedUrl;
  };
})();

export const aiService = {
  // Cached backend availability status to prevent unnecessary checks
  _backendAvailableCache: {
    status: null as boolean | null,
    timestamp: 0,
    expiryMs: 60000, // Cache expires after 1 minute
  },
  
  // Main function to generate responses - optimized for speed
  async generateResponse(
    query: string, 
    conversationHistory: Message[] = [], 
    options: { personality?: any } = {}
  ): Promise<string> {
    // Check if backend is available (using cache if possible)
    const backendAvailable = await this.isBackendAvailable();
    
    if (backendAvailable) {
      try {
        return await this.getResponseFromBackend(query, conversationHistory, options);
      } catch (error) {
        console.error("Backend error:", error);
        return this.getFallbackResponse(query);
      }
    } else {
      console.warn("Backend not available, using fallback");
      return this.getFallbackResponse(query);
    }
  },
  
  // Check if the backend is available with caching
  async isBackendAvailable(): Promise<boolean> {
    const now = Date.now();
    const cache = this._backendAvailableCache;
    
    // Use cached result if it's still valid
    if (cache.status !== null && (now - cache.timestamp) < cache.expiryMs) {
      return cache.status;
    }
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000); // Reduced timeout for faster UI
      
      const backendUrl = getBackendUrl();
      const response = await fetch(`${backendUrl}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      // Update cache
      cache.status = response.ok;
      cache.timestamp = now;
      
      return response.ok;
    } catch (error) {
      console.warn("Backend check failed:", error);
      
      // Update cache with failed status
      cache.status = false;
      cache.timestamp = now;
      
      return false;
    }
  },
  
  // Get response from the backend - optimized for performance
  async getResponseFromBackend(
    query: string, 
    conversationHistory: Message[], 
    options: { personality?: any } = {}
  ): Promise<string> {
    // Format conversation history efficiently
    const formattedHistory = conversationHistory.map(msg => ({
      role: msg.isAi ? "assistant" : "user",
      text: msg.text
    }));
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // Reduced timeout for faster experience
      
      const backendUrl = getBackendUrl();
      const response = await fetch(`${backendUrl}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          conversation_history: formattedHistory,
          role: "student", // Default to student role
          options: {
            temperature: 0.7,
            ...options
          }
        }),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Backend error (${response.status}): ${errorText}`);
      }
      
      const data: BackendResponse = await response.json();
      
      // Format response with sources if available
      let formattedResponse = data.response;
      
      // If there are sources, append them to the response
      if (data.sources && data.sources.length > 0) {
        formattedResponse += "\n\n**Sources:**\n";
        data.sources.forEach((source, index) => {
          formattedResponse += `${index + 1}. ${source.title} (${source.source})\n`;
        });
      }
      
      return formattedResponse;
    } catch (error) {
      console.error("Backend fetch error:", error);
      throw error;
    }
  },
  
  // Improved fallback response function
  getFallbackResponse(query: string): string {
    return `I'm currently unable to connect to the ALU knowledge base. Here's a general response to your query about "${query}".

As an ALU student companion, I provide information about courses, campus life, administrative procedures, and academic resources. When our systems are fully operational, I can give you specific information from ALU's knowledge base.

Please try again later when the connection to our backend systems has been restored.`;
  },
  
  // Simplified helper method to fetch from backend with dynamic URL
  async _fetchFromBackend(endpoint: string, method = 'GET', body?: any): Promise<any> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);
      
      const backendUrl = getBackendUrl();
      const options: RequestInit = {
        method,
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal
      };
      
      if (body) {
        options.body = JSON.stringify(body);
      }
      
      const response = await fetch(`${backendUrl}${endpoint}`, options);
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`Backend error (${response.status})`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error fetching from ${endpoint}:`, error);
      throw error;
    }
  }
};
