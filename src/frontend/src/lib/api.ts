import type { MessageDto, CreateChatRequest, ChatDto } from '../types/chat';

// API типы
export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface VerifyEmailRequest {
  code: string;
}

export interface GoogleAuthRequest {
  idToken: string;
}

export interface GitHubAuthRequest {
  accessToken: string;
}

export interface UserDto {
  id: string;
  username: string;
  email: string;
  isEmailVerified: boolean;
  createdAt: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: UserDto;
  token?: string;
}

export interface ApiResponse {
  success: boolean;
  message: string;
}

// Утилиты для работы с токенами
export class TokenManager {
  private static readonly TOKEN_KEY = 'nebula_token';
  private static readonly USER_KEY = 'nebula_user';

  static setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  static getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  static removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  static setUser(user: UserDto): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }

  static getUser(): UserDto | null {
    const userStr = localStorage.getItem(this.USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  }

  static isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  }

  static isAuthenticated(): boolean {
    const token = this.getToken();
    return token !== null && !this.isTokenExpired(token);
  }
}

// API клиент
// Добавляем префикс `/api`, чтобы все запросы шли на правильный маршрут
const API_BASE_URL = 'http://localhost:5001/api';

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    // Автоматически добавляем JWT токен к запросам
    const token = TokenManager.getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...options.headers as Record<string, string>,
    };

    if (token && TokenManager.isAuthenticated()) {
      headers.Authorization = `Bearer ${token}`;
    }

    const config: RequestInit = {
      headers,
      ...options,
    };

    const response = await fetch(url, config);
    
    // Если токен истек, очищаем локальное хранилище
    if (response.status === 401) {
      TokenManager.removeToken();
      // Можно добавить редирект на страницу логина
      window.location.href = '/auth/login';
      return Promise.reject(new Error('Сессия истекла'));
    }
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Network error' }));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    // Автоматически сохраняем токен и пользователя при успешной регистрации
    if (response.success && response.token && response.user) {
      TokenManager.setToken(response.token);
      TokenManager.setUser(response.user);
    }

    return response;
  }

  async login(data: LoginRequest): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    // Автоматически сохраняем токен и пользователя при успешном логине
    if (response.success && response.token && response.user) {
      TokenManager.setToken(response.token);
      TokenManager.setUser(response.user);
    }

    return response;
  }

  async logout(): Promise<void> {
    TokenManager.removeToken();
    // В будущем можно добавить вызов API для инвалидации токена на сервере
  }

  async forgotPassword(data: ForgotPasswordRequest): Promise<ApiResponse> {
    return this.request<ApiResponse>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async resetPassword(data: ResetPasswordRequest): Promise<ApiResponse> {
    return this.request<ApiResponse>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async verifyEmail(data: VerifyEmailRequest): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/verify-email', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    // Автоматически обновляем токен и пользователя при успешной верификации
    if (response.success && response.token && response.user) {
      TokenManager.setToken(response.token);
      TokenManager.setUser(response.user);
    }

    return response;
  }

  async resendVerificationCode(): Promise<ApiResponse> {
    return this.request<ApiResponse>('/auth/resend-verification', {
      method: 'POST',
    });
  }

  async googleAuth(data: GoogleAuthRequest): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/google', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (response.success && response.token && response.user) {
      TokenManager.setToken(response.token);
      TokenManager.setUser(response.user);
    }

    return response;
  }

  async gitHubAuth(data: GitHubAuthRequest): Promise<AuthResponse> {
    const response = await this.request<AuthResponse>('/auth/github', {
      method: 'POST',
      body: JSON.stringify(data),
    });

    if (response.success && response.token && response.user) {
      TokenManager.setToken(response.token);
      TokenManager.setUser(response.user);
    }

    return response;
  }

  // Метод для получения профиля (будет полезен для защищенных эндпоинтов)
  async getProfile(): Promise<UserDto> {
    return this.request<UserDto>('/users/profile');
  }

  // --- Chat API ---

  async getChats(): Promise<ChatDto[]> {
    return this.request<ChatDto[]>('/chat');
  }

  async createChat(data: CreateChatRequest): Promise<ChatDto> {
    return this.request<ChatDto>(`/chat`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getMessages(chatId: string, page: number = 1, pageSize: number = 50): Promise<MessageDto[]> {
    return this.request<MessageDto[]>(`/chats/${chatId}/messages?page=${page}&pageSize=${pageSize}`);
  }

  // --- File API ---

  async uploadFile(file: File, chatId: string, content?: string): Promise<MessageDto> {
    const token = TokenManager.getToken();
    const headers: Record<string, string> = {};

    if (token && TokenManager.isAuthenticated()) {
      headers.Authorization = `Bearer ${token}`;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('chatId', chatId);
    if (content) {
      formData.append('content', content);
    }

    const response = await fetch(`${this.baseUrl}/files/upload`, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (response.status === 401) {
      TokenManager.removeToken();
      window.location.href = '/auth/login';
      return Promise.reject(new Error('Сессия истекла'));
    }
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Network error' }));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async getFileInfo(fileName: string): Promise<{
    fileName: string;
    size: number;
    mimeType: string;
    uploadDate: string;
    url: string;
  }> {
    return this.request(`/files/info/${fileName}`);
  }
}

const apiClient = new ApiClient(API_BASE_URL);

// `TokenManager` уже экспортируется через `export class`
export { apiClient };
export default apiClient;