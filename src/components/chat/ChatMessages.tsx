
import { Message } from "@/types/chat";
import { ChatMessage } from "../ChatMessage";

interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
  onEditMessage: (messageId: string, newText: string) => void;
}

export const ChatMessages = ({ messages, isLoading, onEditMessage }: ChatMessagesProps) => {
  if (messages.length === 0) {
    return (
      <div className="h-screen flex flex-col items-center justify-center text-gray-400 px-4 bg-[#1A1F2C]">
        <h1 className="text-3xl font-bold mb-8">ALU Student Companion</h1>
        <div className="max-w-xl text-center space-y-4">
          <p className="text-lg">Welcome! How can I help you today?</p>
          <p className="text-sm">
            I remember our conversations and provide context-aware responses to better assist you.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#1A1F2C] min-h-screen">
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
        <div className="py-6 px-8 text-gray-400 animate-pulse bg-[#1A1F2C]">
          <div className="max-w-3xl mx-auto flex gap-4">
            <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
              <img 
                src="/lovable-uploads/6a746a81-f095-4d25-8a43-e84122f6a4f9.png" 
                alt="ALU Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <div className="h-4 bg-[#2A2F3C] rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-[#2A2F3C] rounded w-1/2"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
