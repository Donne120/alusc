
import { useConversations } from "@/hooks/useConversations";
import { useChatMessageHandler } from "./chat/ChatMessageHandler";
import { ChatInput } from "./ChatInput";
import { ConversationSidebar } from "./chat/ConversationSidebar";
import { ChatMessages } from "./chat/ChatMessages";
import { NewsUpdate } from "./news/NewsUpdate";
import { Conversation } from "@/types/chat";

export const ChatContainer = () => {
  const {
    conversations,
    currentConversationId,
    setCurrentConversationId,
    getCurrentConversation,
    createNewConversation,
    handleDeleteConversation,
    addMessageToConversation,
    updateMessageInConversation
  } = useConversations();

  const currentConversation = getCurrentConversation();

  const updateConversationTitle = (convId: string, title: string) => {
    const conversation = conversations.find(c => c.id === convId);
    if (conversation) {
      const updatedConversation: Conversation = {
        ...conversation,
        title
      };
      conversations.map(c => c.id === convId ? updatedConversation : c);
    }
  };

  const {
    isLoading,
    handleSendMessage,
    handleEditMessage
  } = useChatMessageHandler({
    currentConversationId,
    messages: currentConversation.messages,
    onAddMessage: addMessageToConversation,
    onUpdateTitle: updateConversationTitle
  });

  const handleEditMessageWrapper = (messageId: string, newText: string) => {
    handleEditMessage(messageId, newText);
    updateMessageInConversation(currentConversationId, messageId, newText);
  };

  return (
    <div className="min-h-screen bg-[#1A1F2C] font-inter text-white flex">
      <ConversationSidebar
        conversations={conversations}
        currentConversationId={currentConversationId}
        onNewChat={createNewConversation}
        onSelectConversation={setCurrentConversationId}
        onDeleteConversation={handleDeleteConversation}
      />
      <div className="flex-1 pl-16 transition-all duration-300 md:pl-64 flex">
        <div className="flex-1 relative">
          <div className="pb-32">
            <ChatMessages
              messages={currentConversation.messages}
              isLoading={isLoading}
              onEditMessage={handleEditMessageWrapper}
            />
          </div>
          <ChatInput onSend={handleSendMessage} disabled={isLoading} />
        </div>
        <div className="hidden lg:block w-80 h-screen sticky top-0">
          <NewsUpdate />
        </div>
      </div>
    </div>
  );
};
