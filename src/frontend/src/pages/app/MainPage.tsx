import React from 'react';
import { MainLayout } from '../../components/app/layout/MainLayout';

const MainPage: React.FC = () => {
  return (
    <MainLayout>
      <div className="h-full overflow-y-auto">
        <div className="max-w-4xl mx-auto p-6 space-y-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-primary mb-4">
              Добро пожаловать в Nebula Chat!
            </h2>
            <p className="text-muted-foreground">
              Это главная страница приложения. Здесь будет контент после завершения всех этапов.
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default MainPage; 