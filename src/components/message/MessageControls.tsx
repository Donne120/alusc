import { Copy, Check, Edit, Camera } from "lucide-react";
import { toast } from "sonner";
import html2canvas from "html2canvas";

interface MessageControlsProps {
  message: string;
  isEditing: boolean;
  onEdit: () => void;
  isAi?: boolean;
}

export const MessageControls = ({ message, isEditing, onEdit, isAi }: MessageControlsProps) => {
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
    <div className="flex gap-2">
      {!isAi && (
        <button
          onClick={onEdit}
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
  );
};