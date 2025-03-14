
import { GoogleGenerativeAI } from "@google/generative-ai";
import { documentService } from "@/services/documentService";
import { Message } from "@/types/chat";

const MAX_CONTEXT_MESSAGES = 10;

export const aiService = {
  async generateResponse(userMessage: string, recentMessages: Message[]): Promise<string> {
    // Check if message is ALU related by looking for keywords
    const isAluRelated = /\balu\b|\bafrican leadership university\b|\bstudent\b|\bcourse\b|\bprogram\b|\bdegree\b/i.test(userMessage);
    
    // Check if user wants to use the local backend service
    const useLocalBackend = localStorage.getItem('USE_LOCAL_BACKEND') === 'true';
    
    // If ALU related, try local backend first (if enabled)
    if (isAluRelated && useLocalBackend) {
      try {
        return await this.generateLocalBackendResponse(userMessage);
      } catch (error) {
        console.log("Local backend failed, falling back to Gemini:", error);
        // Fall back to Gemini on error
      }
    }
    
    // Use Gemini API as fallback
    const apiKey = localStorage.getItem('GEMINI_API_KEY');
    if (!apiKey) {
      throw new Error('Gemini API key not found. Please add it in settings.');
    }
    return this.generateGeminiResponse(apiKey, userMessage, recentMessages);
  },

  async generateLocalBackendResponse(userMessage: string): Promise<string> {
    try {
      const response = await fetch("http://localhost:8000/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: userMessage }),
      });
      
      if (!response.ok) {
        throw new Error(`Backend API returned status: ${response.status}`);
      }
      
      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error("Error fetching from local backend:", error);
      throw new Error(`Failed to connect to local backend: ${error.message}`);
    }
  },

  async generateGeminiResponse(apiKey: string, userMessage: string, recentMessages: Message[]): Promise<string> {
    // Check if message is ALU related by looking for keywords
    const isAluRelated = /\balu\b|\bafrican leadership university\b|\bstudent\b|\bcourse\b|\bprogram\b|\bdegree\b/i.test(userMessage);
    
    // If ALU related, search our document repository for relevant content
    let contextualInfo = '';
    if (isAluRelated) {
      contextualInfo = documentService.searchDocuments(userMessage);
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    // Create a conversation history in the format expected by Gemini
    const history = recentMessages.map(m => ({
      role: m.isAi ? 'model' : 'user',
      parts: [{ text: m.text }]
    }));
    
    // Prepare system prompt with contextual info if available
    let systemPrompt = "You are an AI assistant for African Leadership University (ALU) students.";
    
    if (contextualInfo) {
      systemPrompt += "\n\nHere is some relevant context from ALU documentation that may help you answer:\n" + contextualInfo;
    }
    
    // Use the chat method for proper conversation context
    const chat = model.startChat({
      history,
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
    });
    
    // Add system prompt to the chat
    if (contextualInfo) {
      await chat.sendMessage(systemPrompt);
    }
    
    // Send the user's message to the chat
    const result = await chat.sendMessage(userMessage);
    const response = await result.response;
    return response.text();
  }
};
