// Типы для аутентификации
export interface User {
  id: string;
  username: string;
  email: string;
  isEmailVerified: boolean;
  // Дополнительные поля для приложения
  avatar?: string;
  isOnline?: boolean;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  pendingVerificationEmail: string | null;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  pendingVerificationEmail: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: { username: string; email: string; password: string }) => Promise<void>;
  logout: () => void;
  verifyEmail: (code: string) => Promise<void>;
  resendVerificationCode: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (token: string, newPassword: string) => Promise<void>;
  googleAuth: (idToken: string) => Promise<void>;
  gitHubAuth: (accessToken: string) => Promise<void>;
} 