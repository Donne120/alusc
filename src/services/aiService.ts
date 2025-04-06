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

interface NypthoStatus {
  learning: {
    observation_count: number;
    learning_rate: number;
    model_confidence: number;
    last_observed: string;
  };
  knowledge: {
    knowledge_items: number;
    topics: string[];
  };
  observed_models: string[];
  ready: boolean;
  error?: string;
}

interface ModelComparisonData {
  models: string[];
  metrics: {
    accuracy: Record<string, number>;
    helpfulness: Record<string, number>;
    creativity: Record<string, number>;
    speed: Record<string, number>;
  };
  strengths: Record<string, string[]>;
  recommendations: string[];
  error?: string;
}

// Helper function to get backend URL
const getBackendUrl = () => {
  // Check if a BACKEND_URL is set in localStorage (for testing)
  const storedBackendUrl = localStorage.getItem('BACKEND_URL');
  if (storedBackendUrl) return storedBackendUrl;
  
  // Local development mode
  if (localStorage.getItem('USE_LOCAL_BACKEND') === 'true') {
    return "http://localhost:8000";
  }
  
  // Production deployment URL
  return "https://alu-chatbot-backend.onrender.com"; // Replace with your actual Render URL
};

export const aiService = {
  // Main function to generate responses
  async generateResponse(
    query: string, 
    conversationHistory: Message[] = [], 
    options: { useNyptho?: boolean, personality?: any } = {}
  ): Promise<string> {
    // Check if backend is available
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
  
  // Check if the backend is available
  async isBackendAvailable(): Promise<boolean> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
      
      const backendUrl = getBackendUrl();
      const response = await fetch(`${backendUrl}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      return response.ok;
    } catch (error) {
      console.warn("Backend check failed:", error);
      return false;
    }
  },
  
  // Get response from the backend
  async getResponseFromBackend(
    query: string, 
    conversationHistory: Message[], 
    options: { useNyptho?: boolean, personality?: any } = {}
  ): Promise<string> {
    // Format conversation history for the backend
    const formattedHistory = conversationHistory.map(msg => ({
      role: msg.isAi ? "assistant" : "user",
      text: msg.text
    }));
    
    // Prepare request options
    const requestOptions = {
      temperature: 0.7,
      ...options
    };
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 20000); // 20 second timeout (increased for better reliability with deployed backend)
      
      const backendUrl = getBackendUrl();
      const response = await fetch(`${backendUrl}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          conversation_history: formattedHistory,
          role: "student", // Default to student role
          options: requestOptions
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
  
  // Fallback response when backend is not available
  getFallbackResponse(query: string): string {
    return `I'm currently unable to connect to the ALU knowledge base. Here's a general response to your query about "${query}".

As an ALU student companion, I provide information about courses, campus life, administrative procedures, and academic resources. When our systems are fully operational, I can give you specific information from ALU's knowledge base.

Please try again later when the connection to our backend systems has been restored.`;
  },
  
  // Get Nyptho status
  async getNypthoStatus(): Promise<NypthoStatus> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
      
      const response = await fetch('http://localhost:8000/nyptho/status', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`Backend error (${response.status})`);
      }
      
      return await response.json();
    } catch (error) {
      console.error("Error getting Nyptho status:", error);
      return { 
        learning: {
          observation_count: 0,
          learning_rate: 0,
          model_confidence: 0,
          last_observed: 'never'
        },
        knowledge: {
          knowledge_items: 0,
          topics: []
        },
        observed_models: [],
        ready: false,
        error: error instanceof Error ? error.message : "Failed to fetch Nyptho status" 
      };
    }
  },
  
  // Update Nyptho personality
  async updateNypthoPersonality(personality: {
    helpfulness: number, 
    creativity: number, 
    precision: number, 
    friendliness: number
  }): Promise<any> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
      
      const response = await fetch('http://localhost:8000/nyptho/personality', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(personality),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`Backend error (${response.status})`);
      }
      
      return await response.json();
    } catch (error) {
      console.error("Error updating Nyptho personality:", error);
      return { error: error instanceof Error ? error.message : "Failed to update Nyptho personality" };
    }
  },
  
  // Get model comparison data
  async getModelComparison(): Promise<ModelComparisonData> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
      
      const response = await fetch('http://localhost:8000/nyptho/model-comparison', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`Backend error (${response.status})`);
      }
      
      return await response.json();
    } catch (error) {
      console.error("Error getting model comparison:", error);
      return { 
        models: [],
        metrics: {
          accuracy: {},
          helpfulness: {},
          creativity: {},
          speed: {}
        },
        strengths: {},
        recommendations: [],
        error: error instanceof Error ? error.message : "Failed to fetch model comparison" 
      };
    }
  },
  
  // Get Nyptho learning statistics
  async getNypthoLearningStats(): Promise<any> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
      
      const response = await fetch('http://localhost:8000/nyptho/learning-stats', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`Backend error (${response.status})`);
      }
      
      return await response.json();
    } catch (error) {
      console.error("Error getting Nyptho learning stats:", error);
      return { error: error instanceof Error ? error.message : "Failed to fetch Nyptho learning stats" };
    }
  },
  
  // Helper method to fetch from backend with dynamic URL
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
