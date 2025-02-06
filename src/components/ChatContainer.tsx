import { ChatInput } from "./ChatInput";
import { ConversationSidebar } from "./chat/ConversationSidebar";
import { ChatMessages } from "./chat/ChatMessages";
import { useChatState } from "./chat/ChatState";
import { useChatActions } from "./chat/ChatActions";

export const ChatContainer = () => {
  const {
    conversations,
    setConversations,
    currentConversationId,
    setCurrentConversationId,
    isLoading,
    setIsLoading
  } = useChatState();

  const {
    getCurrentConversation,
    createNewConversation,
    handleDeleteConversation,
    handleSendMessage,
    handleEditMessage
  } = useChatActions({
    conversations,
    setConversations,
    currentConversationId,
    setCurrentConversationId,
    setIsLoading
  });

  const currentConversation = getCurrentConversation();

  return (
    <div className="fixed inset-0 bg-[#1A1F2C] font-inter text-white">
      <div className="absolute inset-0 bg-gradient-to-br from-[#1A1F2C] via-[#221F26] to-[#1A1F2C] opacity-80" />
      <div className="relative z-10 h-full flex">
        <ConversationSidebar
          conversations={conversations}
          currentConversationId={currentConversationId}
          onNewChat={createNewConversation}
          onSelectConversation={setCurrentConversationId}
          onDeleteConversation={handleDeleteConversation}
        />
        <div className="flex-1 pl-64 h-full flex flex-col bg-[#1A1F2C]">
          <div className="flex-1 overflow-y-auto pb-32 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
            <div className="max-w-4xl mx-auto">
              <ChatMessages
                messages={currentConversation.messages}
                isLoading={isLoading}
                onEditMessage={handleEditMessage}
              />
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#1A1F2C] to-transparent pointer-events-none" />
            <div className="relative max-w-4xl mx-auto">
              <ChatInput onSend={handleSendMessage} disabled={isLoading} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};