import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { Plus, Search, Settings, Users, Loader2 } from 'lucide-react';
import ChatMessageList from './ChatMessageList';
import ChatInput from './ChatInput';
import TypingIndicator from './TypingIndicator';
import { useChat } from '../../../hooks/app/useChat';
import { useAuth } from '../../../hooks/useAuth';
import type { ChatDto, CreateChatRequest } from '../../../types/chat';
import { apiClient } from '../../../lib/api';
import { CreateChatModal } from './CreateChatModal';

interface FullChatInterfaceProps {
  className?: string;
}

const FullChatInterface: React.FC<FullChatInterfaceProps> = ({ className = "" }) => {
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [chats, setChats] = useState<ChatDto[]>([]);
  const [isChatsLoading, setIsChatsLoading] = useState(true);
  const [isCreatingChat, setIsCreatingChat] = useState(false);
  const [isCreateChatModalOpen, setIsCreateChatModalOpen] = useState(false);
  const [isTyping] = useState(false); // TODO: implement typing indicator logic
  const [searchQuery, setSearchQuery] = useState('');
  
  const navigate = useNavigate();
  const { chatId: urlChatId } = useParams<{ chatId: string }>();
  const { user } = useAuth();

  const { messages, sendMessage, isLoading: isLoadingMessages } = useChat(activeChatId);
  
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

  const formatTime = (timeStr?: string) => timeStr || '';

  return (
    <div className={`h-full flex gap-4 ${className}`}>
      {/* Левая панель - Список чатов */}
      <Card className="w-80 flex flex-col bg-card border-border">
        {/* Заголовок чатов */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Чаты</h2>
            <div className="flex gap-2">
              <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => setIsCreateChatModalOpen(true)}>
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
                className={`w-full text-left p-4 hover:bg-muted transition-colors border-b border-border/50 ${
                  chat.id === activeChatId ? 'bg-muted' : ''
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
            ))
          )}
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
            <div className="flex-1 flex flex-col min-h-0 relative">
              {isLoadingMessages && (
                <div className="absolute inset-0 bg-card/50 flex items-center justify-center z-10">
                  <Loader2 className="animate-spin text-primary" size={40} />
                </div>
              )}
              <ChatMessageList 
                messages={messages}
                isLoading={isLoadingMessages}
                currentUserId={user?.id || ''}
                className="flex-1"
              />
              {isTyping && <TypingIndicator className="px-4 py-2" />}
            </div>

            {/* Поле ввода */}
            <ChatInput 
              onSendMessage={sendMessage}
              disabled={isLoadingMessages || !activeChatId}
              className="border-t border-border"
            />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              {isChatsLoading ? (
                <>
                  <Loader2 className="animate-spin text-primary mb-4" size={32} />
                  <h3 className="text-lg font-medium">Загрузка чатов...</h3>
                </>
              ) : (
                <>
                  <div className="text-4xl mb-4">💬</div>
                  <h3 className="text-lg font-medium mb-2">Выберите чат</h3>
                  <p className="text-sm">Выберите существующий чат или создайте новый</p>
                </>
              )}
            </div>
          </div>
        )}
      </Card>

      <CreateChatModal
        isOpen={isCreateChatModalOpen}
        onClose={() => setIsCreateChatModalOpen(false)}
        onCreateChat={handleCreateChat}
        isLoading={isCreatingChat}
      />
    </div>
  );
};

export default FullChatInterface; 