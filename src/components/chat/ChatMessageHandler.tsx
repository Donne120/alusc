
import { useState } from "react";
import { Message } from "@/types/chat";
import { toast } from "sonner";
import { aiService } from "@/services/aiService";

interface ChatMessageHandlerProps {
  currentConversationId: string;
  messages: Message[];
  onAddMessage: (convId: string, message: Message) => void;
  onUpdateTitle?: (convId: string, title: string) => void;
}

export const useChatMessageHandler = ({
  currentConversationId,
  messages,
  onAddMessage,
  onUpdateTitle
}: ChatMessageHandlerProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [activeModel, setActiveModel] = useState(localStorage.getItem("SELECTED_AI_MODEL") || "gemini");

  const handleSendMessage = async (message: string, files: File[]) => {
    // Update the active model for proper loading message
    setActiveModel(localStorage.getItem("SELECTED_AI_MODEL") || "gemini");
    
    const attachments = await Promise.all(
      files.map(async (file) => ({
        type: file.type.startsWith('image/') ? 'image' as const : 'file' as const,
        url: URL.createObjectURL(file),
        name: file.name
      }))
    );

    const newMessage: Message = {
      id: Date.now().toString(),
      text: message,
      isAi: false,
      timestamp: Date.now(),
      attachments
    };

    onAddMessage(currentConversationId, newMessage);
    setIsLoading(true);

    try {
      // Get recent messages for context (limited to MAX_CONTEXT_MESSAGES)
      const MAX_CONTEXT_MESSAGES = 10;
      const recentMessages = messages.slice(-MAX_CONTEXT_MESSAGES);
      
      // Generate AI response
      const aiResponse = await aiService.generateResponse(message, recentMessages);
      
      // Add AI message to conversation
      const aiMessage: Message = {
        id: Date.now().toString(),
        text: aiResponse,
        isAi: true,
        timestamp: Date.now(),
        model: activeModel // Store which model generated this response
      };
      
      onAddMessage(currentConversationId, aiMessage);
      
      // Update conversation title if this is the first user message
      if (messages.length <= 1 && onUpdateTitle) {
        const newTitle = message.slice(0, 30) + (message.length > 30 ? '...' : '');
        onUpdateTitle(currentConversationId, newTitle);
      }
    } catch (error) {
      console.error('Error:', error);
      const modelName = activeModel === 'gemini' ? 'Gemini' : 'DeepSeek';
      toast.error(error instanceof Error ? error.message : `Failed to get response from ${modelName}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditMessage = (messageId: string, newText: string) => {
    const aiMessage = messages.find(msg => msg.isAi && messages.indexOf(msg) > messages.findIndex(m => m.id === messageId));
    if (aiMessage) {
      toast.warning("Editing this message may cause inconsistencies with the AI's response");
    }
  };

  return {
    isLoading,
    activeModel,
    handleSendMessage,
    handleEditMessage
  };
};
