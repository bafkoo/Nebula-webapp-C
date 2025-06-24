import { useState, useEffect, useCallback, useRef } from 'react';
import signalrService from '../../lib/signalrService';
import { apiClient } from '../../lib/api';
import type { MessageDto } from '../../types/chat';
import { useAuth } from '../useAuth';

interface TypingUser {
  userId: string;
  username: string;
}

export const useChat = (chatId: string | null) => {
  const [messages, setMessages] = useState<MessageDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
  const { user } = useAuth();

  const onReceiveMessageRef = useRef<((message: MessageDto) => void) | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  onReceiveMessageRef.current = (message: MessageDto) => {
    if (message.chatId === chatId) {
      setMessages((prevMessages) => {
        // Ищем сообщение, которое мы отправили, чтобы заменить его серверной версией.
        // Сервер должен вернуть `tempId` в ответ. Для этого нужно доработать и сервер.
        // Временное решение: ищем по `tempId` в свойстве `id`.
        const indexToReplace = prevMessages.findIndex(m => m.id === message.tempId);

        if (indexToReplace !== -1) {
          const newMessages = [...prevMessages];
          newMessages[indexToReplace] = message;
          return newMessages;
        }
        
        // Если это новое сообщение от другого пользователя, просто добавляем его.
        return [...prevMessages, message];
      });
    }
  };

  useEffect(() => {
    if (!chatId) {
      setMessages([]);
      return;
    }

    const fetchHistory = async () => {
      setIsLoading(true);
      console.log(`[useChat] Fetching history for chatId: ${chatId}`);
      try {
        const history = await apiClient.getMessages(chatId);
        console.log(`[useChat] Received history for ${chatId}:`, history);
        setMessages(history.reverse());
        console.log(`[useChat] Messages state updated for ${chatId}.`);
      } catch (error) {
        console.error(`[useChat] Failed to fetch message history for ${chatId}:`, error);
        setMessages([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();

    const messageHandler = (message: MessageDto) => {
      onReceiveMessageRef.current?.(message);
    };

    const typingHandler = (data: { userId: string, username: string, chatId: string, isTyping: boolean }) => {
      if (data.chatId === chatId) {
        setTypingUsers(prev => {
          const userExists = prev.some(u => u.userId === data.userId);
          if (data.isTyping && !userExists) {
            return [...prev, { userId: data.userId, username: data.username }];
          }
          if (!data.isTyping && userExists) {
            return prev.filter(u => u.userId !== data.userId);
          }
          return prev;
        });
      }
    };

    signalrService.on('ReceiveMessage', messageHandler);
    signalrService.on('UserTyping', typingHandler);

    return () => {
      signalrService.off('ReceiveMessage', messageHandler);
      signalrService.off('UserTyping', typingHandler);
      setTypingUsers([]); // Очищаем при смене чата
    };
  }, [chatId]);

  const sendMessage = useCallback(async (content: string) => {
    if (!chatId || !user || content.trim() === '') return;

    const tempId = `temp_${Date.now()}`;
    
    const optimisticMessage: MessageDto = {
      id: tempId,
      tempId: tempId,
      chatId: chatId,
      userId: user.id,
      userName: user.username,
      avatarUrl: user.avatar,
      content: content,
      createdAt: new Date().toISOString(),
      isSending: true,
      type: 'Text',
    };

    setMessages((prevMessages) => [...prevMessages, optimisticMessage]);

    try {
      // TODO: На сервере нужно доработать метод, чтобы он принимал tempId и возвращал его
      await signalrService.sendMessage(chatId, content, tempId);
    } catch (error) {
      console.error("Failed to send message via SignalR:", error);
      setMessages((prevMessages) => prevMessages.map((m: MessageDto) => 
        m.id === tempId ? { ...m, isSending: false, hasError: true } : m
      ));
    }
  }, [chatId, user]);

  const sendTypingNotification = useCallback((isTyping: boolean) => {
    if (!chatId) return;

    // Отправляем "isTyping: false" без задержки
    if (!isTyping) {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = null;
      }
      signalrService.setTyping(chatId, false);
      return;
    }

    // Отправляем "isTyping: true" с задержкой, чтобы не спамить
    if (!typingTimeoutRef.current) {
      signalrService.setTyping(chatId, true);
      
      typingTimeoutRef.current = setTimeout(() => {
        signalrService.setTyping(chatId, false);
        typingTimeoutRef.current = null;
      }, 3000); // 3 секунды
    }
  }, [chatId]);

  const uploadFile = useCallback(async (file: File, content?: string) => {
    if (!chatId || !user) return;

    const tempId = `temp_${Date.now()}`;
    
    // Определение типа сообщения на основе MIME-типа файла
    let messageType: 'Image' | 'File' | 'Voice' | 'Video' = 'File';
    if (file.type.startsWith('image/')) {
      messageType = 'Image';
    } else if (file.type.startsWith('audio/')) {
      messageType = 'Voice';
    } else if (file.type.startsWith('video/')) {
      messageType = 'Video';
    }
    
    const optimisticMessage: MessageDto = {
      id: tempId,
      tempId: tempId,
      chatId: chatId,
      userId: user.id,
      userName: user.username,
      avatarUrl: user.avatar,
      content: content || '',
      type: messageType,
      fileName: file.name,
      fileSize: file.size,
      mimeType: file.type,
      createdAt: new Date().toISOString(),
      isSending: true,
    };

    setMessages((prevMessages) => [...prevMessages, optimisticMessage]);

    try {
      const uploadedMessage = await apiClient.uploadFile(file, chatId, content);
      
      // Заменяем временное сообщение на серверную версию
      setMessages((prevMessages) => prevMessages.map((m: MessageDto) => 
        m.id === tempId ? { ...uploadedMessage, isSending: false } : m
      ));

      // Уведомляем через SignalR о новом сообщении (если сервер не делает это автоматически)
      await signalrService.sendMessage(chatId, uploadedMessage.content, uploadedMessage.id);
    } catch (error) {
      console.error("Failed to upload file:", error);
      setMessages((prevMessages) => prevMessages.map((m: MessageDto) => 
        m.id === tempId ? { ...m, isSending: false, hasError: true } : m
      ));
    }
  }, [chatId, user]);

  return { messages, sendMessage, uploadFile, isLoading, typingUsers, sendTypingNotification };
}; 