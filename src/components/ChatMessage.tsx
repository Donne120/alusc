import { useState } from "react";
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check, Edit, Camera, Brain } from "lucide-react";
import { toast } from "sonner";
import html2canvas from "html2canvas";
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import { ChatCard } from "./ui/chat-card";
import { cn } from "@/lib/utils";

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

interface CodeProps {
  node?: any;
  inline?: boolean;
  className?: string;
  children: any;
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
  const timestamp = new Date().toLocaleString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  });

  const cardData = tryParseCard(message);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
      toast.success("Message copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy message");
    }
  };

  const handleEdit = () => {
    if (isEditing) {
      onEdit?.(editedMessage);
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  };

  const handleScreenshot = async () => {
    try {
      const messageElement = document.getElementById(`message-${message.slice(0, 10)}`);
      if (messageElement) {
        const canvas = await html2canvas(messageElement);
        const dataUrl = canvas.toDataURL('image/png');
        
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = 'chat-screenshot.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        toast.success("Screenshot saved");
      }
    } catch (err) {
      toast.error("Failed to take screenshot");
    }
  };

  return (
    <div
      className={cn(
        "py-6 px-4 md:px-8 w-full animate-message-fade-in relative backdrop-blur-sm",
        isAi ? "bg-[#1A1F2C]/50" : "bg-[#1A1F2C]/30"
      )}
      id={`message-${message.slice(0, 10)}`}
    >
      <div className="max-w-3xl mx-auto flex gap-4">
        {isAi ? (
          <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 bg-gradient-to-tr from-[#9b87f5] to-[#8B5CF6] p-0.5">
            <div className="bg-[#1A1F2C] w-full h-full rounded-xl p-2">
              <Brain className="w-full h-full text-white" />
            </div>
          </div>
        ) : (
          <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-[#D946EF] to-[#8B5CF6] flex items-center justify-center flex-shrink-0 p-0.5">
            <div className="bg-[#1A1F2C] w-full h-full rounded-xl flex items-center justify-center">
              <span className="text-white font-medium">U</span>
            </div>
          </div>
        )}
        <div className="flex-1 space-y-2">
          <div className={cn(
            "p-4 rounded-xl max-w-[85%] text-white shadow-lg",
            isAi ? 
              "bg-gradient-to-br from-[#2A2F3C] to-[#1A1F2C] border border-[#9b87f5]/10" : 
              "bg-gradient-to-br from-[#D946EF] to-[#8B5CF6]"
          )}>
            {isEditing ? (
              <textarea
                value={editedMessage}
                onChange={(e) => setEditedMessage(e.target.value)}
                className="w-full bg-[#1A1F2C] text-white rounded-lg p-3 min-h-[100px] border border-[#9b87f5]/20"
              />
            ) : cardData ? (
              <ChatCard {...cardData} />
            ) : (
              <ReactMarkdown
                remarkPlugins={[remarkMath, remarkGfm]}
                rehypePlugins={[rehypeKatex]}
                components={{
                  code: ({ node, inline, className, children, ...props }: CodeProps) => {
                    const match = /language-(\w+)/.exec(className || '');
                    return !inline && match ? (
                      <div className="relative group my-4">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-[#9b87f5] to-[#D946EF] rounded-lg blur opacity-20"></div>
                        <SyntaxHighlighter
                          style={atomDark}
                          language={match[1]}
                          PreTag="div"
                          customStyle={{ 
                            margin: 0,
                            background: '#1A1F2C',
                            borderRadius: '0.5rem',
                          }}
                        >
                          {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                        <button
                          onClick={handleCopy}
                          className="absolute top-2 right-2 p-2 rounded-lg bg-[#2A2F3C] opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </button>
                      </div>
                    ) : (
                      <code {...props} className={cn(
                        className,
                        "bg-[#2A2F3C] px-1.5 py-0.5 rounded-md"
                      )}>
                        {children}
                      </code>
                    );
                  },
                }}
              >
                {message}
              </ReactMarkdown>
            )}
          </div>
          <div className="text-xs text-gray-400 ml-1 flex items-center gap-2">
            <span>{timestamp}</span>
            <div className="h-1 w-1 rounded-full bg-gray-500"></div>
            <span>{isAi ? 'AI Assistant' : 'You'}</span>
          </div>
        </div>
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {!isAi && (
            <button
              onClick={handleEdit}
              className="p-2 rounded-lg hover:bg-[#2A2F3C] text-gray-400 hover:text-white transition-colors"
            >
              {isEditing ? <Check className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
            </button>
          )}
          <button
            onClick={handleScreenshot}
            className="p-2 rounded-lg hover:bg-[#2A2F3C] text-gray-400 hover:text-white transition-colors"
          >
            <Camera className="h-4 w-4" />
          </button>
          <button
            onClick={handleCopy}
            className="p-2 rounded-lg hover:bg-[#2A2F3C] text-gray-400 hover:text-white transition-colors"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          </button>
        </div>
      </div>
      {attachments.length > 0 && (
        <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
          {attachments.map((attachment, index) => (
            attachment.type === 'image' ? (
              <div key={index} className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-[#9b87f5] to-[#D946EF] rounded-lg blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
                <img
                  src={attachment.url}
                  alt={attachment.name}
                  className="relative rounded-lg max-h-64 object-cover w-full border border-[#9b87f5]/10"
                />
              </div>
            ) : (
              <a
                key={index}
                href={attachment.url}
                download={attachment.name}
                className="relative group"
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-[#9b87f5] to-[#D946EF] rounded-lg blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
                <div className="relative flex items-center gap-2 p-3 rounded-lg bg-[#2A2F3C] hover:bg-[#343B4C] transition-colors border border-[#9b87f5]/10">
                  📎 {attachment.name}
                </div>
              </a>
            )
          ))}
        </div>
      )}
    </div>
  );
};
