import { Button } from "@/components/ui/button";
import { Conversation } from "@/types/chat";
import { Settings, Trash2, User, X } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

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
  const navigate = useNavigate();
  const { user } = useAuth();
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

  const getConversationTitle = (conversation: Conversation) => {
    if (conversation.messages.length <= 1) return "New Chat";
    const firstUserMessage = conversation.messages.find(msg => !msg.isAi);
    if (!firstUserMessage) return "New Chat";
    return firstUserMessage.text.slice(0, 30) + (firstUserMessage.text.length > 30 ? '...' : '');
  };

  const handleDeleteConversation = (convId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    
    // Filter out the conversation to be deleted
    const remainingConversations = conversations.filter(conv => conv.id !== convId);
    
    // If we're deleting the current conversation
    if (convId === currentConversationId) {
      if (remainingConversations.length > 0) {
        // Select the first remaining conversation
        onSelectConversation(remainingConversations[0].id);
      } else {
        // If no conversations remain, create a new one
        onNewChat();
      }
    }
    
    // Update localStorage to persist the deletion
    localStorage.setItem('alu_chat_conversations', JSON.stringify(remainingConversations));
    
    toast.success("Conversation deleted");
  };

  return (
    <div className="fixed left-0 top-0 h-full w-64 bg-[#202123] p-2 border-r border-gray-700 flex flex-col z-50">
      <div className="flex-1 overflow-y-auto mb-2">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold text-white">
            {currentConversation ? getConversationTitle(currentConversation) : 'New Chat'}
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
            <div
              key={conv.id}
              className="group relative"
            >
              <button
                onClick={() => onSelectConversation(conv.id)}
                className={`w-full p-3 rounded-lg text-left truncate hover:bg-[#40414f] ${
                  conv.id === currentConversationId ? 'bg-[#40414f]' : ''
                }`}
              >
                {getConversationTitle(conv)}
              </button>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => handleDeleteConversation(conv.id, e)}
                className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 hover:bg-[#40414f]"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-auto border-t border-gray-700 pt-2 sticky bottom-0 bg-[#202123]">
        <button
          onClick={() => navigate('/profile')}
          className="w-full p-3 text-left hover:bg-[#40414f] rounded-lg flex items-center gap-2 text-gray-300"
        >
          <User className="h-4 w-4" />
          <span>{user?.name || 'Profile'}</span>
        </button>
        <button
          onClick={() => navigate('/settings')}
          className="w-full p-3 text-left hover:bg-[#40414f] rounded-lg flex items-center gap-2 text-gray-300"
        >
          <Settings className="h-4 w-4" />
          <span>Settings</span>
        </button>
      </div>
    </div>
  );
};