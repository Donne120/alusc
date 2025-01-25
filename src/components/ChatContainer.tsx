import { useState } from "react";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { toast } from "sonner";

interface Message {
  id: string;
  text: string;
  isAi: boolean;
  attachments?: Array<{
    type: 'image' | 'file';
    url: string;
    name: string;
  }>;
}

export const ChatContainer = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

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
      attachments
    };

    setMessages((prev) => [...prev, newMessage]);
    setIsLoading(true);

    try {
      // Make API call to the Llama backend
      const response = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from Llama model');
      }

      const data = await response.json();
      
      if (data.success) {
        setMessages((prev) => [...prev, {
          id: Date.now().toString(),
          text: data.response,
          isAi: true
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
          ? { ...msg, text: newText }
          : msg
      )
    );
    toast.success("Message updated successfully");
  };

  return (
    <div className="min-h-screen bg-[#343541] font-inter text-white pb-32">
      {messages.length === 0 ? (
        <div className="h-screen flex flex-col items-center justify-center text-gray-400 px-4">
          <h1 className="text-3xl font-bold mb-8">Llama Chat</h1>
          <div className="max-w-xl text-center space-y-4">
            <p className="text-lg">Welcome! How can I help you today?</p>
            <p className="text-sm">
              I'm powered by the Llama model. Feel free to ask any question or upload files!
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
                  AI
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