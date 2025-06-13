/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User, AuthState, AuthContextType } from './types';
import { apiClient } from '../lib/api';

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

  // Проверяем сохраненное состояние при загрузке
  useEffect(() => {
    const checkAuthState = () => {
      try {
        const savedUser = localStorage.getItem('user');
        const savedToken = localStorage.getItem('accessToken');
        const pendingEmail = localStorage.getItem('pendingVerificationEmail');

        if (savedUser && savedToken) {
          const user = JSON.parse(savedUser);
          setAuthState({
            user,
            isAuthenticated: user.isEmailVerified,
            isLoading: false,
            pendingVerificationEmail: user.isEmailVerified ? null : user.email
          });
        } else if (pendingEmail) {
          setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            pendingVerificationEmail: pendingEmail
          });
        } else {
          setAuthState(prev => ({
            ...prev,
            isLoading: false
          }));
        }
      } catch (error) {
        console.error('Error checking auth state:', error);
        setAuthState(prev => ({
          ...prev,
          isLoading: false
        }));
      }
    };

    checkAuthState();
  }, []);

   
  const login = async (email: string, password: string) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));

      // Реальный API вызов
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

      // Сохраняем в localStorage
      localStorage.setItem('user', JSON.stringify(user));
      if (response.token) {
        localStorage.setItem('accessToken', response.token);
      }
      localStorage.removeItem('pendingVerificationEmail');

      setAuthState({
        user,
        isAuthenticated: user.isEmailVerified,
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
      // Реальный API вызов
      const response = await apiClient.register(userData);
      
      if (!response.success) {
        throw new Error(response.message || 'Ошибка при регистрации');
      }
      
      // После успешной регистрации сохраняем email для верификации
      localStorage.setItem('pendingVerificationEmail', userData.email);
      setAuthState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        pendingVerificationEmail: userData.email
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
      // TODO: Добавить реальный API вызов для верификации email
      // const response = await apiClient.verifyEmail({ code });
      
      // Временная симуляция - заменить на реальный API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Получаем сохраненные данные регистрации
      const email = authState.pendingVerificationEmail || '';
      const username = email.split('@')[0]; // Временно, пока нет API
      
      const user: User = {
        id: '1',
        username: username,
        email: email,
        isEmailVerified: true
      };
      
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.removeItem('pendingVerificationEmail');
      
      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
        pendingVerificationEmail: null
      });
      
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
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('pendingVerificationEmail');
    
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