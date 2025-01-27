import { Button } from "@/components/ui/button";
import { Conversation } from "@/types/chat";

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
  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-[#202123] p-2 overflow-y-auto border-r border-gray-700">
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
  );
};