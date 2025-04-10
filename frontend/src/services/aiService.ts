
import type { ChatMessage, Conversation, MessageRole, User } from "../types/chat";

/**
 * Get the API URL for the AI chat service
 */
function getApiUrl() {
  // Use a fallback if import.meta.env is not available
  const API_URL = "https://alu-student-companion-api.onrender.com";
  return API_URL;
}

/**
 * Fetch AI chat response from the backend
 */
export async function fetchAIResponse(
  message: string,
  conversation?: Conversation
): Promise<ChatMessage> {
  try {
    const apiUrl = getApiUrl();
    const endpoint = `${apiUrl}/api/chat`;
    
    // Prepare context from previous messages (if any)
    const prevMessages = conversation?.messages || [];
    
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Add authorization header if needed
      },
      body: JSON.stringify({
        message,
        conversation_id: conversation?.id || null,
        messages: prevMessages.map(msg => ({
          role: msg.role,
          content: msg.content
        }))
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    
    return {
      id: data.message_id || `msg_${Date.now()}`,
      role: "assistant" as MessageRole,
      content: data.response || data.message || "I'm having trouble responding right now.",
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Error fetching AI response:", error);
    return {
      id: `error_${Date.now()}`,
      role: "assistant",
      content: "I'm sorry, I encountered an error while processing your request. Please try again later.",
      timestamp: new Date().toISOString(),
    };
  }
}

/**
 * Fetch conversations for a user
 */
export async function fetchConversations(user: User): Promise<Conversation[]> {
  try {
    const apiUrl = getApiUrl();
    const endpoint = `${apiUrl}/api/conversations`;
    
    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`
      }
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data.conversations || [];
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return [];
  }
}

/**
 * Create a new conversation
 */
export async function createConversation(
  title: string, 
  user: User
): Promise<Conversation | null> {
  try {
    const apiUrl = getApiUrl();
    const endpoint = `${apiUrl}/api/conversations`;
    
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`
      },
      body: JSON.stringify({ title })
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();
    return data.conversation || null;
  } catch (error) {
    console.error("Error creating conversation:", error);
    return null;
  }
}

/**
 * Delete a conversation
 */
export async function deleteConversation(
  conversationId: string,
  user: User
): Promise<boolean> {
  try {
    const apiUrl = getApiUrl();
    const endpoint = `${apiUrl}/api/conversations/${conversationId}`;
    
    const response = await fetch(endpoint, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`
      }
    });

    return response.ok;
  } catch (error) {
    console.error("Error deleting conversation:", error);
    return false;
  }
}
