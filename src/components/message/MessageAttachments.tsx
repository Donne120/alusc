
import { FileText } from "lucide-react";

interface Attachment {
  type: 'image' | 'file';
  url: string;
  name: string;
  size?: number;
}

interface MessageAttachmentsProps {
  attachments?: Attachment[];
}

export const MessageAttachments = ({ attachments }: MessageAttachmentsProps) => {
  if (!attachments || attachments.length === 0) return null;

  const formatFileSize = (bytes: number = 0) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
      {attachments.map((attachment, index) => {
        if (!attachment) return null;
        
        // Early return if attachment is invalid
        if (!attachment.type || !attachment.url || !attachment.name) {
          console.warn('Invalid attachment:', attachment);
          return null;
        }

        if (attachment.type === 'image') {
          return (
            <img
              key={index}
              src={attachment.url}
              alt={attachment.name}
              className="rounded-lg max-h-64 object-cover w-full"
            />
          );
        }

        return (
          <a
            key={index}
            href={attachment.url}
            download={attachment.name}
            className="flex items-center gap-2 p-3 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
          >
            <FileText className="h-5 w-5 text-blue-400" />
            <div className="flex flex-col">
              <span className="text-sm truncate max-w-[150px]">{attachment.name}</span>
              {attachment.size && (
                <span className="text-xs text-gray-400">{formatFileSize(attachment.size)}</span>
              )}
            </div>
          </a>
        );
      })}
    </div>
  );
};
