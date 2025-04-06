
import { cn } from "@/lib/utils";
import { Conversation } from "@/types/chat";
import { Plus, Search, Trash2, MessageSquare, Settings, LogOut } from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";

interface ConversationSidebarProps {
  conversations: Conversation[];
  currentConversationId: string;
  onNewChat: () => void;
  onSelectConversation: (id: string) => void;
  onDeleteConversation: (id: string) => void;
}

export const ConversationSidebar = ({
  conversations,
  currentConversationId,
  onNewChat,
  onSelectConversation,
  onDeleteConversation,
}: ConversationSidebarProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
  };

  const filteredConversations = conversations.filter(conv => 
    conv.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    !searchQuery
  );

  return (
    <div className="fixed top-0 left-0 h-screen w-16 md:w-64 bg-[#121621] border-r border-[#2A2F3C] flex flex-col z-10">
      <div className="p-4">
        <Button 
          onClick={onNewChat}
          className="w-full bg-gradient-to-r from-[#9b87f5] to-[#D946EF] hover:opacity-90 flex justify-center md:justify-start gap-2 p-2.5"
          variant="default"
        >
          <Plus className="h-5 w-5" />
          <span className="hidden md:inline">New Chat</span>
        </Button>
      </div>

      <div className="relative mx-4 mb-2">
        <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
        <input
          type="text"
          placeholder="Search conversations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 pr-3 py-2 bg-[#1a1f2c] border border-[#2A2F3C] rounded-md w-full focus:outline-none focus:ring-1 focus:ring-[#9b87f5] text-gray-300 text-sm"
        />
      </div>

      <div className="flex-1 overflow-auto p-2">
        {filteredConversations.length > 0 ? (
          filteredConversations.map((conversation) => (
            <div
              key={conversation.id}
              onClick={() => onSelectConversation(conversation.id)}
              className={cn(
                "flex items-center justify-between p-3 rounded-lg mb-1 cursor-pointer group transition-all",
                conversation.id === currentConversationId
                  ? "bg-[#2A2F3C] text-white"
                  : "hover:bg-[#1a1f2c] text-gray-300"
              )}
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <MessageSquare className="h-5 w-5 flex-shrink-0" />
                <div className="truncate">
                  {conversation.title || "New Conversation"}
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteConversation(conversation.id);
                }}
                className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 p-1 rounded-md hover:bg-[#343B4C] transition-all"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))
        ) : (
          <div className="text-gray-400 text-center py-4 px-2">
            {searchQuery ? "No conversations match your search." : "No conversations yet. Start a new chat!"}
          </div>
        )}
      </div>
      
      <div className="p-4 border-t border-[#2A2F3C] space-y-2">
        <div className="flex items-center gap-3 px-1 py-2 text-gray-300">
          <div className="h-8 w-8 rounded-full bg-gradient-to-r from-[#9b87f5] to-[#D946EF] flex items-center justify-center text-white font-medium">
            {user?.name?.charAt(0) || 'U'}
          </div>
          <div className="hidden md:block truncate">
            <div className="text-sm font-medium">{user?.name || 'User'}</div>
            <div className="text-xs text-gray-400 truncate">{user?.email || 'user@example.com'}</div>
          </div>
        </div>
        
        <div className="flex justify-around">
          <Link to="/settings">
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-gray-200" title="Settings">
              <Settings className="h-5 w-5" />
            </Button>
          </Link>
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-gray-400 hover:text-red-500" 
            onClick={handleLogout}
            title="Log out"
          >
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};
