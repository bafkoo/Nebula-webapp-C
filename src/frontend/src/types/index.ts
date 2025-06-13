// User types
export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  status: UserStatus;
  createdAt: Date;
}

export interface UserProfile {
  id: string;
  userId: string;
  displayName?: string;
  bio?: string;
  banner?: string;
}

export enum UserStatus {
  Online = 'online',
  Idle = 'idle',
  DoNotDisturb = 'dnd',
  Offline = 'offline'
}

// Server types
export interface Server {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  banner?: string;
  ownerId: string;
  memberCount: number;
  createdAt: Date;
}

export interface ServerMember {
  id: string;
  userId: string;
  serverId: string;
  nickname?: string;
  joinedAt: Date;
  roles: Role[];
}

// Channel types
export interface Channel {
  id: string;
  name: string;
  description?: string;
  type: ChannelType;
  serverId: string;
  categoryId?: string;
  position: number;
  createdAt: Date;
}

export enum ChannelType {
  Text = 'text',
  Voice = 'voice',
  Category = 'category'
}

export interface ChannelCategory {
  id: string;
  name: string;
  serverId: string;
  position: number;
  channels: Channel[];
}

// Message types
export interface Message {
  id: string;
  content: string;
  authorId: string;
  channelId: string;
  type: MessageType;
  attachments: MessageAttachment[];
  reactions: MessageReaction[];
  editedAt?: Date;
  createdAt: Date;
}

export enum MessageType {
  Default = 'default',
  System = 'system',
  UserJoin = 'userJoin',
  UserLeave = 'userLeave'
}

export interface MessageAttachment {
  id: string;
  messageId: string;
  filename: string;
  url: string;
  size: number;
  contentType: string;
}

export interface MessageReaction {
  id: string;
  messageId: string;
  emoji: string;
  userIds: string[];
  count: number;
}

// Role types
export interface Role {
  id: string;
  name: string;
  color: string;
  serverId: string;
  position: number;
  permissions: Permission[];
  createdAt: Date;
}

export interface Permission {
  id: string;
  name: string;
  value: number;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  totalCount: number;
  pageSize: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// Auth types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
}

// Real-time events
export interface ChatEvent {
  type: 'message' | 'user_typing' | 'user_status';
  channelId?: string;
  userId?: string;
  data: unknown;
}

// UI Component props
export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

// Store types
export interface AuthStore {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
}

export interface ServerStore {
  servers: Server[];
  currentServer: Server | null;
  fetchServers: () => Promise<void>;
  selectServer: (serverId: string) => void;
  createServer: (data: Partial<Server>) => Promise<Server>;
  joinServer: (inviteCode: string) => Promise<void>;
}

export interface ChannelStore {
  channels: Channel[];
  currentChannel: Channel | null;
  fetchChannels: (serverId: string) => Promise<void>;
  selectChannel: (channelId: string) => void;
  createChannel: (data: Partial<Channel>) => Promise<Channel>;
}

export interface MessageStore {
  messages: Record<string, Message[]>; // channelId -> messages
  fetchMessages: (channelId: string) => Promise<void>;
  sendMessage: (channelId: string, content: string) => Promise<void>;
  addMessage: (message: Message) => void;
} 