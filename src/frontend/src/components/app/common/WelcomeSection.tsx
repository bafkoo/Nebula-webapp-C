import React from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { Card } from '../../ui/Card';
import { SparklesIcon } from '../../icons';

export const WelcomeSection: React.FC = () => {
  const { user } = useAuth();

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-4">
        <SparklesIcon size={24} className="text-primary" />
        <h2 className="text-2xl font-bold">
          Добро пожаловать, {user?.username}!
        </h2>
      </div>
      <p className="text-muted-foreground">
        Это ваша главная страница Nebula Chat. Здесь вы можете общаться с друзьями, 
        присоединяться к игровым серверам и управлять своим профилем.
      </p>
    </Card>
  );
}; 