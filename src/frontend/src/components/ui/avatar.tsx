import React, { useState } from 'react';
import { cn } from '../../lib/utils';
import { AnonymousIcon } from '../icons/Icons';

interface AvatarProps {
  /** URL изображения аватара */
  src?: string;
  /** Альтернативный текст */
  alt?: string;
  /** Имя пользователя для генерации инициалов */
  username?: string;
  /** Размер аватара */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Дополнительные CSS классы */
  className?: string;
  /** Показать ли индикатор онлайн статуса */
  showStatus?: boolean;
  /** Онлайн ли пользователь */
  isOnline?: boolean;
  /** Callback для клика по аватару (для загрузки) */
  onClick?: () => void;
  /** Показать ли кнопку редактирования */
  editable?: boolean;
}

export const Avatar: React.FC<AvatarProps> = ({ 
  src, 
  alt,
  username,
  size = 'md',
  className,
  showStatus = false,
  isOnline = false,
  onClick,
  editable = false
}) => {
  const [imageError, setImageError] = useState(false);

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24,
    xl: 32
  };

  const statusSizes = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-3 h-3',
    xl: 'w-4 h-4'
  };

  // Генерация инициалов из имени пользователя
  const getInitials = (name?: string): string => {
    if (!name) return '?';
    
    const words = name.trim().split(' ');
    if (words.length === 1) {
      return words[0].charAt(0).toUpperCase();
    }
    return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const showImage = src && !imageError;
  const initials = getInitials(username);

  return (
    <div className={cn('relative inline-flex', className)}>
      <div 
        className={cn(
          'relative inline-flex shrink-0 overflow-hidden rounded-full',
          'bg-gradient-to-br from-primary/20 to-primary/10',
          sizeClasses[size],
          editable && 'cursor-pointer hover:scale-105 hover:shadow-lg transition-all duration-200 ease-out'
        )}
        onClick={onClick}
      >
        {showImage ? (
          <img
            src={src}
            alt={alt || `Аватар ${username}`}
            className="aspect-square h-full w-full object-cover"
            onError={handleImageError}
          />
        ) : username ? (
          // Показываем инициалы если есть имя пользователя
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary to-primary/80 text-primary-foreground font-semibold">
            <span className={cn(
              'select-none',
              size === 'sm' && 'text-xs',
              size === 'md' && 'text-sm',
              size === 'lg' && 'text-base',
              size === 'xl' && 'text-lg'
            )}>
              {initials}
            </span>
          </div>
        ) : (
          // Показываем иконку анонимного пользователя как fallback
          <div className="flex h-full w-full items-center justify-center bg-secondary">
            <AnonymousIcon 
              size={iconSizes[size]} 
              className="text-muted-foreground" 
            />
          </div>
        )}

        {/* Иконка редактирования при наведении */}
        {editable && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition-all duration-300 ease-in-out rounded-full backdrop-blur-sm">
            <svg 
              className="w-4 h-4 text-white transform scale-75 hover:scale-100 transition-transform duration-200" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" 
              />
            </svg>
          </div>
        )}
      </div>

      {/* Индикатор онлайн статуса - теперь снаружи основного контейнера */}
      {showStatus && (
        <div className="absolute -bottom-0 -right-0 rounded-full bg-background p-0.5">
          <div 
            className={cn(
              'rounded-full',
              statusSizes[size],
              isOnline ? 'bg-green-500' : 'bg-gray-400'
            )}
          />
        </div>
      )}
    </div>
  );
}; 