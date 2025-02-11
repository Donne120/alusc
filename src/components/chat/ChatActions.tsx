
import { Conversation, Message } from "@/types/chat";
import { toast } from "sonner";
import { initializeDefaultConversation, MAX_CONTEXT_MESSAGES } from "./ChatState";
import { useState } from "react";

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
  const [apiKey, setApiKey] = useState(localStorage.getItem('perplexity_api_key') || '');

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
    if (!apiKey) {
      const key = prompt("Please enter your Perplexity API key to continue:");
      if (!key) {
        toast.error("API key is required");
        return;
      }
      setApiKey(key);
      localStorage.setItem('perplexity_api_key', key);
    }

    const attachments = await Promise.all(
      files.filter(file => file !== null).map(async (file) => {
        if (!file) return null;
        
        const fileType = file.type.toLowerCase();
        let type: 'image' | 'file' = 'file';

        if (fileType.startsWith('image/')) {
          type = 'image';
        }
        
        return {
          type,
          url: URL.createObjectURL(file),
          name: file.name,
          size: file.size
        };
      })
    ).then(results => results.filter((attachment): attachment is NonNullable<typeof attachment> => attachment !== null));

    const newMessage: Message = {
      id: Date.now().toString(),
      text: message,
      isAi: false,
      timestamp: Date.now(),
      attachments: attachments
    };

    const updatedConversations = conversations.map(conv => {
      if (conv.id === currentConversationId) {
        return {
          ...conv,
          messages: [...conv.messages, newMessage]
        };
      }
      return conv;
    });
    setConversations(updatedConversations);

    setIsLoading(true);

    try {
      const currentConversation = getCurrentConversation();
      const recentMessages = currentConversation.messages.slice(-MAX_CONTEXT_MESSAGES);
      
      const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.1-sonar-small-128k-online',
          messages: [
            {
              role: 'system',
              content: 'You are a helpful assistant providing precise and concise answers.'
            },
            ...recentMessages.map(m => ({
              role: m.isAi ? 'assistant' : 'user',
              content: m.text
            })),
            {
              role: 'user',
              content: message
            }
          ],
          temperature: 0.2,
          top_p: 0.9,
          max_tokens: 1000
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from Perplexity API');
      }

      const data = await response.json();
      const aiResponse = data.choices[0].message.content;
      
      const newConversations = conversations.map(conv => {
        if (conv.id === currentConversationId) {
          const updatedMessages = [...conv.messages, {
            id: Date.now().toString(),
            text: aiResponse,
            isAi: true,
            timestamp: Date.now()
          }];
          
          return {
            ...conv,
            title: conv.messages.length === 0 ? 
              message.slice(0, 30) + (message.length > 30 ? '...' : '') : 
              conv.title,
            messages: updatedMessages
          };
        }
        return conv;
      });
      setConversations(newConversations);
    } catch (error) {
      console.error('Error:', error);
      toast.error("Failed to get response. Please check your API key and try again.");
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
