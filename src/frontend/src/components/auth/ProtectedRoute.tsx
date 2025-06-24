import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean; // Требует полной аутентификации
  requireVerificationPending?: boolean; // Требует состояния "ожидания верификации"
  redirectTo?: string; // Куда перенаправлять при отсутствии доступа
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAuth = false,
  requireVerificationPending = false,
  redirectTo = '/login'
}) => {
  const { isAuthenticated, pendingVerificationEmail, isLoading } = useAuth();
  const location = useLocation();
  const { t } = useTranslation();

  // Показываем загрузку пока проверяем состояние аутентификации
  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-[#252525] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4">
            <div className="w-full h-full border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
          </div>
          <p className="text-white text-lg" style={{ fontFamily: 'Helvetica, sans-serif' }}>
            {t('loader.checkingAuth')}
          </p>
        </div>
      </div>
    );
  }

  // Логика для страниц, требующих ожидания верификации (например, /verification)
  if (requireVerificationPending) {
    // Если пользователь уже полностью аутентифицирован, перенаправляем в приложение
    if (isAuthenticated) {
      return <Navigate to="/app" replace />;
    }
    
    // Если нет состояния ожидания верификации, перенаправляем на регистрацию
    if (!pendingVerificationEmail) {
      return <Navigate to="/register" replace />;
    }
    
    // Все хорошо, показываем страницу верификации
    return <>{children}</>;
  }

  // Логика для страниц, требующих полной аутентификации (например, /app)
  if (requireAuth) {
    // Если не аутентифицирован - перенаправляем на логин
    if (!isAuthenticated) {
      return <Navigate to={redirectTo} state={{ from: location }} replace />;
    }
    
    // Все хорошо, показываем защищенную страницу
    return <>{children}</>;
  }

  // Для обычных страниц просто показываем контент
  return <>{children}</>;
};

export default ProtectedRoute; 