import React from 'react';
import { useAppStore } from '../../../stores/appStore';
import { cn } from '../../../lib/utils';
import { HomeIcon, GroupUsersIcon, AddIcon } from '../../icons/Icons';
import { UserStatusSection } from './UserStatusSection';

export const Sidebar: React.FC = () => {
  const { sidebarCollapsed } = useAppStore();

  return (
    <aside className={cn(
      'bg-sidebar border-r border-border transition-all duration-300',
      sidebarCollapsed ? 'w-16' : 'w-64'
    )}>
      <UserStatusSection collapsed={sidebarCollapsed} />
      
      <nav className="p-2 space-y-1">
        <SidebarItem icon={HomeIcon} label="Главная" collapsed={sidebarCollapsed} active />
        <SidebarItem icon={GroupUsersIcon} label="Друзья" collapsed={sidebarCollapsed} />
        <SidebarItem icon={AddIcon} label="Добавить сервер" collapsed={sidebarCollapsed} />
      </nav>
    </aside>
  );
};

interface SidebarItemProps {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  collapsed: boolean;
  active?: boolean;
  onClick?: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ 
  icon: Icon, 
  label, 
  collapsed, 
  active = false,
  onClick 
}) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors',
        'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
        active && 'bg-sidebar-primary text-sidebar-primary-foreground',
        collapsed && 'justify-center'
      )}
    >
      <Icon size={20} />
      {!collapsed && <span className="text-sm font-medium">{label}</span>}
    </button>
  );
}; 