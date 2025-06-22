import { useState, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface UseAvatarReturn {
  isUploading: boolean;
  uploadAvatar: (file: File) => Promise<void>;
  removeAvatar: () => Promise<void>;
  error: string | null;
}

export const useAvatar = (): UseAvatarReturn => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const uploadAvatar = useCallback(async (file: File) => {
    if (!user) {
      setError('Пользователь не авторизован');
      return;
    }

    // Проверка типа файла
    if (!file.type.startsWith('image/')) {
      setError('Можно загружать только изображения');
      return;
    }

    // Проверка размера файла (максимум 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setError('Размер файла не должен превышать 5MB');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      // TODO: Реализовать загрузку на сервер
      // Пока что создаем локальный URL для демонстрации
      const formData = new FormData();
      formData.append('avatar', file);

      // Здесь будет запрос к API для загрузки аватара
      // const response = await api.uploadAvatar(formData);
      
      // Временная заглушка - создаем локальный URL
      const localUrl = URL.createObjectURL(file);
      console.log('Аватар загружен (локально):', localUrl);
      
      // TODO: Обновить пользователя в AuthContext
      // await updateUser({ ...user, avatar: response.avatarUrl });
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка загрузки аватара');
    } finally {
      setIsUploading(false);
    }
  }, [user]);

  const removeAvatar = useCallback(async () => {
    if (!user) {
      setError('Пользователь не авторизован');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      // TODO: Реализовать удаление аватара на сервере
      // await api.removeAvatar();
      
      console.log('Аватар удален');
      
      // TODO: Обновить пользователя в AuthContext
      // await updateUser({ ...user, avatar: undefined });
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка удаления аватара');
    } finally {
      setIsUploading(false);
    }
  }, [user]);

  return {
    isUploading,
    uploadAvatar,
    removeAvatar,
    error
  };
}; 