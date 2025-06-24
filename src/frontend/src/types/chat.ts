export type MessageType = 'Text' | 'Image' | 'File' | 'System' | 'Voice' | 'Video';

export interface MessageDto {
  id: string;
  chatId: string;
  userId: string;
  userName: string;
  avatarUrl?: string;
  content: string;
  type: MessageType;
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  mimeType?: string;
  createdAt: string;
  updatedAt?: string;
  // Поля для оптимистичного UI
  tempId?: string;
  isSending?: boolean;
  hasError?: boolean;
}

export interface SendMessageRequest {
  chatId: string;
  content: string;
  type: MessageType;
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  mimeType?: string;
}

export interface ChatDto {
  [x: string]: number;
  avatarUrl: string | undefined;
  id: string;
  name: string;
  description?: string;
  type: string;
  createdBy: string;
  createdAt: string;
  maxParticipants?: number;
  // Дополнительные поля для UI
  participantsCount?: number;
  lastMessage?: MessageDto;
  lastMessageTime?: string;
  unreadCount?: number;
  isOnline?: boolean;
}

export type ChatType = 'private' | 'group' | 'channel';

export interface CreateChatRequest {
  name: string;
  description?: string;
  type: ChatType;
  participantIds: string[];
  isPrivate?: boolean;
  maxParticipants?: number;
} 