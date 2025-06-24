import React, { useState, useEffect, useRef } from 'react';
import { Button } from '../../ui/Button';
import { Card } from '../../ui/Card';
import { CloseIcon, FlagChatIcon } from '../../icons';

interface CreateChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateChat: (name: string) => void;
  isLoading: boolean;
}

export const CreateChatModal: React.FC<CreateChatModalProps> = ({ isOpen, onClose, onCreateChat, isLoading }) => {
  const [chatName, setChatName] = useState('');
  const [isClosing, setIsClosing] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleClose = () => {
    setIsClosing(true);
    timeoutRef.current = setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 300);
  };
  
  useEffect(() => {
    if (isOpen) {
      setIsClosing(false);
      setChatName('');
    }
  }, [isOpen]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  if (!isOpen && !isClosing) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (chatName.trim() && !isLoading) {
      onCreateChat(chatName.trim());
    }
  };
  
  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 ${
        isClosing 
          ? 'animate-out fade-out-0 duration-300' 
          : 'animate-in fade-in-0 duration-300'
      }`}
      onClick={handleOverlayClick}
    >
      <Card className={`w-full max-w-md p-6 mx-4 ${
        isClosing 
          ? 'animate-out fade-out-0 zoom-out-95 slide-out-to-bottom-4 duration-300' 
          : 'animate-in fade-in-0 zoom-in-95 slide-in-from-bottom-4 duration-300'
      }`}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <FlagChatIcon size={22} className="text-primary"/>
            <h2 className="text-lg font-semibold">Создать новый чат</h2>
          </div>
          <button 
            onClick={handleClose}
            className="p-1 hover:bg-accent rounded-md transition-colors"
          >
            <CloseIcon size={20} className="text-muted-foreground" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="chatName" className="block text-sm font-medium text-muted-foreground mb-2">
              Название чата
            </label>
            <input
              type="text"
              id="chatName"
              value={chatName}
              onChange={(e) => setChatName(e.target.value)}
              placeholder="Введите название..."
              className="w-full px-3 py-2 bg-input border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary transition-colors"
              autoFocus
              minLength={3}
              maxLength={50}
            />
            <p className="text-xs text-muted-foreground mt-2">
              Название должно содержать от 3 до 50 символов.
            </p>
          </div>
          <div className="flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={handleClose} disabled={isLoading}>
              Отмена
            </Button>
            <Button type="submit" disabled={chatName.trim().length < 3 || isLoading}>
              {isLoading ? 'Создание...' : 'Создать'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}; 