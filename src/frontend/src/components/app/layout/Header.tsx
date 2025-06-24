import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { useAppStore } from '../../../stores/appStore';
import { MenuIcon, SettingsIcon, NotificationIcon } from '../../icons';
import { Button } from '../../ui/Button';
import { MessageSquare, LayoutDashboard } from 'lucide-react';
import type { ActiveTab } from '../../../types/app';

interface HeaderProps {
  activeTab?: ActiveTab;
}

export const Header: React.FC<HeaderProps> = ({ 
  activeTab = 'dashboard'
}) => {
  const { user } = useAuth();
  const { toggleSidebar } = useAppStore();
  const navigate = useNavigate();

  const handleTabChange = (tab: ActiveTab) => {
    console.log('Header: handleTabChange called with tab:', tab);
    console.log('Header: Current location:', window.location.pathname);
    
    if (tab === 'dashboard') {
      console.log('Header: Navigating to dashboard');
      navigate('/app');
    } else if (tab === 'chat') {
      console.log('Header: Navigating to chat');
      // Переходим к чатам без конкретного chatId
      // FullChatInterface автоматически выберет первый чат или покажет экран выбора
      navigate('/app/chat');
    }
    
    console.log('Header: Navigation command completed');
  };

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
      onClick={() => {
        console.log('TabButton: Click detected for tab:', tab);
        handleTabChange(tab);
      }}
      variant={isActive ? "primary" : "ghost"}
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