
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SendHorizontal } from "lucide-react";

export const MiniChatbotContentUpdated = () => {
  const [messages, setMessages] = useState<{ text: string; isAi: boolean }[]>([
    { 
      text: "Hi there! I'm your ALU assistant. How can I help you today?", 
      isAi: true 
    },
  ]);
  const [inputText, setInputText] = useState("");

  const handleSendMessage = () => {
    if (inputText.trim()) {
      // Add user message
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: inputText, isAi: false },
      ]);

      // Simulate AI response
      setTimeout(() => {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            text: "I'm a simple chatbot assistant. For more advanced questions, please use the main chat interface.",
            isAi: true,
          },
        ]);
      }, 1000);

      setInputText("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-[400px]">
      <div className="flex-1 overflow-auto p-3 space-y-3">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`p-2 rounded-lg max-w-[80%] ${
              message.isAi
                ? "bg-primary/10 text-foreground ml-0"
                : "bg-primary text-primary-foreground ml-auto"
            }`}
          >
            {message.text}
          </div>
        ))}
      </div>
      <div className="border-t p-3 flex gap-2">
        <Input
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your question..."
          className="flex-1"
        />
        <Button 
          onClick={handleSendMessage} 
          size="icon"
          disabled={!inputText.trim()}
        >
          <SendHorizontal className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};
