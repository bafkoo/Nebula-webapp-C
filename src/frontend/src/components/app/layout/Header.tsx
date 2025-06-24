import React from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useAppStore } from '../../../stores/appStore';
import { MenuIcon, SettingsIcon, NotificationIcon } from '../../icons';
import { Button } from '../../ui/Button';
import { MessageSquare, LayoutDashboard } from 'lucide-react';
import type { ActiveTab } from '../../../types/app';

interface HeaderProps {
  activeTab?: ActiveTab;
  onTabChange?: (tab: ActiveTab) => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  activeTab = 'dashboard',
  onTabChange 
}) => {
  const { user } = useAuth();
  const { toggleSidebar } = useAppStore();

  const TabButton = ({ 
    tab, 
    icon: Icon, 
    label, 
    isActive 
  }: { 
    tab: ActiveTab; 
    icon: React.ElementType; 
    label: string; 
    isActive: boolean;
  }) => (
    <Button
      onClick={() => onTabChange?.(tab)}
      variant={isActive ? "default" : "ghost"}
      size="sm"
      className={`flex items-center gap-2 ${isActive ? '' : 'text-muted-foreground'}`}
    >
      <Icon size={18} />
      {label}
    </Button>
  );

  return (
    <header className="h-16 border-b border-border bg-background px-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button onClick={toggleSidebar} className="transition-colors">
          <MenuIcon size={20} className="text-muted-foreground hover:text-foreground" />
        </button>
        <h1 className="text-xl font-semibold text-primary">Nebula Chat</h1>
      </div>
      
      {/* Центральная навигация Dashboard/Chat */}
      {onTabChange && (
        <div className="flex gap-2">
          <TabButton
            tab="dashboard"
            icon={LayoutDashboard}
            label="Dashboard"
            isActive={activeTab === 'dashboard'}
          />
          <TabButton
            tab="chat"
            icon={MessageSquare}
            label="Чаты"
            isActive={activeTab === 'chat'}
          />
        </div>
      )}
      
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