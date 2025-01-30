import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import { Check, Copy } from 'lucide-react';
import 'katex/dist/katex.min.css';

interface CodeProps {
  node?: any;
  inline?: boolean;
  className?: string;
  children: any;
}

interface MarkdownRendererProps {
  content: string;
  onCopy: () => void;
  copied: boolean;
}

export const MarkdownRenderer = ({ content, onCopy, copied }: MarkdownRendererProps) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkMath, remarkGfm]}
      rehypePlugins={[rehypeKatex]}
      components={{
        code: ({ node, inline, className, children, ...props }: CodeProps) => {
          const match = /language-(\w+)/.exec(className || '');
          return !inline && match ? (
            <div className="relative group my-4">
              <div className="absolute top-2 right-2 text-xs text-gray-400">
                {match[1]}
              </div>
              <SyntaxHighlighter
                style={atomDark}
                language={match[1]}
                PreTag="div"
                customStyle={{ 
                  margin: 0,
                  borderRadius: '0.5rem',
                  padding: '2.5rem 1rem 1rem 1rem'
                }}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
              <button
                onClick={onCopy}
                className="absolute top-2 right-2 p-2 rounded bg-gray-800 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>
          ) : (
            <code {...props} className="bg-gray-800 px-1.5 py-0.5 rounded text-sm">
              {children}
            </code>
          );
        },
        h1: ({ children }) => (
          <h1 className="text-2xl font-bold mb-4">{children}</h1>
        ),
        h2: ({ children }) => (
          <h2 className="text-xl font-bold mb-3">{children}</h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-lg font-bold mb-2">{children}</h3>
        ),
        ul: ({ children }) => (
          <ul className="list-disc pl-6 mb-4 space-y-2">{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className="list-decimal pl-6 mb-4 space-y-2">{children}</ol>
        ),
        li: ({ children }) => (
          <li className="mb-1">{children}</li>
        ),
        p: ({ children }) => (
          <p className="mb-4 leading-relaxed">{children}</p>
        ),
        a: ({ href, children }) => (
          <a 
            href={href} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 underline"
          >
            {children}
          </a>
        ),
        blockquote: ({ children }) => (
          <blockquote className="border-l-4 border-gray-500 pl-4 italic my-4">
            {children}
          </blockquote>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
};