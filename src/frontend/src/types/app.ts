// Основные типы для приложения Nebula Chat

export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  status: UserStatus;
  isOnline: boolean;
  lastSeen?: Date;
}

export type UserStatus = 'online' | 'away' | 'busy' | 'offline';

export interface AppState {
  currentUser: User | null;
  isLoading: boolean;
  sidebarCollapsed: boolean;
}

export interface NavigationItem {
  id: string;
  label: string;
  icon: string;
  path: string;
  active?: boolean;
  badge?: number;
}

export interface QuickAction {
  id: string;
  label: string;
  icon: string;
  action: () => void;
  disabled?: boolean;
}

// Навигация приложения
export type ActiveTab = 'dashboard' | 'chat'; 