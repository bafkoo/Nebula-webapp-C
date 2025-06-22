import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { MainLayout } from '../../components/app/layout/MainLayout';
import { WelcomeSection } from '../../components/app/common/WelcomeSection';
import { QuickActions } from '../../components/app/common/QuickActions';

const MainPage: React.FC = () => {
  const { user, isAuthenticated, isLoading } = useAuth();

  // Показываем загрузку пока проверяем авторизацию
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Загрузка...</p>
        </div>
      </div>
    );
  }

  // Перенаправляем на логин если не авторизован
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <MainLayout>
      <div className="h-full overflow-y-auto">
        <div className="max-w-4xl mx-auto p-6 space-y-6">
          <WelcomeSection />
          <QuickActions />
        </div>
      </div>
    </MainLayout>
  );
};

export default MainPage; 