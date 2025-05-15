export interface Model {
  _id: string;
  name: string;
  description: string;
  apiEndpoint: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface Plugin {
  _id: string;
  name: string;
  description: string;
  version: string;
  enabled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface ChatSession {
  id: string;
  messages: ChatMessage[];
  selectedModel: Model;
  selectedPlugins: Plugin[];
  createdAt: string;
  updatedAt: string;
} 