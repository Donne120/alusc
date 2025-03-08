
export interface Message {
  id: string;
  text: string;
  isAi: boolean;
  timestamp: number;
  attachments?: Array<{
    type: 'image' | 'file';
    url: string;
    name: string;
  }>;
  model?: string; // Optional model field to track which AI model generated the response
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  timestamp: number;
}
