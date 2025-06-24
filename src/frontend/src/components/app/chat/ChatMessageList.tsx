import React, { useEffect, useRef, useState } from 'react';
import ChatMessageItem from './ChatMessageItem';

interface Message {
  id: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: string;
  type: 'text' | 'system';
  isOwnMessage?: boolean;
}

interface ChatMessageListProps {
  chatId: string | null;
  className?: string;
}

const ChatMessageList: React.FC<ChatMessageListProps> = ({ 
  chatId, 
  className = "" 
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock messages data - вынесено из useEffect для стабильности зависимостей
  const mockMessages: Record<string, Message[]> = React.useMemo(() => ({
    '1': [
      {
        id: '1',
        userId: 'user1',
        userName: 'Система',
        content: 'Добро пожаловать в общий чат!',
        createdAt: '2024-01-01T10:00:00',
        type: 'system'
      },
      {
        id: '2',
        userId: 'user2',
        userName: 'Алексей М.',
        content: 'Привет всем! Как дела с проектом?',
        createdAt: '2024-01-01T10:05:00',
        type: 'text'
      },
      {
        id: '3',
        userId: 'current',
        userName: 'Вы',
        content: 'Привет! Всё отлично, работаем над новыми фичами.',
        createdAt: '2024-01-01T10:07:00',
        type: 'text',
        isOwnMessage: true
      },
      {
        id: '4',
        userId: 'user3',
        userName: 'Мария К.',
        content: 'Отлично! Я закончила с дизайном, можем обсудить интеграцию.',
        createdAt: '2024-01-01T10:10:00',
        type: 'text'
      }
    ],
    '2': [
      {
        id: '5',
        userId: 'user2',
        userName: 'Алексей М.',
        content: 'Привет! Как продвигается работа над чатом?',
        createdAt: '2024-01-01T09:00:00',
        type: 'text'
      },
      {
        id: '6',
        userId: 'current',
        userName: 'Вы',
        content: 'Привет! Сейчас делаю компактный виджет для главной страницы.',
        createdAt: '2024-01-01T09:02:00',
        type: 'text',
        isOwnMessage: true
      },
      {
        id: '7',
        userId: 'user2',
        userName: 'Алексей М.',
        content: 'Звучит круто! Будет удобно иметь чат прямо на дашборде.',
        createdAt: '2024-01-01T09:05:00',
        type: 'text'
      }
    ],
    '3': [
      {
        id: '8',
        userId: 'user1',
        userName: 'Система',
        content: 'Чат "Проект Alpha" создан',
        createdAt: '2024-01-01T08:00:00',
        type: 'system'
      },
      {
        id: '9',
        userId: 'user1',
        userName: 'Администратор',
        content: 'Добро пожаловать в чат проекта Alpha! Здесь обсуждаем все вопросы по проекту.',
        createdAt: '2024-01-01T08:01:00',
        type: 'text'
      }
    ]
  }), []);

  useEffect(() => {
    if (!chatId) {
      setMessages([]);
      return;
    }

    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setMessages(mockMessages[chatId] || []);
      setLoading(false);
    }, 300);
  }, [chatId, mockMessages]);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!chatId) {
    return (
      <div className={`flex items-center justify-center h-full text-muted-foreground ${className}`}>
        <div className="text-center">
          <div className="text-sm mb-2">💬</div>
          <div className="text-xs">Выберите чат для начала общения</div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={`flex items-center justify-center h-full ${className}`}>
        <div className="flex items-center gap-2 text-muted-foreground">
          <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          <span className="text-xs">Загрузка сообщений...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-full ${className}`}>
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <div className="text-center">
              <div className="text-sm mb-2">📭</div>
              <div className="text-xs">Пока нет сообщений</div>
              <div className="text-xs mt-1">Напишите первое сообщение!</div>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <ChatMessageItem 
              key={message.id} 
              message={message}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default ChatMessageList; 