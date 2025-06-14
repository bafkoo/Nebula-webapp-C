import { useState, useCallback } from 'react';

interface LoaderState {
  isVisible: boolean;
  message: string;
  size: number;
}

export function useLoader() {
  const [loaderState, setLoaderState] = useState<LoaderState>({
    isVisible: false,
    message: 'Загрузка...',
    size: 180
  });

  const showLoader = useCallback((
    message: string = 'Загрузка...', 
    size: number = 180
  ) => {
    setLoaderState({
      isVisible: true,
      message,
      size
    });
  }, []);

  const hideLoader = useCallback(() => {
    setLoaderState(prev => ({
      ...prev,
      isVisible: false
    }));
  }, []);

  const updateMessage = useCallback((message: string) => {
    setLoaderState(prev => ({
      ...prev,
      message
    }));
  }, []);

  return {
    ...loaderState,
    showLoader,
    hideLoader,
    updateMessage
  };
} 