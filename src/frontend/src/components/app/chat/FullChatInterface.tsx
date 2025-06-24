import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { Plus, Search, Settings, Loader2, Moon, Sun } from 'lucide-react';
import ChatMessageList from './ChatMessageList';
import ChatInput from './ChatInput';
import TypingIndicator from './TypingIndicator';
import { SearchMessages } from './SearchMessages';
import { useChat } from '../../../hooks/app/useChat';
import { useAuth } from '../../../hooks/useAuth';
import type { ChatDto, CreateChatRequest } from '../../../types/chat';
import { apiClient } from '../../../lib/api';
import { CreateChatModal } from './CreateChatModal';
import { Avatar } from '../../ui/Avatar';

interface FullChatInterfaceProps {
  className?: string;
}

// Функция для получения случайного статуса (временно для демонстрации)
const getRandomStatus = () => {
  const statuses = ['online', 'away', 'busy', 'offline'] as const;
  return statuses[Math.floor(Math.random() * statuses.length)];
};

// Функция для получения статус иконки

const FullChatInterface: React.FC<FullChatInterfaceProps> = ({ className = "" }) => {
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [chats, setChats] = useState<ChatDto[]>([]);
  const [isChatsLoading, setIsChatsLoading] = useState(true);
  const [isCreatingChat, setIsCreatingChat] = useState(false);
  const [isCreateChatModalOpen, setIsCreateChatModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [userStatuses] = useState(() => {
    // Создаем случайные статусы для демонстрации
    const statuses: Record<string, string> = {};
    return statuses;
  });
  
  const navigate = useNavigate();
  const { chatId: urlChatId } = useParams<{ chatId: string }>();
  const { user } = useAuth();

  // Функция для получения статуса пользователя
  const getUserStatus = (userId: string) => {
    return userStatuses[userId] || getRandomStatus();
  };

  const { 
    messages, 
    sendMessage, 
    uploadFile,
    isLoading: isLoadingMessages,
    typingUsers,
    sendTypingNotification
  } = useChat(activeChatId);
  
  // Синхронизация activeChatId с URL
  useEffect(() => {
    console.log('URL sync effect:', { urlChatId, activeChatId });
    if (urlChatId && urlChatId !== activeChatId) {
      console.log('Setting activeChatId from URL:', urlChatId);
      setActiveChatId(urlChatId);
    }
  }, [activeChatId, urlChatId]);
  
  const fetchChats = useCallback(async () => {
    console.log('fetchChats called');
    setIsChatsLoading(true);
    try {
      console.log('Making API request to getChats...');
      const fetchedChats = await apiClient.getChats();
      console.log('API response received:', {
        chatsCount: fetchedChats.length,
        chats: fetchedChats.map(c => ({ id: c.id, name: c.name, type: c.type }))
      });
      setChats(fetchedChats);
      
      // Проверяем текущий путь
      const isOnChatPage = window.location.pathname.startsWith('/app/chat');
      console.log('Current path analysis:', { 
        pathname: window.location.pathname, 
        isOnChatPage, 
        urlChatId,
        hasChats: fetchedChats.length > 0
      });
      
      // Если есть chatId в URL, используем его
      if (urlChatId && fetchedChats.some(chat => chat.id === urlChatId)) {
        console.log('Setting activeChatId from urlChatId:', urlChatId);
        setActiveChatId(urlChatId);
      } else if (fetchedChats.length > 0 && isOnChatPage && !urlChatId) {
        // Если мы на странице чатов без конкретного chatId, выбираем первый чат
        console.log('Auto-selecting first chat:', fetchedChats[0].id);
        setActiveChatId(fetchedChats[0].id);
        navigate(`/app/chat/${fetchedChats[0].id}`, { replace: true });
      } else {
        console.log('No auto-selection needed:', {
          hasChats: fetchedChats.length > 0,
          isOnChatPage,
          urlChatId: !!urlChatId
        });
      }
    } catch (error) {
      console.error("Failed to fetch chats:", error);
      console.error("Error details:", {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      });
      setChats([]);
    } finally {
      setIsChatsLoading(false);
      console.log('fetchChats completed');
    }
  }, [urlChatId, navigate]);

  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  const handleChatSelect = (chatId: string) => {
    console.log('handleChatSelect called with chatId:', chatId);
    
    // Сначала обновляем URL, потом activeChatId обновится через useEffect
    navigate(`/app/chat/${chatId}`);
    console.log('Navigate called to:', `/app/chat/${chatId}`);
  };

  const handleCreateChat = async (name: string) => {
    if (!user) return;
  
    setIsCreatingChat(true);
    try {
      const newChatData: CreateChatRequest = {
        name,
        description: '',
        type: 'group',
        participantIds: [user.id],
        isPrivate: false,
      };
      const createdChat = await apiClient.createChat(newChatData);
      
      setChats(prev => [createdChat, ...prev]);
      setActiveChatId(createdChat.id);
      navigate(`/app/chat/${createdChat.id}`);
      setIsCreateChatModalOpen(false);
    } catch (error) {
      console.error("Failed to create chat:", error);
    } finally {
      setIsCreatingChat(false);
    }
  };

  const handleSearchOpen = () => {
    setShowSearch(true);
  };

  const handleSearchClose = () => {
    setShowSearch(false);
  };

  const handleMessageSelect = (messageId: string) => {
    // TODO: Скроллим к найденному сообщению
    console.log('Scroll to message:', messageId);
    setShowSearch(false);
  };

  const activeChatData = chats.find(chat => chat.id === activeChatId);
  const filteredChats = chats.filter(chat => 
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Отладочный лог только при изменении важных состояний
  console.log('Current component state:', { 
    activeChatId, 
    activeChatData: activeChatData ? activeChatData.name : 'not found',
    chatsCount: chats.length,
    isChatsLoading,
    urlChatId,
    pathname: window.location.pathname
  });

  const formatTime = (timeStr?: string) => {
    if (!timeStr) return '';
    const date = new Date(timeStr);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`h-full flex gap-4 ${className} ${isDarkTheme ? 'chat-dark' : 'chat-light'} chat-themed theme-transition`}>
      {/* Левая панель - Список чатов */}
      <Card className="w-80 flex flex-col chat-gradient-bg chat-window-shadow border-border/50 backdrop-blur-sm theme-transition">
        {/* Шапка с поиском */}
        <div className="p-4 border-b border-border/30 chat-header-blur theme-transition">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Чаты</h2>
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="ghost" 
                className="h-8 w-8 p-0 hover:bg-primary/20 hover:scale-110 transition-all duration-200" 
                onClick={() => setIsCreateChatModalOpen(true)}
              >
                <Plus size={16} />
              </Button>
              <Button size="sm" variant="ghost" className="h-8 w-8 p-0 hover:bg-primary/20 hover:scale-110 transition-all duration-200">
                <Settings size={16} />
              </Button>
            </div>
          </div>
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Поиск чатов..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-background/80 border border-border/50 rounded-lg text-sm 
                       focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary
                       focus:chat-input-glow transition-all duration-200 backdrop-blur-sm"
            />
          </div>
        </div>
        
        {/* Список чатов */}
        <div className="flex-1 overflow-y-auto">
          {isChatsLoading ? (
            <div className="p-4 text-center text-muted-foreground">
              <Loader2 className="animate-spin mx-auto mb-2" size={24} />
              Загрузка чатов...
            </div>
          ) : filteredChats.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              {chats.length === 0 ? 'Нет чатов' : 'Нет результатов поиска'}
            </div>
          ) : (
            filteredChats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => handleChatSelect(chat.id)}
                className={`w-full text-left p-4 transition-all duration-200 border-b border-border/30 flex items-center gap-3
                          hover:bg-gradient-to-r hover:from-primary/10 hover:to-primary/5 hover:shadow-md hover:scale-[1.02]
                          ${chat.id === activeChatId 
                            ? 'bg-gradient-to-r from-primary/20 to-primary/10 shadow-md border-primary/20' 
                            : 'hover:border-primary/20'}`}
              >
                <Avatar 
                  size="md"
                  src={chat.avatarUrl}
                  username={chat.name}
                  alt={`Аватар ${chat.name}`}
                  className="transition-transform duration-200 hover:scale-105"
                  showStatus={true}
                  isOnline={getUserStatus(chat.id) === 'online'}
                />
                <div className="flex-1 overflow-hidden">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-sm truncate text-foreground">{chat.name}</h3>
                    {chat.lastMessage?.createdAt && (
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {formatTime(chat.lastMessage.createdAt)}
                      </span>
                    )}
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <p className="text-xs text-muted-foreground truncate">
                      {chat.lastMessage?.content ?? 'Нет сообщений'}
                    </p>
                    {(chat.unreadCount ?? 0) > 0 && (
                      <span className="bg-primary text-primary-foreground text-xs font-bold rounded-full px-2 py-0.5 
                                     animate-bounce-in shadow-lg">
                        {chat.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </Card>

      {/* Правая панель - Активный чат */}
      <div className="flex-1 flex flex-col">
        {activeChatId && activeChatData ? (
          <div className="flex flex-col h-full chat-gradient-bg chat-window-shadow rounded-lg border border-border/50 backdrop-blur-sm overflow-hidden">
            {/* Chat Header */}
            <div className="p-4 border-b border-border/30 chat-header-blur">
              <div className="flex items-center gap-3">
                <Avatar 
                  size="md"
                  src={activeChatData.avatarUrl}
                  username={activeChatData.name}
                  alt={`Аватар ${activeChatData.name}`}
                  showStatus={true}
                  isOnline={getUserStatus(activeChatData.id) === 'online'}
                  className="hover:scale-105 transition-transform duration-200"
                />
                <div className="flex-1">
                  <h2 className="font-semibold text-foreground">{activeChatData.name}</h2>
                  <p className="text-sm text-muted-foreground">
                    {activeChatData.participantsCount ?? 1} участников
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="h-8 w-8 p-0 hover:bg-primary/20 hover:scale-110 transition-all duration-200"
                    onClick={handleSearchOpen}
                    title="Поиск сообщений"
                  >
                    <Search size={16} />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="h-8 w-8 p-0 hover:bg-primary/20 hover:scale-110 transition-all duration-200"
                    onClick={() => setIsDarkTheme(!isDarkTheme)}
                    title={isDarkTheme ? "Светлая тема" : "Темная тема"}
                  >
                    {isDarkTheme ? <Sun size={16} /> : <Moon size={16} />}
                  </Button>
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0 hover:bg-primary/20 hover:scale-110 transition-all duration-200">
                    <Settings size={16} />
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex-1 flex flex-col overflow-hidden">
              <ChatMessageList 
                messages={messages} 
                isLoading={isLoadingMessages} 
                currentUserId={user?.id ?? ''} 
                className="flex-1 chat-message-shadow"
              />
              <TypingIndicator 
                typingUsers={typingUsers.filter(u => u.userId !== user?.id)} 
                className="px-4 py-2 border-t border-border/20" 
              />
            </div>
            <ChatInput 
              onSendMessage={sendMessage}
              onTyping={sendTypingNotification}
              onFileUpload={uploadFile}
              disabled={!activeChatId || isLoadingMessages}
              className="border-t border-border/30 chat-input-glow"
            />
          </div>
        ) : (
          <div className="flex items-center justify-center h-full chat-gradient-bg chat-window-shadow rounded-lg border border-border/50 text-muted-foreground backdrop-blur-sm">
            {isChatsLoading ? (
              <div className="text-center">
                <Loader2 className="animate-spin mx-auto mb-4" size={32} />
                <p>Загрузка чатов...</p>
              </div>
            ) : (
              <div className="text-center">
                <div className="mb-4 text-6xl opacity-50">💬</div>
                <p className="text-lg">Выберите чат, чтобы начать общение</p>
                <p className="text-sm mt-2 opacity-70">или создайте новый чат</p>
              </div>
            )}
          </div>
        )}
      </div>

      <CreateChatModal
        isOpen={isCreateChatModalOpen}
        onClose={() => setIsCreateChatModalOpen(false)}
        onCreateChat={handleCreateChat}
        isLoading={isCreatingChat}
      />
      
      {/* Search Modal */}
      {showSearch && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl max-h-[80vh]">
            <SearchMessages
              chatId={activeChatId || undefined}
              onMessageSelect={handleMessageSelect}
              onClose={handleSearchClose}
              className="w-full"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default FullChatInterface; 