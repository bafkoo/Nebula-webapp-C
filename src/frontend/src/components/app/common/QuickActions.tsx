import React from 'react';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { AddFriendIcon, GroupUsersIcon, CallIcon, SettingsIcon } from '../../icons/Icons';

interface QuickAction {
  id: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'ghost';
}

export const QuickActions: React.FC = () => {
  // TODO: Реализовать функции быстрых действий
  const handleAddFriend = () => {
    // Будет реализовано позже
  };

  const handleJoinGroup = () => {
    // Будет реализовано позже
  };

  const handleVoiceCall = () => {
    // Будет реализовано позже
  };

  const handleSettings = () => {
    // Будет реализовано позже
  };

  const quickActions: QuickAction[] = [
    {
      id: 'add-friend',
      label: 'Добавить друга',
      icon: AddFriendIcon,
      onClick: handleAddFriend,
      variant: 'primary'
    },
    {
      id: 'join-group',
      label: 'Присоединиться к группе',
      icon: GroupUsersIcon,
      onClick: handleJoinGroup,
      variant: 'secondary'
    },
    {
      id: 'voice-call',
      label: 'Голосовой звонок',
      icon: CallIcon,
      onClick: handleVoiceCall,
      variant: 'secondary'
    },
    {
      id: 'settings',
      label: 'Настройки',
      icon: SettingsIcon,
      onClick: handleSettings,
      variant: 'ghost'
    }
  ];

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Быстрые действия</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {quickActions.map((action) => (
          <Button
            key={action.id}
            variant={action.variant}
            className="flex items-center gap-2 h-12"
            onClick={action.onClick}
          >
            <action.icon size={20} />
            <span className="text-sm">{action.label}</span>
          </Button>
        ))}
      </div>
    </Card>
  );
}; 