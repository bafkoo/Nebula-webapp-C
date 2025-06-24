export interface ChatDto {
  id: string;
  name: string;
  description?: string;
  type: string;
  createdBy: string;
  createdAt: string;
  maxParticipants?: number;
  // Дополнительные поля для UI
  participantsCount?: number;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount?: number;
  isOnline?: boolean;
} 