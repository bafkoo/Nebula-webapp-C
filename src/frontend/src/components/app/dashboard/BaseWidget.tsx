import React from 'react';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';

interface BaseWidgetProps {
  title: string;
  icon?: React.ReactNode;
  isLoading?: boolean;
  error?: string | null;
  children?: React.ReactNode;
  className?: string;
  animationDelay?: number;
  onRetry?: () => void;
}

export const BaseWidget: React.FC<BaseWidgetProps> = ({
  title,
  icon,
  isLoading = false,
  error = null,
  children,
  className = '',
  animationDelay = 0,
  onRetry
}) => {
  const animationStyle = animationDelay > 0 ? { animationDelay: `${animationDelay}ms` } : {};

  return (
    <Card 
      className={`
        min-h-[280px] p-4 transition-all duration-200 
        hover:scale-[1.02] hover:shadow-lg 
        animate-in fade-in-0 slide-in-from-bottom-4 duration-300
        ${className}
      `}
      style={animationStyle}
    >
      {/* Заголовок виджета */}
      <div className="flex items-center mb-4">
        {icon && (
          <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center mr-3 text-primary">
            {icon}
          </div>
        )}
        <h3 className="font-semibold text-foreground text-lg">{title}</h3>
      </div>

      {/* Контент виджета */}
      <div className="flex-1">
        {/* Loading состояние */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center h-[200px] space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="text-sm text-muted-foreground">Загрузка...</p>
          </div>
        )}

        {/* Error состояние */}
        {error && !isLoading && (
          <div className="flex flex-col items-center justify-center h-[200px] space-y-4 animate-in fade-in-0 duration-200">
            <div className="w-12 h-12 bg-destructive/20 rounded-lg flex items-center justify-center text-destructive">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div className="text-center">
              <p className="text-sm text-destructive font-medium mb-2">Ошибка загрузки</p>
              <p className="text-xs text-muted-foreground mb-4">{error}</p>
              {onRetry && (
                <Button 
                  variant="secondary" 
                  size="sm" 
                  onClick={onRetry}
                  className="transition-all duration-200 hover:scale-105"
                >
                  Попробовать снова
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Основной контент */}
        {!isLoading && !error && (
          <div className="animate-in fade-in-0 duration-200">
            {children}
          </div>
        )}
      </div>
    </Card>
  );
}; 