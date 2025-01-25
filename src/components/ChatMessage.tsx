import { cn } from "@/lib/utils";
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface ChatMessageProps {
  message: string;
  isAi?: boolean;
  attachments?: Array<{
    type: 'image' | 'file';
    url: string;
    name: string;
  }>;
}

export const ChatMessage = ({ message, isAi = false, attachments = [] }: ChatMessageProps) => {
  const [copied, setCopied] = useState(false);

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

  return (
    <div
      className={cn(
        "py-8 px-4 md:px-8 w-full animate-message-fade-in border-b border-gray-700 group",
        isAi ? "bg-[#444654]" : "bg-[#343541]"
      )}
    >
      <div className="max-w-3xl mx-auto flex gap-4 md:gap-6">
        <div
          className={cn(
            "w-8 h-8 rounded flex items-center justify-center text-white shrink-0",
            isAi ? "bg-[#19c37d]" : "bg-[#9859f5]"
          )}
        >
          {isAi ? "AI" : "U"}
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div className="flex-1 text-gray-100 prose prose-invert max-w-none">
              <ReactMarkdown
                components={{
                  code({ node, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || '');
                    return !match ? (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    ) : (
                      <div className="relative group">
                        <SyntaxHighlighter
                          {...props}
                          style={atomDark}
                          language={match[1]}
                          PreTag="div"
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
                    );
                  },
                }}
              >
                {message}
              </ReactMarkdown>
            </div>
            <button
              onClick={handleCopy}
              className="p-2 rounded hover:bg-gray-700 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </button>
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