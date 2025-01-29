import { useState, useEffect } from "react";
import { toast } from "sonner";
import { ChatInput } from "./ChatInput";
import { ConversationSidebar } from "./chat/ConversationSidebar";
import { ChatMessages } from "./chat/ChatMessages";
import { Conversation, Message } from "@/types/chat";

const STORAGE_KEY = 'alu_chat_conversations';
const MAX_CONTEXT_MESSAGES = 10;

export const ChatContainer = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const initializeDefaultConversation = () => {
    const defaultConversation: Conversation = {
      id: Date.now().toString(),
      title: "New Chat",
      timestamp: Date.now(),
      messages: [{
        id: "welcome",
        text: `# Welcome to ALU Student Companion\n\nI'm here to help! I'll remember our conversation and provide relevant context-aware responses. Feel free to ask any questions!`,
        isAi: true,
        timestamp: Date.now()
      }]
    };
    setConversations([defaultConversation]);
    setCurrentConversationId(defaultConversation.id);
    return defaultConversation;
  };

  useEffect(() => {
    const savedConversations = localStorage.getItem(STORAGE_KEY);
    if (savedConversations) {
      try {
        const parsed = JSON.parse(savedConversations);
        if (parsed.length > 0) {
          setConversations(parsed);
          setCurrentConversationId(parsed[0].id);
        } else {
          initializeDefaultConversation();
        }
      } catch (error) {
        console.error('Error loading conversations:', error);
        toast.error("Failed to load previous conversations");
        initializeDefaultConversation();
      }
    } else {
      initializeDefaultConversation();
    }
  }, []);

  useEffect(() => {
    if (conversations.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
    }
  }, [conversations]);

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
    setConversations(prev => [newConversation, ...prev]);
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

    setConversations(prev => prev.map(conv => {
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
        setConversations(prev => prev.map(conv => {
          if (conv.id === currentConversationId) {
            const updatedMessages = [...conv.messages, {
              id: Date.now().toString(),
              text: aiResponse,
              isAi: true,
              timestamp: Date.now()
            }];
            
            // Update conversation title if it's a new conversation
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
    setConversations(prev => prev.map(conv => {
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

  const currentConversation = getCurrentConversation();

  return (
    <div className="min-h-screen bg-[#343541] font-inter text-white">
      <ConversationSidebar
        conversations={conversations}
        currentConversationId={currentConversationId}
        onNewChat={createNewConversation}
        onSelectConversation={setCurrentConversationId}
        onDeleteConversation={handleDeleteConversation}
      />
      <div className="pl-64">
        <div className="pb-32">
          <ChatMessages
            messages={currentConversation.messages}
            isLoading={isLoading}
            onEditMessage={handleEditMessage}
          />
        </div>
        <ChatInput onSend={handleSendMessage} disabled={isLoading} />
      </div>
    </div>
  );
};