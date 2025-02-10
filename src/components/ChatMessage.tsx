import { cn } from "@/lib/utils";
import { useState } from "react";
import { MessageControls } from "./message/MessageControls";
import { MarkdownRenderer } from "./message/MarkdownRenderer";
import { MessageAttachments } from "./message/MessageAttachments";
import { ChatCard } from "./ui/chat-card";

interface ChatMessageProps {
  message: string;
  isAi?: boolean;
  attachments?: Array<{
    type: 'image' | 'file';
    url: string;
    name: string;
  }>;
  onEdit?: (newMessage: string) => void;
}

const tryParseCard = (text: string) => {
  if (!text.includes('Title:')) return null;
  
  try {
    const title = text.match(/Title:\s*([^\n]+)/)?.[1] || '';
    const subtitle = text.match(/Subtitle:\s*([^\n]+)/)?.[1];
    const description = text.match(/Description:\s*([^\n]+)/)?.[1] || '';
    
    const buttonsMatch = text.match(/Buttons:\n((?:- [^\n]+\n?)*)/);
    const buttons = buttonsMatch?.[1]
      .split('\n')
      .filter(line => line.startsWith('- '))
      .map(button => {
        const [icon, label, link] = button
          .replace('- ', '')
          .match(/([^\s]+)\s+([^(]+)\s*\(link:\s*([^)]+)\)/)
          ?.slice(1) || [];
        return { icon, label: label.trim(), link };
      }) || [];

    return { title, subtitle, description, buttons };
  } catch (error) {
    console.error('Error parsing card:', error);
    return null;
  }
};

export const ChatMessage = ({ message, isAi = false, attachments = [], onEdit }: ChatMessageProps) => {
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedMessage, setEditedMessage] = useState(message);

  const cardData = tryParseCard(message);

  const handleEdit = () => {
    if (isEditing) {
      onEdit?.(editedMessage);
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  };

  return (
    <div
      className={cn(
        "py-8 px-4 md:px-8 w-full animate-message-fade-in border-b border-gray-700 group",
        isAi ? "bg-[#444654]" : "bg-[#343541]"
      )}
      id={`message-${message.slice(0, 10)}`}
    >
      <div className="max-w-3xl mx-auto flex gap-4 md:gap-6">
        <div
          className={cn(
            "w-8 h-8 rounded flex items-center justify-center text-white shrink-0",
            isAi ? "bg-[#19c37d]" : "bg-[#9859f5]"
          )}
        >
          {isAi ? "SC" : "U"}
        </div>
        <div className="flex-1">
          {isAi && (
            <div className="mb-2">
              <img 
                src="/lovable-uploads/6a746a81-f095-4d25-8a43-e84122f6a4f9.png" 
                alt="SC Logo" 
                className="h-6 w-auto"
              />
            </div>
          )}
          <div className="flex justify-between items-start">
            <div className="flex-1 text-gray-100 prose prose-invert max-w-none">
              {isEditing ? (
                <textarea
                  value={editedMessage}
                  onChange={(e) => setEditedMessage(e.target.value)}
                  className="w-full bg-gray-700 text-white rounded p-2 min-h-[100px]"
                />
              ) : cardData ? (
                <ChatCard {...cardData} />
              ) : (
                <MarkdownRenderer 
                  content={message} 
                  onCopy={() => setCopied(true)} 
                  copied={copied} 
                />
              )}
            </div>
            <MessageControls
              message={message}
              isEditing={isEditing}
              onEdit={handleEdit}
              isAi={isAi}
            />
          </div>
          <MessageAttachments attachments={attachments} />
        </div>
      </div>
    </div>
  );
};