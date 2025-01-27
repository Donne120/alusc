import { Button } from "@/components/ui/button";
import { Conversation } from "@/types/chat";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

interface ConversationSidebarProps {
  conversations: Conversation[];
  currentConversationId: string;
  onNewChat: () => void;
  onSelectConversation: (id: string) => void;
}

export const ConversationSidebar = ({
  conversations,
  currentConversationId,
  onNewChat,
  onSelectConversation,
}: ConversationSidebarProps) => {
  const currentConversation = conversations.find(conv => conv.id === currentConversationId);
  
  const handleClearChat = () => {
    const conversation = conversations.find(conv => conv.id === currentConversationId);
    if (conversation) {
      conversation.messages = [{
        id: "welcome",
        text: `# Welcome to ALU Student Companion\n\nI'm here to help! I'll remember our conversation and provide relevant context-aware responses. Feel free to ask any questions!`,
        isAi: true,
        timestamp: Date.now()
      }];
      toast.success("Chat cleared successfully");
    }
  };

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-[#202123] p-2 overflow-y-auto border-r border-gray-700">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold text-white">
            {currentConversation?.title || 'New Chat'}
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClearChat}
            className="hover:bg-[#40414f]"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
        <button
          onClick={onNewChat}
          className="w-full p-3 mb-2 bg-[#40414f] hover:bg-[#4f505f] rounded-lg text-left flex items-center gap-2"
        >
          <span>+ New Chat</span>
        </button>
        <div className="space-y-2">
          {conversations.map(conv => (
            <button
              key={conv.id}
              onClick={() => onSelectConversation(conv.id)}
              className={`w-full p-3 rounded-lg text-left truncate hover:bg-[#40414f] ${
                conv.id === currentConversationId ? 'bg-[#40414f]' : ''
              }`}
            >
              {conv.title || 'New Chat'}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};