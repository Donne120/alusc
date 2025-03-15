
import React, { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronLeft, Send } from "lucide-react";
import { Person, ChatMessage } from "./types";

interface HumanChatActiveStageProps {
  selectedPerson: Person;
  chatMessages: ChatMessage[];
  humanChatInput: string;
  isLoading: boolean;
  onInputChange: (input: string) => void;
  onSendMessage: () => void;
  onGoBack: () => void;
}

export const HumanChatActiveStage: React.FC<HumanChatActiveStageProps> = ({
  selectedPerson,
  chatMessages,
  humanChatInput,
  isLoading,
  onInputChange,
  onSendMessage,
  onGoBack
}) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom when messages change or on component mount
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollArea = scrollAreaRef.current;
      scrollArea.scrollTop = scrollArea.scrollHeight;
    }
  }, [chatMessages, isLoading]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Button variant="ghost" size="sm" className="p-0 h-8 w-8" onClick={onGoBack}>
          <ChevronLeft size={16} />
        </Button>
        <h3 className="text-sm font-medium">
          Chat with {selectedPerson?.name}
        </h3>
      </div>
      
      <ScrollArea className="h-48 pr-4 mb-2" viewportRef={scrollAreaRef}>
        <div className="space-y-3">
          {chatMessages.map((msg, index) => (
            <div key={index} className={`flex ${msg.isUser ? "justify-end" : "justify-start"}`}>
              <div className={`rounded-lg px-3 py-2 max-w-[80%] text-sm ${
                msg.isUser 
                  ? "bg-primary text-primary-foreground" 
                  : "bg-secondary text-secondary-foreground"
              }`}>
                {msg.text}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="rounded-lg px-3 py-2 bg-secondary text-secondary-foreground">
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-current animate-bounce"></div>
                  <div className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                  <div className="w-2 h-2 rounded-full bg-current animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
      
      <div className="flex gap-2">
        <Input
          value={humanChatInput}
          onChange={(e) => onInputChange(e.target.value)}
          placeholder="Type your message..."
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              onSendMessage();
            }
          }}
          disabled={isLoading}
        />
        <Button 
          size="sm"
          onClick={onSendMessage}
          disabled={!humanChatInput.trim() || isLoading}
        >
          <Send size={16} />
        </Button>
      </div>
    </div>
  );
};
