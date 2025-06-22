import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { Avatar } from '../../ui/Avatar';
import { AvatarUploadModal } from '../common/AvatarUploadModal';
import { SettingsIcon, OnlineStatusIcon, AwayStatusIcon, BusyStatusIcon, OfflineStatusIcon } from '../../icons/Icons';

interface UserStatusSectionProps {
  collapsed: boolean;
}

export const UserStatusSection: React.FC<UserStatusSectionProps> = ({ collapsed }) => {
  const { user } = useAuth();
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const [isStatusPopoverOpen, setIsStatusPopoverOpen] = useState(false);
  const [isStatusPopoverClosing, setIsStatusPopoverClosing] = useState(false);
  const [showStatusTooltip, setShowStatusTooltip] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleAvatarClick = () => {
    setIsAvatarModalOpen(true);
  };

  const handleStatusClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (isStatusPopoverOpen) {
      closeStatusPopover();
    } else {
      setIsStatusPopoverOpen(true);
      setIsStatusPopoverClosing(false);
    }
  };

  const closeStatusPopover = () => {
    setIsStatusPopoverClosing(true);
    timeoutRef.current = setTimeout(() => {
      setIsStatusPopoverOpen(false);
      setIsStatusPopoverClosing(false);
    }, 200); // Время анимации
  };

  // Очистка таймера при размонтировании
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const statuses = [
    { label: 'Онлайн', icon: OnlineStatusIcon, color: 'text-green-500' },
    { label: 'Отошел', icon: AwayStatusIcon, color: 'text-yellow-500' },
    { label: 'Занят', icon: BusyStatusIcon, color: 'text-red-500' },
    { label: 'Невидимый', icon: OfflineStatusIcon, color: 'text-gray-400' },
  ];

  if (collapsed) {
    return (
      <>
        <div className="h-16 border-b border-border flex items-center justify-center px-2">
          <div className="w-full py-2 rounded-lg transition-all duration-200 hover:bg-sidebar-accent hover:scale-105 cursor-pointer flex justify-center" onClick={handleAvatarClick}>
            <Avatar 
              size="sm" 
              src={user?.avatar}
              username={user?.username}
              showStatus={true}
              isOnline={user?.isOnline || false}
              editable={true}
            />
          </div>
        </div>
        <AvatarUploadModal 
          isOpen={isAvatarModalOpen}
          onClose={() => setIsAvatarModalOpen(false)}
        />
      </>
    );
  }

  return (
    <>
      <div className="h-16 border-b border-border flex items-center px-2 relative">
        <div className="flex items-center gap-3 w-full py-2 px-2 rounded-lg transition-all duration-200 hover:bg-sidebar-accent hover:scale-[1.02] cursor-pointer group" onClick={handleAvatarClick}>
          <Avatar 
            size="md" 
            src={user?.avatar}
            username={user?.username}
            showStatus={true}
            isOnline={user?.isOnline || false}
            editable={true}
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.username || 'Пользователь'}</p>
            <p className="text-xs text-muted-foreground">
              {user?.isOnline ? 'Онлайн' : 'Не в сети'}
            </p>
          </div>
          
          {/* Кнопка статуса - появляется только при hover */}
          <div className="relative">
            <button
              onClick={handleStatusClick}
              onMouseEnter={() => setShowStatusTooltip(true)}
              onMouseLeave={() => setShowStatusTooltip(false)}
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-1 rounded hover:bg-sidebar-accent-foreground/10"
            >
              <SettingsIcon size={16} className="text-muted-foreground hover:text-foreground" />
            </button>

            {/* Тултип */}
            {showStatusTooltip && (
              <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 z-30 bg-popover border border-border rounded-md px-2 py-1 shadow-lg whitespace-nowrap">
                <span className="text-xs text-popover-foreground">Изменить статус</span>
                {/* Стрелочка */}
                <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-border">
                  <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-popover -mr-px"></div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Поповер статуса */}
        {(isStatusPopoverOpen || isStatusPopoverClosing) && (
          <>
            {/* Overlay для закрытия */}
            <div 
              className={`fixed inset-0 z-10 ${isStatusPopoverClosing ? 'animate-out fade-out-0 duration-200' : 'animate-in fade-in-0 duration-200'}`}
              onClick={closeStatusPopover}
            />
            
            {/* Поповер */}
            <div className={`absolute right-2 top-full mt-2 z-20 bg-popover border border-border rounded-lg shadow-lg py-2 min-w-[180px] ${
              isStatusPopoverClosing 
                ? 'animate-out fade-out-0 zoom-out-95 slide-out-to-top-2 duration-200' 
                : 'animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-200'
            }`}>
              <div className="px-3 py-2 border-b border-border">
                <p className="text-sm font-medium">Установить статус</p>
              </div>
              
              {statuses.map((status, index) => (
                <button
                  key={index}
                  className="w-full flex items-center gap-3 px-3 py-2 hover:bg-accent hover:text-accent-foreground transition-colors"
                  onClick={() => {
                    // TODO: Изменить статус пользователя
                    closeStatusPopover();
                  }}
                >
                  <status.icon size={16} className={status.color} />
                  <span className="text-sm">{status.label}</span>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
      
      <AvatarUploadModal 
        isOpen={isAvatarModalOpen}
        onClose={() => setIsAvatarModalOpen(false)}
      />
    </>
  );
}; 