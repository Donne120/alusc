
import React, { useRef, useEffect } from "react";
import { Person, ChatMessage } from "./types";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Send, Sparkles } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface HumanChatActiveStageProps {
  selectedPerson: Person;
  chatMessages: ChatMessage[];
  humanChatInput: string;
  isLoading: boolean;
  onInputChange: (value: string) => void;
  onSendMessage: () => void;
  onGoBack: () => void;
  useNyptho?: boolean;
  aiPersona?: {
    name: string;
    traits: {
      helpfulness: number;
      creativity: number;
      precision: number;
      friendliness: number;
    }
  };
}

export const HumanChatActiveStage = ({
  selectedPerson,
  chatMessages,
  humanChatInput,
  isLoading,
  onInputChange,
  onSendMessage,
  onGoBack,
  useNyptho = false,
  aiPersona
}: HumanChatActiveStageProps) => {
  const scrollViewportRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollViewportRef.current) {
      scrollViewportRef.current.scrollTop = scrollViewportRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <Button variant="ghost" size="sm" onClick={onGoBack}>
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>
        <div className="flex items-center">
          <span className="font-medium">{selectedPerson.name}</span>
          {useNyptho && (
            <Badge className="ml-2 bg-gradient-to-r from-indigo-500 to-purple-600">
              <Sparkles className="w-3 h-3 mr-1" />
              Nyptho
            </Badge>
          )}
        </div>
      </div>

      <ScrollArea className="flex-1 pr-4" viewportRef={scrollViewportRef}>
        <div className="flex flex-col space-y-3">
          {chatMessages.map((msg, i) => (
            <div
              key={i}
              className={`${
                msg.isUser
                  ? "ml-auto bg-primary text-primary-foreground"
                  : "mr-auto bg-muted"
              } rounded-lg p-3 max-w-[80%]`}
            >
              <p className="whitespace-pre-wrap break-words">{msg.text}</p>
            </div>
          ))}
          {isLoading && (
            <div className="mr-auto bg-muted rounded-lg p-3">
              <div className="flex space-x-1">
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></div>
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0.4s" }}></div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="mt-4">
        <div className="flex space-x-2">
          <Textarea
            placeholder="Type your message..."
            value={humanChatInput}
            onChange={(e) => onInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            className="resize-none min-h-[60px]"
            disabled={isLoading}
          />
          <Button onClick={onSendMessage} disabled={isLoading || !humanChatInput.trim()}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
        {aiPersona && (
          <div className="mt-2 text-xs text-muted-foreground flex items-center">
            <span className="mr-1">Using AI Persona:</span> 
            <span className="font-semibold">{aiPersona.name}</span>
            {useNyptho && <Sparkles className="w-3 h-3 ml-1 text-purple-400" />}
          </div>
        )}
      </div>
    </div>
  );
};
