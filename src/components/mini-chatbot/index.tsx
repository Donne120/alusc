
import { MiniChatbot } from "./MiniChatbot";
import { MiniChatbotContentUpdated } from "./MiniChatbotContentUpdated";

// Re-export with the updated content
const UpdatedMiniChatbot = () => {
  return <MiniChatbot content={<MiniChatbotContentUpdated />} />;
};

export { UpdatedMiniChatbot as MiniChatbot };
