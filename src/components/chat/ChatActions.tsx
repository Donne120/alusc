import { Conversation, Message } from "@/types/chat";
import { toast } from "sonner";
import { initializeDefaultConversation, MAX_CONTEXT_MESSAGES } from "./ChatState";

interface ChatActionsProps {
  conversations: Conversation[];
  setConversations: (conversations: Conversation[]) => void;
  currentConversationId: string;
  setCurrentConversationId: (id: string) => void;
  setIsLoading: (loading: boolean) => void;
}

export const useChatActions = ({
  conversations,
  setConversations,
  currentConversationId,
  setCurrentConversationId,
  setIsLoading
}: ChatActionsProps) => {
  const getCurrentConversation = (): Conversation => {
    const current = conversations.find(conv => conv.id === currentConversationId);
    if (!current && conversations.length > 0) {
      return conversations[0];
    }
    if (!current) {
      return initializeDefaultConversation();
    }
    return current;
  };

  const createNewConversation = () => {
    const newConversation: Conversation = {
      id: Date.now().toString(),
      title: "New Chat",
      messages: [],
      timestamp: Date.now()
    };
    setConversations([newConversation, ...conversations]);
    setCurrentConversationId(newConversation.id);
  };

  const handleDeleteConversation = (convId: string) => {
    const remainingConversations = conversations.filter(conv => conv.id !== convId);
    setConversations(remainingConversations);
    
    if (convId === currentConversationId) {
      if (remainingConversations.length > 0) {
        setCurrentConversationId(remainingConversations[0].id);
      } else {
        createNewConversation();
      }
    }
    
    toast.success("Conversation deleted");
  };

  const handleSendMessage = async (message: string, files: File[]) => {
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

    setConversations(conversations.map(conv => {
      if (conv.id === currentConversationId) {
        return {
          ...conv,
          messages: [...conv.messages, newMessage]
        };
      }
      return conv;
    }));

    setIsLoading(true);

    try {
      const currentConversation = getCurrentConversation();
      const recentMessages = currentConversation.messages.slice(-MAX_CONTEXT_MESSAGES);
      
      const response = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message,
          context: recentMessages.map(m => ({ 
            role: m.isAi ? 'assistant' : 'user', 
            content: m.text 
          }))
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from Llama model');
      }

      const data = await response.json();
      
      if (data.success) {
        const aiResponse = data.response;
        setConversations(conversations.map(conv => {
          if (conv.id === currentConversationId) {
            const updatedMessages = [...conv.messages, {
              id: Date.now().toString(),
              text: aiResponse,
              isAi: true,
              timestamp: Date.now()
            }];
            
            const updatedTitle = conv.messages.length === 0 ? 
              message.slice(0, 30) + (message.length > 30 ? '...' : '') : 
              conv.title;
            
            return {
              ...conv,
              title: updatedTitle,
              messages: updatedMessages
            };
          }
          return conv;
        }));
      } else {
        throw new Error('Failed to get valid response from model');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error("Failed to get response. Please ensure the Llama backend is running.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditMessage = (messageId: string, newText: string) => {
    setConversations(conversations.map(conv => {
      if (conv.id === currentConversationId) {
        return {
          ...conv,
          messages: conv.messages.map(msg =>
            msg.id === messageId
              ? { ...msg, text: newText, timestamp: Date.now() }
              : msg
          )
        };
      }
      return conv;
    }));
    toast.success("Message updated successfully");
  };

  return {
    getCurrentConversation,
    createNewConversation,
    handleDeleteConversation,
    handleSendMessage,
    handleEditMessage
  };
};