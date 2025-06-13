/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User, AuthState, AuthContextType } from './types';

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

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // В реальном приложении здесь будет API вызов с использованием password
      // const response = await api.login({ email, password });
      console.log('Login attempt:', { email, password }); // Используем password для отладки

      const mockUser: User = {
        id: '1',
        email,
        username: email.split('@')[0],
        isEmailVerified: true // В реальности это придет с сервера
      };

      const mockToken = 'mock-jwt-token';

      // Сохраняем в localStorage
      localStorage.setItem('user', JSON.stringify(mockUser));
      localStorage.setItem('accessToken', mockToken);
      localStorage.removeItem('pendingVerificationEmail');

      setAuthState({
        user: mockUser,
        isAuthenticated: true,
        isLoading: false,
        pendingVerificationEmail: null
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
      // Симуляция регистрации - заменить на реальный API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Сохраняем username для использования после верификации
      localStorage.setItem('pendingUsername', userData.username);
      
      // После успешной регистрации сохраняем email для верификации
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
      // Симуляция верификации - заменить на реальный API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Получаем сохраненные данные регистрации
      const email = authState.pendingVerificationEmail || '';
      const username = localStorage.getItem('pendingUsername') || email.split('@')[0];
      
      const user: User = {
        id: '1',
        username: username,
        email: email,
        isEmailVerified: true
      };
      
      // Очищаем временные данные
      localStorage.removeItem('pendingUsername');
      
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
    // В реальном приложении здесь будет API вызов
    await new Promise(resolve => setTimeout(resolve, 1500));
  };

  const updatePassword = async (token: string, newPassword: string) => {
    console.log('Update password with token:', token, 'New password length:', newPassword.length);
    // В реальном приложении здесь будет API вызов
    await new Promise(resolve => setTimeout(resolve, 1500));
  };

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('pendingVerificationEmail');
    localStorage.removeItem('pendingUsername');
    
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