
import { Message } from "@/types/chat";

interface BackendResponse {
  response: string;
  sources?: Array<{
    title: string;
    source: string;
    date?: string;
  }>;
}

export const aiService = {
  // Main function to generate responses
  async generateResponse(query: string, conversationHistory: Message[] = []): Promise<string> {
    // Check if backend is available
    const backendAvailable = await this.isBackendAvailable();
    
    if (backendAvailable) {
      try {
        return await this.getResponseFromBackend(query, conversationHistory);
      } catch (error) {
        console.error("Backend error:", error);
        throw new Error("Could not get response from backend");
      }
    } else {
      console.warn("Backend not available, using fallback");
      return this.getFallbackResponse(query);
    }
  },
  
  // Check if the backend is available
  async isBackendAvailable(): Promise<boolean> {
    try {
      const response = await fetch('http://localhost:8000', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(2000) // 2 second timeout
      });
      
      return response.ok;
    } catch (error) {
      console.warn("Backend check failed:", error);
      return false;
    }
  },
  
  // Get response from the backend
  async getResponseFromBackend(query: string, conversationHistory: Message[]): Promise<string> {
    // Format conversation history for the backend
    const formattedHistory = conversationHistory.map(msg => ({
      role: msg.isAi ? "assistant" : "user",
      text: msg.text
    }));
    
    const response = await fetch('http://localhost:8000/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query,
        conversation_history: formattedHistory,
        role: "student", // Default to student role
        options: { temperature: 0.7 }
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Backend error (${response.status}): ${errorText}`);
    }
    
    const data: BackendResponse = await response.json();
    
    // If there are sources, append them to the response
    if (data.sources && data.sources.length > 0) {
      let responseWithSources = data.response;
      
      responseWithSources += "\n\n**Sources:**\n";
      data.sources.forEach((source, index) => {
        responseWithSources += `${index + 1}. ${source.title} (${source.source})\n`;
      });
      
      return responseWithSources;
    }
    
    return data.response;
  },
  
  // Fallback response when backend is not available
  getFallbackResponse(query: string): string {
    return `I'm sorry, but I'm currently unable to connect to the ALU knowledge base. Here's a general response to your query about "${query}".

As an ALU student companion, I typically provide information about courses, campus life, administrative procedures, and academic resources. When our systems are fully operational, I can give you specific information from ALU's knowledge base.

Please try again later when the connection to our backend systems has been restored.`;
  }
};
