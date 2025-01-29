import { useState, useEffect } from "react";
import { Conversation } from "@/types/chat";
import { toast } from "sonner";

export const STORAGE_KEY = 'alu_chat_conversations';
export const MAX_CONTEXT_MESSAGES = 10;

export const initializeDefaultConversation = (): Conversation => {
  return {
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
};

export const useChatState = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const savedConversations = localStorage.getItem(STORAGE_KEY);
    if (savedConversations) {
      try {
        const parsed = JSON.parse(savedConversations);
        if (parsed.length > 0) {
          setConversations(parsed);
          setCurrentConversationId(parsed[0].id);
        } else {
          const defaultConv = initializeDefaultConversation();
          setConversations([defaultConv]);
          setCurrentConversationId(defaultConv.id);
        }
      } catch (error) {
        console.error('Error loading conversations:', error);
        toast.error("Failed to load previous conversations");
        const defaultConv = initializeDefaultConversation();
        setConversations([defaultConv]);
        setCurrentConversationId(defaultConv.id);
      }
    } else {
      const defaultConv = initializeDefaultConversation();
      setConversations([defaultConv]);
      setCurrentConversationId(defaultConv.id);
    }
  }, []);

  useEffect(() => {
    if (conversations.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
    }
  }, [conversations]);

  return {
    conversations,
    setConversations,
    currentConversationId,
    setCurrentConversationId,
    isLoading,
    setIsLoading
  };
};