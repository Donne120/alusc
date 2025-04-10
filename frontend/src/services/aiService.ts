
// This file contains the AI service that interacts with the backend
import { Message } from "../types/chat";

/**
 * Service for interacting with the AI backend
 */
export const aiService = {
  // Cache for backend availability to reduce repeated checks
  _backendAvailableCache: {
    status: null as boolean | null,
    timestamp: 0,
    expiryMs: 30000, // 30 seconds cache validity
  },
  
  // Cache for backend status to avoid repeated API calls
  _backendStatusCache: {
    status: null as { status: string; message: string } | null,
    timestamp: 0,
    expiryMs: 60000, // 60 seconds cache validity
  },
  
  // Cache for Nyptho status to avoid repeated API calls
  _nypthoStatusCache: {
    status: null as any | null,
    timestamp: 0,
    expiryMs: 120000, // 120 seconds cache validity
  },

  /**
   * Generates a response from the AI
   */
  async generateResponse(
    query: string,
    conversationHistory: Message[] = [],
    options: { personality?: any; useNyptho?: boolean } = {}
  ): Promise<string> {
    try {
      // Check if backend is available
      const isAvailable = await this.isBackendAvailable();
      if (!isAvailable) {
        throw new Error("Backend service is currently unavailable");
      }

      // Use the backend for response generation
      return await this.getResponseFromBackend(query, conversationHistory, options);
    } catch (error) {
      console.error("Error generating response:", error);
      return "I'm sorry, I'm having trouble connecting to the ALU knowledge base right now. Please try again later.";
    }
  },

  /**
   * Checks if the backend is available
   */
  async isBackendAvailable(): Promise<boolean> {
    // Use cache if valid
    const now = Date.now();
    if (
      this._backendAvailableCache.status !== null &&
      now - this._backendAvailableCache.timestamp < this._backendAvailableCache.expiryMs
    ) {
      return this._backendAvailableCache.status;
    }

    try {
      // Use a default URL if environment variable is not defined
      const apiUrl = typeof import.meta !== 'undefined' && import.meta.env ? 
        import.meta.env.VITE_API_URL || 'http://localhost:8000' : 
        'http://localhost:8000';
        
      const response = await fetch(`${apiUrl}/health`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        signal: AbortSignal.timeout(2000), // 2 second timeout
      });

      const isAvailable = response.ok;
      
      // Update cache
      this._backendAvailableCache.status = isAvailable;
      this._backendAvailableCache.timestamp = now;
      
      return isAvailable;
    } catch (error) {
      console.error("Backend health check failed:", error);
      
      // Update cache with failed status
      this._backendAvailableCache.status = false;
      this._backendAvailableCache.timestamp = now;
      
      return false;
    }
  },

  /**
   * Gets a response from the backend
   */
  async getResponseFromBackend(
    query: string,
    conversationHistory: Message[],
    options: { personality?: any; useNyptho?: boolean } = {}
  ): Promise<string> {
    try {
      // Convert the conversation history to the format expected by the backend
      const history = conversationHistory.map((message) => ({
        role: message.isAi ? "assistant" : "user",
        content: message.text,
      }));

      // Use a default URL if environment variable is not defined
      const apiUrl = typeof import.meta !== 'undefined' && import.meta.env ? 
        import.meta.env.VITE_API_URL || 'http://localhost:8000' : 
        'http://localhost:8000';

      const response = await fetch(`${apiUrl}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: query,
          history,
          options,
        }),
      });

      if (!response.ok) {
        throw new Error(`Backend response error: ${response.status}`);
      }

      const data = await response.json();
      return data.response || "No response from backend";
    } catch (error) {
      console.error("Error getting response from backend:", error);
      throw new Error("Failed to get response from backend");
    }
  },

  /**
   * Gets the backend status information
   */
  async getBackendStatus(): Promise<{ status: string; message: string }> {
    // Use cache if valid
    const now = Date.now();
    if (
      this._backendStatusCache.status !== null &&
      now - this._backendStatusCache.timestamp < this._backendStatusCache.expiryMs
    ) {
      return this._backendStatusCache.status;
    }
    
    try {
      const isAvailable = await this.isBackendAvailable();
      
      const status = {
        status: isAvailable ? 'online' : 'offline',
        message: isAvailable ? 'Knowledge base connected' : 'Knowledge base unavailable'
      };
      
      // Update cache
      this._backendStatusCache.status = status;
      this._backendStatusCache.timestamp = now;
      
      return status;
    } catch (error) {
      const fallbackStatus = {
        status: 'offline',
        message: 'Knowledge base unavailable'
      };
      
      // Update cache with error status
      this._backendStatusCache.status = fallbackStatus;
      this._backendStatusCache.timestamp = now;
      
      return fallbackStatus;
    }
  },

  /**
   * Gets the status of the Nyptho system
   */
  async getNypthoStatus(): Promise<{ ready: boolean; learning: any }> {
    // Use cache if valid
    const now = Date.now();
    if (
      this._nypthoStatusCache.status !== null &&
      now - this._nypthoStatusCache.timestamp < this._nypthoStatusCache.expiryMs
    ) {
      return this._nypthoStatusCache.status;
    }
    
    try {
      // Use a default URL if environment variable is not defined
      const apiUrl = typeof import.meta !== 'undefined' && import.meta.env ? 
        import.meta.env.VITE_API_URL || 'http://localhost:8000' : 
        'http://localhost:8000';
        
      const response = await fetch(`${apiUrl}/nyptho/status`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        signal: AbortSignal.timeout(2000),
      });

      if (!response.ok) {
        const fallbackStatus = { ready: false, learning: { observation_count: 0, learning_rate: 0 } };
        this._nypthoStatusCache.status = fallbackStatus;
        this._nypthoStatusCache.timestamp = now;
        return fallbackStatus;
      }

      const data = await response.json();
      const status = {
        ready: data.ready || false,
        learning: data.learning || { observation_count: 0, learning_rate: 0 }
      };
      
      // Update cache
      this._nypthoStatusCache.status = status;
      this._nypthoStatusCache.timestamp = now;
      
      return status;
    } catch (error) {
      console.error("Error getting Nyptho status:", error);
      
      const fallbackStatus = { ready: false, learning: { observation_count: 0, learning_rate: 0 } };
      
      // Update cache
      this._nypthoStatusCache.status = fallbackStatus;
      this._nypthoStatusCache.timestamp = now;
      
      return fallbackStatus;
    }
  }
};
