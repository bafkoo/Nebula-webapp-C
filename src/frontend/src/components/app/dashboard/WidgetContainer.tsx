import React, { Suspense } from 'react';
import { BaseWidget } from './BaseWidget';

interface WidgetContainerProps {
  id: string;
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  isLoading?: boolean;
  error?: string | null;
  animationDelay?: number;
  onRetry?: () => void;
  lazy?: boolean;
  priority?: number;
}

// Компонент для lazy loading виджетов
const LazyWidgetWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Suspense fallback={
    <BaseWidget 
      title="Загрузка..." 
      isLoading={true}
    />
  }>
    {children}
  </Suspense>
);

export const WidgetContainer: React.FC<WidgetContainerProps> = ({
  id,
  title,
  icon,
  children,
  isLoading = false,
  error = null,
  animationDelay = 0,
  onRetry,
  lazy = false,
  priority = 0
}) => {
  // Базовый виджет
  const widget = (
    <BaseWidget
      title={title}
      icon={icon}
      isLoading={isLoading}
      error={error}
      animationDelay={animationDelay}
      onRetry={onRetry}
      className="widget-container"
      data-widget-id={id}
      data-priority={priority}
    >
      {children}
    </BaseWidget>
  );

  // Возвращаем lazy wrapper если нужно
  if (lazy) {
    return <LazyWidgetWrapper>{widget}</LazyWidgetWrapper>;
  }

  return widget;
};

// Хук для управления порядком виджетов
export const useWidgetOrder = (widgets: Array<{ id: string; priority: number }>) => {
  return React.useMemo(() => {
    return [...widgets].sort((a, b) => {
      // Сортируем по приоритету (больше = выше)
      if (a.priority !== b.priority) {
        return b.priority - a.priority;
      }
      // Если приоритеты равны, сортируем по ID
      return a.id.localeCompare(b.id);
    });
  }, [widgets]);
};

// Типы для будущего drag & drop
export interface WidgetPosition {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface WidgetLayout {
  positions: WidgetPosition[];
  columns: number;
  gap: number;
} 