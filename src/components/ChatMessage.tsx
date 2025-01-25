import { cn } from "@/lib/utils";

interface ChatMessageProps {
  message: string;
  isAi?: boolean;
}

export const ChatMessage = ({ message, isAi = false }: ChatMessageProps) => {
  return (
    <div
      className={cn(
        "py-8 px-4 md:px-8 w-full animate-message-fade-in",
        isAi ? "bg-aibg" : "bg-chatbg"
      )}
    >
      <div className="max-w-3xl mx-auto flex gap-4 md:gap-6">
        <div
          className={cn(
            "w-8 h-8 rounded flex items-center justify-center text-white",
            isAi ? "bg-green-600" : "bg-blue-600"
          )}
        >
          {isAi ? "AI" : "U"}
        </div>
        <div className="flex-1 text-gray-100 whitespace-pre-wrap">{message}</div>
      </div>
    </div>
  );
};