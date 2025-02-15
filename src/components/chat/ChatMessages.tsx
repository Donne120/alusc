
import { Message } from "@/types/chat";
import { ChatMessage } from "../ChatMessage";
import { Brain } from "lucide-react";

interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
  onEditMessage: (messageId: string, newText: string) => void;
}

export const ChatMessages = ({ messages, isLoading, onEditMessage }: ChatMessagesProps) => {
  if (messages.length === 0) {
    return (
      <div className="h-screen flex flex-col items-center justify-center text-gray-300 px-4 bg-gradient-to-b from-[#1A1F2C] to-[#2A2F3C]">
        <div className="flex items-center justify-center w-16 h-16 mb-8 rounded-2xl bg-gradient-to-tr from-[#9b87f5] to-[#8B5CF6]">
          <Brain className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-[#9b87f5] to-[#D946EF] text-transparent bg-clip-text">
          ALU Student Companion
        </h1>
        <div className="max-w-xl text-center space-y-4">
          <p className="text-lg text-gray-300">Welcome! How can I help you today?</p>
          <p className="text-sm text-gray-400">
            I remember our conversations and provide context-aware responses to better assist you.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-[#1A1F2C] to-[#2A2F3C] min-h-screen">
      {messages.map((message) => (
        <ChatMessage
          key={message.id}
          message={message.text}
          isAi={message.isAi}
          attachments={message.attachments}
          onEdit={(newText) => onEditMessage(message.id, newText)}
        />
      ))}
      {isLoading && (
        <div className="py-6 px-8 text-gray-400 animate-pulse">
          <div className="max-w-3xl mx-auto flex gap-4">
            <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 bg-gradient-to-tr from-[#9b87f5] to-[#8B5CF6] p-0.5">
              <div className="bg-[#1A1F2C] w-full h-full rounded-xl p-2">
                <Brain className="w-full h-full text-white" />
              </div>
            </div>
            <div className="flex-1">
              <div className="h-4 bg-[#2A2F3C] rounded-lg w-3/4 mb-2"></div>
              <div className="h-4 bg-[#2A2F3C] rounded-lg w-1/2"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
