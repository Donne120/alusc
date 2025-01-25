import { useState } from "react";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { toast } from "sonner";

export const ChatContainer = () => {
  const [messages, setMessages] = useState<Array<{ text: string; isAi: boolean }>>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (message: string) => {
    // Add user message
    setMessages((prev) => [...prev, { text: message, isAi: false }]);
    setIsLoading(true);

    try {
      // Here you would typically make an API call to your AI model
      // For now, we'll simulate a response
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const aiResponse = "This is a simulated AI response. To make this fully functional, you'll need to connect it to your AI model's API.";
      
      setMessages((prev) => [...prev, { text: aiResponse, isAi: true }]);
    } catch (error) {
      toast.error("Failed to get response. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-chatbg font-inter text-white pb-32">
      {messages.length === 0 ? (
        <div className="h-screen flex items-center justify-center text-gray-400">
          Send a message to start the conversation
        </div>
      ) : (
        <div>
          {messages.map((message, index) => (
            <ChatMessage
              key={index}
              message={message.text}
              isAi={message.isAi}
            />
          ))}
          {isLoading && (
            <div className="py-4 px-8 text-gray-400 animate-pulse">
              AI is thinking...
            </div>
          )}
        </div>
      )}
      <ChatInput onSend={handleSendMessage} disabled={isLoading} />
    </div>
  );
};