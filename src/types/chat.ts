
export interface Message {
  id: string;
  text: string;
  isAi: boolean;
  timestamp: number;
}

export interface Conversation {
  id: string;
  title?: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}
