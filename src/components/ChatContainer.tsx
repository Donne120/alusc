import { useState, useEffect } from "react";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { toast } from "sonner";

interface Message {
  id: string;
  text: string;
  isAi: boolean;
  timestamp: number;
  attachments?: Array<{
    type: 'image' | 'file';
    url: string;
    name: string;
  }>;
}

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  timestamp: number;
}

const STORAGE_KEY = 'alu_chat_conversations';
const MAX_CONTEXT_MESSAGES = 10;

const formatMarkdown = (text: string, type: 'code' | 'math' | 'general') => {
  switch (type) {
    case 'code':
      return `\`\`\`python\n${text}\n\`\`\``;
    case 'math':
      return `$${text}$`;
    default:
      return text;
  }
};

export const ChatContainer = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  // Initialize with a default conversation if none exists
  const initializeDefaultConversation = () => {
    const defaultConversation: Conversation = {
      id: Date.now().toString(),
      title: "New Chat",
      timestamp: Date.now(),
      messages: [{
        id: "welcome",
        text: `# Welcome to ALU Student Companion\n\n## Text Formatting\n**Bold text** for emphasis\n*Italic text* for subtle emphasis\n***Bold and italic*** for strong emphasis\n~~Strikethrough~~ for outdated content\n\n## Lists\n### Ordered List\n1. First item\n2. Second item\n3. Third item\n\n### Unordered List\n- Main point\n  - Sub-point\n  - Another sub-point\n- Another point\n\n## Blockquotes\n> Important information or quotes go here\n> Multiple lines can be used\n>> Nested quotes are possible\n\n## Code Examples\nInline \`code\` looks like this\n\n\`\`\`python\ndef hello_world():\n    print("Hello, students!")\n\`\`\`\n\n## Tables\n| Feature | Description |\n|---------|-------------|\n| Chat | Real-time assistance |\n| Resources | Study materials |\n| Practice | Interactive exercises |\n\n---\n\nFeel free to ask any questions!`,
        isAi: true,
        timestamp: Date.now()
      }]
    };
    setConversations([defaultConversation]);
    setCurrentConversationId(defaultConversation.id);
    return defaultConversation;
  };

  // Load conversations from localStorage on component mount
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

  // Save conversations to localStorage whenever they change
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
            return {
              ...conv,
              messages: [...conv.messages, {
                id: Date.now().toString(),
                text: aiResponse,
                isAi: true,
                timestamp: Date.now()
              }]
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
      {/* Sidebar for conversation history */}
      <div className="fixed left-0 top-0 h-full w-64 bg-[#202123] p-2 overflow-y-auto border-r border-gray-700">
        <button
          onClick={createNewConversation}
          className="w-full p-3 mb-2 bg-[#40414f] hover:bg-[#4f505f] rounded-lg text-left flex items-center gap-2"
        >
          <span>+ New Chat</span>
        </button>
        <div className="space-y-2">
          {conversations.map(conv => (
            <button
              key={conv.id}
              onClick={() => setCurrentConversationId(conv.id)}
              className={`w-full p-3 rounded-lg text-left truncate hover:bg-[#40414f] ${
                conv.id === currentConversationId ? 'bg-[#40414f]' : ''
              }`}
            >
              {conv.title || 'New Chat'}
            </button>
          ))}
        </div>
      </div>

      {/* Main chat area */}
      <div className="pl-64">
        <div className="pb-32">
          {currentConversation.messages.length === 0 ? (
            <div className="h-screen flex flex-col items-center justify-center text-gray-400 px-4">
              <h1 className="text-3xl font-bold mb-8">ALU Student Companion</h1>
              <div className="max-w-xl text-center space-y-4">
                <p className="text-lg">Welcome! How can I help you today?</p>
                <p className="text-sm">
                  I'm your academic assistant. Feel free to ask any questions!
                </p>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-gray-700">
              {currentConversation.messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  message={message.text}
                  isAi={message.isAi}
                  attachments={message.attachments}
                  onEdit={(newText) => handleEditMessage(message.id, newText)}
                />
              ))}
              {isLoading && (
                <div className="py-4 px-8 text-gray-400 animate-pulse bg-[#444654] border-b border-gray-700">
                  <div className="max-w-3xl mx-auto flex gap-4 md:gap-6">
                    <div className="w-8 h-8 rounded bg-[#19c37d] flex items-center justify-center text-white shrink-0">
                      SC
                    </div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-600 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-600 rounded w-1/2 mt-2"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        <ChatInput onSend={handleSendMessage} disabled={isLoading} />
      </div>
    </div>
  );
};
