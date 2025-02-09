
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
      <div className="h-screen flex flex-col items-center justify-center text-gray-400 px-4">
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
    <div className="flex flex-col-reverse divide-y divide-y-reverse divide-gray-700">
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
  );
};
