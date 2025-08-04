export interface Conversation {
  id: string;
  name: string;
  description?: string;
  context: string;
  creationDate: Date;
  messageCount: number;
  lastActive: Date;
}

export interface CreateConversationFormData {
  name: string;
  description: string;
  context: string;
}
