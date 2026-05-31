export type ChatMode = "ask" | "agent";
export type MessageRole = "user" | "assistant" | "tool";

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  toolCall?: { name: string; input: unknown };
  toolResult?: unknown;
  createdAt: Date;
}

export interface ChatState {
  messages: ChatMessage[];
  isStreaming: boolean;
  mode: ChatMode;
}
