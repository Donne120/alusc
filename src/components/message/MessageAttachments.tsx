interface Attachment {
  type: 'image' | 'file';
  url: string;
  name: string;
}

interface MessageAttachmentsProps {
  attachments: Attachment[];
}

export const MessageAttachments = ({ attachments }: MessageAttachmentsProps) => {
  if (attachments.length === 0) return null;

  return (
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
  );
};