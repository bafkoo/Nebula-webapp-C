import React, { useState } from 'react';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { Plus, Search, Settings, Users } from 'lucide-react';
import ChatMessageList from './ChatMessageList';
import ChatInput from './ChatInput';
import TypingIndicator from './TypingIndicator';
import type { ChatDto } from '../../../types/chat';

interface FullChatInterfaceProps {
  className?: string;
}

const FullChatInterface: React.FC<FullChatInterfaceProps> = ({ 
  className = "" 
}) => {
  const [activeChat, setActiveChat] = useState<string | null>('1');
  const [isTyping] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Mock chats data
  const [chats] = useState<ChatDto[]>([
    { 
      id: '1', 
      name: 'Общий чат', 
      type: 'group', 
      createdBy: 'user1', 
      createdAt: '2024-01-01', 
      description: 'Основной чат команды',
      participantsCount: 5,
      lastMessage: 'Отлично! Я закончила с дизайном...',
      lastMessageTime: '10:10',
      unreadCount: 0
    },
    { 
      id: '2', 
      name: 'Алексей М.', 
      type: 'private', 
      createdBy: 'user2', 
      createdAt: '2024-01-02',
      lastMessage: 'Звучит круто! Будет удобно иметь...',
      lastMessageTime: '09:05',
      unreadCount: 2
    },
    { 
      id: '3', 
      name: 'Проект Alpha', 
      type: 'group', 
      createdBy: 'user1', 
      createdAt: '2024-01-03', 
      description: 'Обсуждение проекта Alpha',
      participantsCount: 3,
      lastMessage: 'Добро пожаловать в чат проекта...',
      lastMessageTime: 'Вчера',
      unreadCount: 0
    },
    { 
      id: '4', 
      name: 'Мария К.', 
      type: 'private', 
      createdBy: 'user3', 
      createdAt: '2024-01-04',
      lastMessage: 'Когда планируем релиз?',
      lastMessageTime: '2д назад',
      unreadCount: 1
    },
    { 
      id: '5', 
      name: 'UI/UX Design', 
      type: 'group', 
      createdBy: 'user3', 
      createdAt: '2024-01-05', 
      description: 'Обсуждение дизайна и интерфейса',
      participantsCount: 4,
      lastMessage: 'Новые макеты готовы',
      lastMessageTime: '3д назад',
      unreadCount: 0
    }
  ]);

  const activeChatData = chats.find(chat => chat.id === activeChat);
  const filteredChats = chats.filter(chat => 
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleChatSelect = (chatId: string) => {
    setActiveChat(chatId);
  };

  const handleSendMessage = (message: string) => {
    // TODO: Implement message sending via SignalR
    console.log('Sending message:', message);
  };

  const formatTime = (timeStr: string) => {
    return timeStr;
  };

  return (
    <div className={`h-full flex gap-4 ${className}`}>
      {/* Левая панель - Список чатов */}
      <Card className="w-80 flex flex-col bg-card border-border">
        {/* Заголовок чатов */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Чаты</h2>
            <div className="flex gap-2">
              <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                <Plus size={16} />
              </Button>
              <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                <Settings size={16} />
              </Button>
            </div>
          </div>
          
          {/* Поиск */}
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Поиск чатов..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
        </div>

        {/* Список чатов */}
        <div className="flex-1 overflow-y-auto">
          {filteredChats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => handleChatSelect(chat.id)}
              className={`w-full text-left p-4 hover:bg-muted transition-colors border-b border-border/50 ${
                chat.id === activeChat ? 'bg-muted' : ''
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Аватар чата */}
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold text-sm ${
                  chat.type === 'private' ? 'bg-green-500' : 'bg-blue-500'
                }`}>
                  {chat.type === 'private' ? 
                    chat.name.charAt(0).toUpperCase() : 
                    <Users size={20} />
                  }
                </div>

                {/* Информация о чате */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-medium text-foreground truncate">
                      {chat.name}
                    </h3>
                    <span className="text-xs text-muted-foreground">
                      {formatTime(chat.lastMessageTime || '')}
                    </span>
                  </div>
                  
                  <p className="text-sm text-muted-foreground truncate mb-1">
                    {chat.lastMessage || chat.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {chat.type === 'group' && `${chat.participantsCount} участников`}
                    </span>
                    {chat.unreadCount && chat.unreadCount > 0 && (
                      <span className="bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full min-w-[20px] text-center">
                        {chat.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </Card>

      {/* Правая панель - Активный чат */}
      <Card className="flex-1 flex flex-col bg-card border-border">
        {activeChatData ? (
          <>
            {/* Заголовок активного чата */}
            <div className="p-4 border-b border-border">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${
                  activeChatData.type === 'private' ? 'bg-green-500' : 'bg-blue-500'
                }`}>
                  {activeChatData.type === 'private' ? 
                    activeChatData.name.charAt(0).toUpperCase() : 
                    <Users size={20} />
                  }
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">
                    {activeChatData.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {activeChatData.type === 'group' 
                      ? `${activeChatData.participantsCount} участников${activeChatData.description ? ` • ${activeChatData.description}` : ''}`
                      : 'В сети'
                    }
                  </p>
                </div>
                <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                  <Settings size={16} />
                </Button>
              </div>
            </div>

            {/* Область сообщений */}
            <div className="flex-1 flex flex-col min-h-0">
              <ChatMessageList 
                chatId={activeChat}
                className="flex-1"
              />
              
              {/* Индикатор печати */}
              {isTyping && (
                <TypingIndicator className="px-4 py-2" />
              )}
            </div>

            {/* Поле ввода */}
            <ChatInput 
              onSendMessage={handleSendMessage}
              disabled={false}
              className="border-t border-border"
            />
          </>
        ) : (
          /* Пустое состояние */
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <div className="text-4xl mb-4">💬</div>
              <h3 className="text-lg font-medium mb-2">Выберите чат</h3>
              <p className="text-sm">Выберите существующий чат или создайте новый</p>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default FullChatInterface; 