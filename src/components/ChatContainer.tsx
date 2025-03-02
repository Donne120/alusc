
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { ChatInput } from "./ChatInput";
import { ConversationSidebar } from "./chat/ConversationSidebar";
import { ChatMessages } from "./chat/ChatMessages";
import { NewsUpdate } from "./news/NewsUpdate";
import { Conversation, Message } from "@/types/chat";
import { GoogleGenerativeAI } from "@google/generative-ai";

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
      const apiKey = localStorage.getItem('GEMINI_API_KEY');
      if (!apiKey) {
        throw new Error('Gemini API key not found. Please add it in settings.');
      }

      const genAI = new GoogleGenerativeAI(apiKey);
      // Update to use the correct model name for the current Gemini API version
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const currentConversation = getCurrentConversation();
      const recentMessages = currentConversation.messages.slice(-MAX_CONTEXT_MESSAGES);
      
      // Create a conversation history in the format expected by Gemini
      const history = recentMessages.map(m => ({
        role: m.isAi ? 'model' : 'user',
        parts: [{ text: m.text }]
      }));
      
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
      
      // Send the user's message to the chat
      const result = await chat.sendMessage(message);
      const response = await result.response;
      const aiResponse = response.text();
      
      setConversations(prev => prev.map(conv => {
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

    } catch (error) {
      console.error('Error:', error);
      toast.error(error instanceof Error ? error.message : "Failed to get response from Gemini");
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
    <div className="min-h-screen bg-[#1A1F2C] font-inter text-white flex">
      <ConversationSidebar
        conversations={conversations}
        currentConversationId={currentConversationId}
        onNewChat={createNewConversation}
        onSelectConversation={setCurrentConversationId}
        onDeleteConversation={handleDeleteConversation}
      />
      <div className="flex-1 pl-16 transition-all duration-300 md:pl-64 flex">
        <div className="flex-1 relative">
          <div className="pb-32">
            <ChatMessages
              messages={currentConversation.messages}
              isLoading={isLoading}
              onEditMessage={handleEditMessage}
            />
          </div>
          <ChatInput onSend={handleSendMessage} disabled={isLoading} />
        </div>
        <div className="hidden lg:block w-80 h-screen sticky top-0">
          <NewsUpdate />
        </div>
      </div>
    </div>
  );
};
