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
    <div className="min-h-screen bg-[#343541] font-inter text-white">
      <ConversationSidebar
        conversations={conversations}
        currentConversationId={currentConversationId}
        onNewChat={createNewConversation}
        onSelectConversation={setCurrentConversationId}
        onDeleteConversation={handleDeleteConversation}
      />
      <div className="pl-64">
        <div className="pb-32">
          <ChatMessages
            messages={currentConversation.messages}
            isLoading={isLoading}
            onEditMessage={handleEditMessage}
          />
        </div>
        <ChatInput onSend={handleSendMessage} disabled={isLoading} />
      </div>
    </div>
  );
};