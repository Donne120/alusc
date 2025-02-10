
export interface Message {
  id: string;
  text: string;
  isAi: boolean;
  timestamp?: number;
  attachments?: Array<{
    type: 'image' | 'file';  // Simplified attachment types
    url: string;
    name: string;
    size?: number;
  }>;
}

export interface Conversation {
  id: string;
  messages: Message[];
  title?: string;
  timestamp?: number;
}
