
import { MiniChatbot } from "./MiniChatbot";
import { MiniChatbotContentUpdated } from "./MiniChatbotContentUpdated";

// Create a unified component that combines both
const UpdatedMiniChatbot = () => {
  return (
    <MiniChatbot>
      <MiniChatbotContentUpdated />
    </MiniChatbot>
  );
};

export { UpdatedMiniChatbot as MiniChatbot };
