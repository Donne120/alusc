import React, { useState } from "react";
import { Avatar } from "@/components/ui/avatar"
import { AvatarImage, AvatarFallback } from "@radix-ui/react-avatar"
import { Edit, Check, X, Paperclip } from "lucide-react";

interface ChatMessageProps {
  message: string;
  isAi: boolean;
  attachments?: Array<{
    type: 'image' | 'file';
    url: string;
    name: string;
  }>;
  onEdit?: (newText: string) => void;
  model?: string; // Add model prop to show which AI generated the response
}

export const ChatMessage = ({ 
  message, 
  isAi, 
  attachments = [], 
  onEdit,
  model
}: ChatMessageProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedMessage, setEditedMessage] = useState(message);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = () => {
    if (onEdit) {
      onEdit(editedMessage);
    }
    setIsEditing(false);
  };

  const handleCancelClick = () => {
    setEditedMessage(message);
    setIsEditing(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditedMessage(e.target.value);
  };

  return (
    <div className={`py-6 px-8 ${isAi ? 'bg-[#2A2F3C]' : 'bg-[#1A1F2C]'} text-gray-400`}>
      <div className="max-w-3xl mx-auto flex gap-4 items-start">
        <Avatar className="w-8 h-8">
          <AvatarImage src={isAi ? "/ai-logo.png" : "/user-logo.png"} />
          <AvatarFallback>{isAi ? "AI" : "U"}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm text-gray-500">
              {isAi ? `ALU AI Assistant ${model ? `(${model === 'gemini' ? 'Gemini' : 'DeepSeek'})` : ''}` : 'You'}
            </span>
            {!isAi && !isEditing && (
              <button onClick={handleEditClick} className="hover:text-gray-300 transition">
                <Edit className="w-4 h-4" />
              </button>
            )}
          </div>
          {isEditing ? (
            <div className="space-y-2">
              <textarea
                value={editedMessage}
                onChange={handleInputChange}
                className="w-full p-2 rounded bg-gray-700 text-white"
              />
              <div className="flex justify-end space-x-2">
                <button onClick={handleSaveClick} className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded transition">
                  <Check className="w-4 h-4 mr-2 inline-block" />Save
                </button>
                <button onClick={handleCancelClick} className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded transition">
                  <X className="w-4 h-4 mr-2 inline-block" />Cancel
                </button>
              </div>
            </div>
          ) : (
            <p className="text-sm whitespace-pre-line">{message}</p>
          )}
          {attachments.length > 0 && (
            <div className="mt-4">
              {attachments.map((attachment, index) => (
                <div key={index} className="flex items-center gap-2 text-gray-400">
                  <Paperclip className="h-4 w-4" />
                  <a href={attachment.url} download={attachment.name} className="text-blue-500 hover:underline">
                    {attachment.name}
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
