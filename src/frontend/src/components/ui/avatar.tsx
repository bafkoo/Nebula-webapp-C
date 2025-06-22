import React from 'react';
import { cn } from '../../lib/utils';
import { AnonymousIcon } from '../icons/Icons';

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({ 
  src, 
  alt = 'Avatar', 
  size = 'md',
  className 
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  return (
    <div
      className={cn(
        'relative inline-flex shrink-0 overflow-hidden rounded-full bg-muted',
        sizeClasses[size],
        className
      )}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          className="aspect-square h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-secondary">
          <AnonymousIcon 
            size={size === 'sm' ? 16 : size === 'md' ? 20 : 24} 
            className="text-muted-foreground" 
          />
        </div>
      )}
    </div>
  );
}; 