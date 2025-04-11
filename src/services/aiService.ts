
import { Message } from "../types/chat";

type MessageRole = "user" | "assistant" | "system";

interface AIChatMessage {
  content: string;
  role: string;
}

interface AIChatRequest {
  messages: AIChatMessage[];
  model?: string;
  temperature?: number;
  max_tokens?: number;
}

// Convert our app's message format to the AI service format
const formatMessages = (messages: Message[]): AIChatMessage[] => {
  return messages.map((message) => ({
    content: message.text,
    role: message.isAi ? "assistant" : "user",
  }));
};

// Base AI service
export class AIService {
  protected async sendRequest(
    endpoint: string,
    body: any,
    apiKey: string
  ): Promise<Response> {
    return fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(body),
    });
  }

  async sendMessage(
    messages: Message[],
    model: string = "gpt-3.5-turbo"
  ): Promise<string> {
    throw new Error("Method not implemented in base class");
  }
}

// OpenAI implementation
export class OpenAIService extends AIService {
  private apiKey: string;

  constructor() {
    super();
    this.apiKey = import.meta.env.VITE_OPENAI_API_KEY || "";
  }

  async sendMessage(
    messages: Message[],
    model: string = "gpt-3.5-turbo"
  ): Promise<string> {
    try {
      const formattedMessages = formatMessages(messages);
      const body: AIChatRequest = {
        messages: formattedMessages,
        model,
        temperature: 0.7,
        max_tokens: 1000,
      };

      const response = await this.sendRequest(
        "https://api.openai.com/v1/chat/completions",
        body,
        this.apiKey
      );

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`OpenAI API error: ${error}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error("Error calling OpenAI:", error);
      throw error;
    }
  }
}

// Anthropic implementation
export class AnthropicService extends AIService {
  private apiKey: string;

  constructor() {
    super();
    this.apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY || "";
  }

  async sendMessage(
    messages: Message[],
    model: string = "claude-2"
  ): Promise<string> {
    try {
      const formattedMessages = formatMessages(messages);
      
      const body = {
        messages: formattedMessages,
        model,
        max_tokens: 1000,
      };

      const response = await this.sendRequest(
        "https://api.anthropic.com/v1/messages",
        body,
        this.apiKey
      );

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Anthropic API error: ${error}`);
      }

      const data = await response.json();
      return data.content[0].text;
    } catch (error) {
      console.error("Error calling Anthropic:", error);
      throw error;
    }
  }
}

// Google Gemini implementation
export class GeminiService extends AIService {
  private apiKey: string;

  constructor() {
    super();
    this.apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";
  }

  async sendMessage(
    messages: Message[],
    model: string = "gemini-pro"
  ): Promise<string> {
    try {
      const formattedMessages = formatMessages(messages);
      
      const body = {
        contents: formattedMessages.map(msg => ({
          role: msg.role === "user" ? "user" : "model",
          parts: [{ text: msg.content }]
        })),
      };

      const response = await this.sendRequest(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${this.apiKey}`,
        body,
        ""
      );

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Gemini API error: ${error}`);
      }

      const data = await response.json();
      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error("Error calling Gemini:", error);
      throw error;
    }
  }
}

// AI Service factory
export const createAIService = (provider: string): AIService => {
  switch (provider.toLowerCase()) {
    case "openai":
      return new OpenAIService();
    case "anthropic":
      return new AnthropicService();
    case "gemini":
      return new GeminiService();
    default:
      return new OpenAIService();
  }
};

// Export a singleton instance of AI Service
export const aiService = {
  async generateResponse(
    query: string,
    conversationHistory: Message[] = [],
    options: { personality?: any; useNyptho?: boolean } = {}
  ): Promise<string> {
    try {
      // Create a default AI service (OpenAI)
      const service = new OpenAIService();
      return await service.sendMessage([...conversationHistory, { id: Date.now().toString(), text: query, isAi: false, timestamp: Date.now() }]);
    } catch (error) {
      console.error("Error generating response:", error);
      return "I'm sorry, I'm having trouble connecting right now. Please try again later.";
    }
  },

  async getNypthoStatus(): Promise<{ ready: boolean; learning: any }> {
    return { ready: false, learning: { observation_count: 0, learning_rate: 0 } };
  }
};
