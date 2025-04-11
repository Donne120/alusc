
import React, { useState, useRef } from 'react';
import { Button } from "./ui/button";
import { SendHorizontal, Paperclip } from 'lucide-react';

interface ChatInputProps {
  onSend: (message: string, files?: File[]) => void;
  disabled?: boolean;
}

export const ChatInput = ({ onSend, disabled = false }: ChatInputProps) => {
  const [message, setMessage] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if ((message.trim() || files.length > 0) && !disabled) {
      onSend(message, files.length > 0 ? files : undefined);
      setMessage('');
      setFiles([]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const fileArray = Array.from(e.target.files);
      setFiles(prev => [...prev, ...fileArray]);
    }
  };

  const handleFileButtonClick = () => {
    fileInputRef.current?.click();
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-[#1A1F2C] to-transparent pt-10 px-8 pb-6 z-10 pl-16 md:pl-64">
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
        {files.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-2">
            {files.map((file, index) => (
              <div key={index} className="flex items-center gap-1 bg-gray-700/30 rounded px-2 py-1">
                <span className="text-xs text-gray-300 truncate max-w-[150px]">
                  {file.name}
                </span>
                <button
                  type="button"
                  onClick={() => removeFile(index)}
                  className="text-gray-400 hover:text-white"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        )}
        
        <div className="relative flex items-start rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Send a message..."
            disabled={disabled}
            rows={1}
            className="min-h-[52px] w-full resize-none bg-transparent px-4 py-3.5 text-white focus:outline-none disabled:opacity-50"
            style={{ maxHeight: '200px', overflowY: 'auto' }}
          />
          
          <div className="absolute right-2 bottom-2 flex gap-2">
            <input
              type="file"
              multiple
              ref={fileInputRef}
              onChange={handleFileSelect}
              className="hidden"
            />
            <Button
              type="button"
              onClick={handleFileButtonClick}
              size="icon"
              variant="ghost"
              className="h-8 w-8 rounded-full bg-white/10 hover:bg-white/20 text-gray-300"
            >
              <Paperclip className="h-4 w-4" />
            </Button>
            <Button
              type="submit"
              size="icon"
              disabled={disabled || (!message.trim() && files.length === 0)}
              className="h-8 w-8 rounded-full bg-[#8B5CF6] hover:bg-[#7C3AED] disabled:opacity-50 disabled:hover:bg-[#8B5CF6]"
            >
              <SendHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};
