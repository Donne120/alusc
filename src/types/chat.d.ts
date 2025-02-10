
export interface Message {
  id: string;
  text: string;
  isAi: boolean;
  attachments?: Array<{
    type: 'image' | 'document' | 'file';
    url: string;
    name: string;
    size?: number;
  }>;
}

export interface Conversation {
  id: string;
  messages: Message[];
  title?: string;
}
