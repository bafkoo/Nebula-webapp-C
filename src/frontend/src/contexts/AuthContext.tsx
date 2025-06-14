/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User, AuthState, AuthContextType } from './types';
import { apiClient, TokenManager } from '../lib/api';
import { useNavigate, useLocation } from 'react-router-dom';

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
  const navigate = useNavigate();
  const location = useLocation();
  
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

  // Автоматическое перенаправление при успешной аутентификации
  useEffect(() => {
    if (authState.isAuthenticated && !authState.isLoading) {
      // Проверяем, находимся ли мы на странице аутентификации (исключая главную)
      const authPages = ['/login', '/register', '/reset-password', '/new-password'];
      const isOnAuthPage = authPages.some(page => location.pathname.startsWith(page));
      
      if (isOnAuthPage) {
        navigate('/app', { replace: true });
      }
    }
  }, [authState.isAuthenticated, authState.isLoading, location.pathname, navigate]);

   
  const login = async (email: string, password: string) => {
    console.log('🔐 Вход для:', email);
    
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    try {
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
        pendingVerificationEmail: null // При входе по паролю не показываем верификацию
      });
      
      console.log('✅ Вход успешен');
    } catch (error) {
      console.error('❌ Ошибка входа:', error);
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
      // Используем реальный API эндпоинт для верификации email
      const response = await apiClient.verifyEmail({ code });
      
      if (!response.success || !response.user) {
        throw new Error(response.message || 'Ошибка при верификации email');
      }
      
      // Обновляем пользователя как верифицированного
      const updatedUser: User = {
        id: response.user.id,
        email: response.user.email,
        username: response.user.username,
        isEmailVerified: response.user.isEmailVerified
      };
      
      setAuthState({
        user: updatedUser,
        isAuthenticated: true,
        isLoading: false,
        pendingVerificationEmail: null
      });
      
    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const resendVerificationCode = async () => {
    await apiClient.resendVerificationCode();
  };

  const resetPassword = async (email: string) => {
    console.log('Reset password request for:', email);
    await apiClient.forgotPassword({ email });
  };

  const updatePassword = async (token: string, newPassword: string) => {
    console.log('Update password with token:', token, 'New password length:', newPassword.length);
    await apiClient.resetPassword({ token, newPassword });
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

  const googleAuth = async (idToken: string) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));

      const response = await apiClient.googleAuth({ idToken });

      if (!response.success || !response.user) {
        throw new Error(response.message || 'Ошибка при аутентификации через Google');
      }

      const user: User = {
        id: response.user.id,
        email: response.user.email,
        username: response.user.username,
        isEmailVerified: response.user.isEmailVerified
      };

      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
        pendingVerificationEmail: user.isEmailVerified ? null : user.email
      });
    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const gitHubAuth = async (accessToken: string) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));

      const response = await apiClient.gitHubAuth({ accessToken });

      if (!response.success || !response.user) {
        throw new Error(response.message || 'Ошибка при аутентификации через GitHub');
      }

      const user: User = {
        id: response.user.id,
        email: response.user.email,
        username: response.user.username,
        isEmailVerified: response.user.isEmailVerified
      };

      setAuthState({
        user,
        isAuthenticated: true,
        isLoading: false,
        pendingVerificationEmail: user.isEmailVerified ? null : user.email
      });
    } catch (error) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
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
    resendVerificationCode,
    resetPassword,
    updatePassword,
    googleAuth,
    gitHubAuth
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 