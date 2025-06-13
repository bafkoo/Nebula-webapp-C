/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User, AuthState, AuthContextType } from './types';
import { apiClient, TokenManager } from '../lib/api';

// Контекст
const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    pendingVerificationEmail: null
  });

  // Проверяем JWT токен при загрузке
  useEffect(() => {
    const checkAuthState = () => {
      try {
        const isAuth = TokenManager.isAuthenticated();
        const user = TokenManager.getUser();
        
        if (isAuth && user) {
          setAuthState({
            user: {
              id: user.id,
              email: user.email,
              username: user.username,
              isEmailVerified: user.isEmailVerified
            },
            isAuthenticated: true,
            isLoading: false,
            pendingVerificationEmail: user.isEmailVerified ? null : user.email
          });
        } else {
          // Очищаем устаревшие токены
          TokenManager.removeToken();
          setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            pendingVerificationEmail: null
          });
        }
      } catch (error) {
        console.error('Error checking auth state:', error);
        TokenManager.removeToken();
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          pendingVerificationEmail: null
        });
      }
    };

    checkAuthState();
  }, []);

   
  const login = async (email: string, password: string) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));

      // API автоматически сохранит токен через TokenManager
      const response = await apiClient.login({ email, password });

      if (!response.success || !response.user) {
        throw new Error(response.message || 'Ошибка при входе');
      }

      const user: User = {
        id: response.user.id,
        email: response.user.email,
        username: response.user.username,
        isEmailVerified: response.user.isEmailVerified
      };

      setAuthState({
        user,
        isAuthenticated: true, // JWT автоматически валидируется
        isLoading: false,
        pendingVerificationEmail: user.isEmailVerified ? null : user.email
      });
    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const register = async (userData: { username: string; email: string; password: string }) => {
    console.log('Registration attempt:', userData);
    
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    try {
      // API автоматически сохранит токен через TokenManager
      const response = await apiClient.register(userData);
      
      if (!response.success || !response.user) {
        throw new Error(response.message || 'Ошибка при регистрации');
      }
      
      const user: User = {
        id: response.user.id,
        email: response.user.email,
        username: response.user.username,
        isEmailVerified: response.user.isEmailVerified
      };

      setAuthState({
        user,
        isAuthenticated: true, // После регистрации пользователь сразу авторизован
        isLoading: false,
        pendingVerificationEmail: user.isEmailVerified ? null : user.email
      });
      
    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const verifyEmail = async (code: string) => {
    console.log('Verifying code:', code);
    
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    try {
      // TODO: Добавить реальный API эндпоинт для верификации email
      // const response = await apiClient.verifyEmail({ code });
      
      // Временная симуляция - заменить на реальный API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Обновляем пользователя как верифицированного
      const currentUser = authState.user;
      if (currentUser) {
        const updatedUser: User = {
          ...currentUser,
          isEmailVerified: true
        };
        
        // Обновляем в TokenManager
        const userDto = {
          id: updatedUser.id,
          username: updatedUser.username,
          email: updatedUser.email,
          isEmailVerified: true,
          createdAt: new Date().toISOString()
        };
        TokenManager.setUser(userDto);
        
        setAuthState({
          user: updatedUser,
          isAuthenticated: true,
          isLoading: false,
          pendingVerificationEmail: null
        });
      }
      
    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    console.log('Reset password request for:', email);
    // TODO: Добавить реальный API вызов
    await new Promise(resolve => setTimeout(resolve, 1500));
  };

  const updatePassword = async (token: string, newPassword: string) => {
    console.log('Update password with token:', token, 'New password length:', newPassword.length);
    // TODO: Добавить реальный API вызов
    await new Promise(resolve => setTimeout(resolve, 1500));
  };

  const logout = () => {
    // Используем метод API клиента который очищает TokenManager
    apiClient.logout();
    
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      pendingVerificationEmail: null
    });
  };

  const value: AuthContextType = {
    user: authState.user,
    isAuthenticated: authState.isAuthenticated,
    isLoading: authState.isLoading,
    pendingVerificationEmail: authState.pendingVerificationEmail,
    login,
    register,
    logout,
    verifyEmail,
    resetPassword,
    updatePassword
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 