import React from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useAppStore } from '../../../stores/appStore';
import { MenuIcon, SettingsIcon, NotificationIcon } from '../../icons';

export const Header: React.FC = () => {
  const { user } = useAuth();
  const { toggleSidebar } = useAppStore();

  return (
    <header className="h-16 border-b border-border bg-background px-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button onClick={toggleSidebar} className="transition-colors">
          <MenuIcon size={20} className="text-muted-foreground hover:text-foreground" />
        </button>
        <h1 className="text-xl font-semibold text-primary">Nebula Chat</h1>
      </div>
      
      <div className="flex items-center gap-3">
        <button className="transition-colors">
          <NotificationIcon size={20} className="text-muted-foreground hover:text-foreground" />
        </button>
        <button className="transition-colors">
          <SettingsIcon size={20} className="text-muted-foreground hover:text-foreground" />
        </button>
        <div className="text-sm text-muted-foreground">
          {user?.username}
        </div>
      </div>
    </header>
  );
}; 