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

const STORAGE_KEY = 'alu_chat_messages';

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
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load messages from localStorage on component mount
  useEffect(() => {
    const savedMessages = localStorage.getItem(STORAGE_KEY);
    if (savedMessages) {
      try {
        const parsedMessages = JSON.parse(savedMessages);
        setMessages(parsedMessages);
      } catch (error) {
        console.error('Error loading messages:', error);
        toast.error("Failed to load previous messages");
      }
    } else {
      // Set initial welcome message if no stored messages
      setMessages([{
        id: "welcome",
        text: `# Welcome to ALU Student Companion\n\n## Text Formatting\n**Bold text** for emphasis\n*Italic text* for subtle emphasis\n***Bold and italic*** for strong emphasis\n~~Strikethrough~~ for outdated content\n\n## Lists\n### Ordered List\n1. First item\n2. Second item\n3. Third item\n\n### Unordered List\n- Main point\n  - Sub-point\n  - Another sub-point\n- Another point\n\n## Blockquotes\n> Important information or quotes go here\n> Multiple lines can be used\n>> Nested quotes are possible\n\n## Code Examples\nInline \`code\` looks like this\n\n\`\`\`python\ndef hello_world():\n    print("Hello, students!")\n\`\`\`\n\n## Tables\n| Feature | Description |\n|---------|-------------|\n| Chat | Real-time assistance |\n| Resources | Study materials |\n| Practice | Interactive exercises |\n\n---\n\nFeel free to ask any questions!`,
        isAi: true,
        timestamp: Date.now()
      }]);
    }
  }, []);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

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

    setMessages((prev) => [...prev, newMessage]);
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message,
          context: messages.slice(-5).map(m => ({ role: m.isAi ? 'assistant' : 'user', content: m.text }))
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from Llama model');
      }

      const data = await response.json();
      
      if (data.success) {
        const aiResponse = data.response;
        setMessages((prev) => [...prev, {
          id: Date.now().toString(),
          text: aiResponse,
          isAi: true,
          timestamp: Date.now()
        }]);
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
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId
          ? { ...msg, text: newText, timestamp: Date.now() }
          : msg
      )
    );
    toast.success("Message updated successfully");
  };

  return (
    <div className="min-h-screen bg-[#343541] font-inter text-white pb-32">
      {messages.length === 0 ? (
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
          {messages.map((message) => (
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
      <ChatInput onSend={handleSendMessage} disabled={isLoading} />
    </div>
  );
};