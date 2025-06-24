import { useState, useEffect, useCallback, useRef } from 'react';
import signalrService from '../../lib/signalrService';
import { apiClient } from '../../lib/api';
import type { MessageDto } from '../../types/chat';
import { useAuth } from '../useAuth';

export const useChat = (chatId: string | null) => {
  const [messages, setMessages] = useState<MessageDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const onReceiveMessageRef = useRef<((message: MessageDto) => void) | null>(null);

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

    signalrService.on('ReceiveMessage', messageHandler);

    return () => {
      signalrService.off('ReceiveMessage', messageHandler);
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

  return { messages, sendMessage, isLoading };
}; 