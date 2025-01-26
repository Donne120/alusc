import { cn } from "@/lib/utils";
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check, Edit, Camera } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import html2canvas from "html2canvas";
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';

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

export const ChatMessage = ({ message, isAi = false, attachments = [], onEdit }: ChatMessageProps) => {
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedMessage, setEditedMessage] = useState(message);

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
              ) : (
                <ReactMarkdown
                  remarkPlugins={[remarkMath, remarkGfm]}
                  rehypePlugins={[rehypeKatex]}
                  components={{
                    code({ node, inline, className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || '');
                      return !inline && match ? (
                        <div className="relative group">
                          <SyntaxHighlighter
                            {...props}
                            style={atomDark}
                            language={match[1]}
                            PreTag="div"
                            customStyle={{ margin: 0 }}
                          >
                            {String(children).replace(/\n$/, '')}
                          </SyntaxHighlighter>
                          <button
                            onClick={handleCopy}
                            className="absolute top-2 right-2 p-2 rounded bg-gray-800 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                          </button>
                        </div>
                      ) : (
                        <code className={className} {...props}>
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
            <div className="flex gap-2">
              {!isAi && (
                <button
                  onClick={handleEdit}
                  className="p-2 rounded hover:bg-gray-700 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  {isEditing ? <Check className="h-4 w-4" /> : <Edit className="h-4 w-4" />}
                </button>
              )}
              <button
                onClick={handleScreenshot}
                className="p-2 rounded hover:bg-gray-700 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Camera className="h-4 w-4" />
              </button>
              <button
                onClick={handleCopy}
                className="p-2 rounded hover:bg-gray-700 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
          </div>
          {attachments.length > 0 && (
            <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
              {attachments.map((attachment, index) => (
                attachment.type === 'image' ? (
                  <img
                    key={index}
                    src={attachment.url}
                    alt={attachment.name}
                    className="rounded-lg max-h-64 object-cover w-full"
                  />
                ) : (
                  <a
                    key={index}
                    href={attachment.url}
                    download={attachment.name}
                    className="flex items-center gap-2 p-3 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
                  >
                    📎 {attachment.name}
                  </a>
                )
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
