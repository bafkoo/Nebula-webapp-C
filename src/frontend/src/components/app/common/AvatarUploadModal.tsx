import React, { useRef, useState, useEffect } from 'react';
import { useAvatar } from '../../../hooks/useAvatar';
import { useAuth } from '../../../hooks/useAuth';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { Avatar } from '../../ui/Avatar';
import { UploadIcon, BanIcon, CloseIcon } from '../../icons';

interface AvatarUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AvatarUploadModal: React.FC<AvatarUploadModalProps> = ({ 
  isOpen, 
  onClose 
}) => {
  const { user } = useAuth();
  const { isUploading, uploadAvatar, removeAvatar, error } = useAvatar();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleClose = () => {
    setIsClosing(true);
    timeoutRef.current = setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 300); // Время анимации
  };

  // Очистка таймера при размонтировании
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  // Сброс состояния закрытия при открытии модалки
  useEffect(() => {
    if (isOpen) {
      setIsClosing(false);
    }
  }, [isOpen]);

  if (!isOpen && !isClosing) return null;

  const handleFileSelect = (files: FileList | null) => {
    if (files && files[0]) {
      uploadAvatar(files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
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
        {/* Заголовок */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Управление аватаром</h2>
          <button 
            onClick={handleClose}
            className="p-1 hover:bg-accent rounded-md transition-colors"
          >
            <CloseIcon size={20} className="text-muted-foreground" />
          </button>
        </div>

        {/* Текущий аватар */}
        <div className="flex flex-col items-center mb-6">
          <Avatar 
            src={user?.avatar}
            username={user?.username}
            size="xl"
            className="mb-4"
          />
          <p className="text-sm text-muted-foreground text-center">
            {user?.avatar ? 'Текущий аватар' : 'У вас пока нет аватара'}
          </p>
        </div>

        {/* Зона загрузки */}
        <div
          className={`
            border-2 border-dashed rounded-lg p-6 text-center mb-4 transition-all duration-200 cursor-pointer transform
            ${dragOver 
              ? 'border-primary bg-primary/5 scale-[1.02] shadow-lg' 
              : 'border-border hover:border-primary/50 hover:bg-primary/2 hover:scale-[1.01]'
            }
          `}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
        >
          <UploadIcon 
            size={32} 
            className={`mx-auto mb-2 text-muted-foreground transition-transform duration-200 ${
              dragOver ? 'scale-110' : ''
            }`} 
          />
          <p className="text-sm font-medium mb-1">
            Перетащите изображение или нажмите для выбора
          </p>
          <p className="text-xs text-muted-foreground">
            PNG, JPG, GIF до 5MB
          </p>
        </div>

        {/* Скрытый input для файлов */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFileSelect(e.target.files)}
        />

        {/* Ошибка */}
        {error && (
          <div className="mb-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md animate-in slide-in-from-top-2 fade-in-0 duration-200">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {/* Кнопки действий */}
        <div className="flex gap-3">
          <Button
            variant="secondary"
            className="flex-1"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            <UploadIcon size={16} className="mr-2" />
            {isUploading ? 'Загрузка...' : 'Выбрать файл'}
          </Button>
          
          {user?.avatar && (
            <Button
              variant="ghost"
              onClick={removeAvatar}
              disabled={isUploading}
              className="px-3"
            >
              <BanIcon size={16} />
            </Button>
          )}
        </div>

        {/* Информация */}
        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground">
            Рекомендуется квадратное изображение размером от 128x128 пикселей.
            Аватар будет обрезан до круглой формы.
          </p>
        </div>
      </Card>
    </div>
  );
}; 