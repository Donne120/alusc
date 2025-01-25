import { useState } from "react";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { toast } from "sonner";

export const ChatContainer = () => {
  const [messages, setMessages] = useState<Array<{ text: string; isAi: boolean }>>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async (message: string) => {
    setMessages((prev) => [...prev, { text: message, isAi: false }]);
    setIsLoading(true);

    try {
      // Here you would typically make an API call to your AI model
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const aiResponse = `Thank you for your message! Here's a sample response that demonstrates markdown and code formatting:

### Features Available:
- Markdown support
- Code highlighting
- Math equations
- Tables

\`\`\`python
def greet(name):
    return f"Hello, {name}!"

print(greet("User"))
\`\`\`

| Feature | Status |
|---------|--------|
| Markdown | ✅ |
| Code | ✅ |
| Math | ✅ |

You can use $E = mc^2$ inline math or display math:

$$
F = G\\frac{m_1m_2}{r^2}
$$`;
      
      setMessages((prev) => [...prev, { text: aiResponse, isAi: true }]);
    } catch (error) {
      toast.error("Failed to get response. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#343541] font-inter text-white pb-32">
      {messages.length === 0 ? (
        <div className="h-screen flex flex-col items-center justify-center text-gray-400 px-4">
          <h1 className="text-3xl font-bold mb-8">ChatGPT</h1>
          <div className="max-w-xl text-center space-y-4">
            <p className="text-lg">Welcome! How can I help you today?</p>
            <p className="text-sm">
              I can help you with writing, analysis, math, and coding. Feel free to ask any question!
            </p>
          </div>
        </div>
      ) : (
        <div className="divide-y divide-gray-700">
          {messages.map((message, index) => (
            <ChatMessage
              key={index}
              message={message.text}
              isAi={message.isAi}
            />
          ))}
          {isLoading && (
            <div className="py-4 px-8 text-gray-400 animate-pulse bg-[#444654] border-b border-gray-700">
              <div className="max-w-3xl mx-auto flex gap-4 md:gap-6">
                <div className="w-8 h-8 rounded bg-[#19c37d] flex items-center justify-center text-white shrink-0">
                  AI
                </div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-600 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-600 rounded w-1/2 mt-2"></div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      <ChatInput onSend={handleSendMessage} disabled={isLoading} />
    </div>
  );
};