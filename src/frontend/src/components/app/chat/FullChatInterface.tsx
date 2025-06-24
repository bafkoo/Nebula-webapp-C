import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { Plus, Search, Settings, Loader2 } from 'lucide-react';
import ChatMessageList from './ChatMessageList';
import ChatInput from './ChatInput';
import TypingIndicator from './TypingIndicator';
import { useChat } from '../../../hooks/app/useChat';
import { useAuth } from '../../../hooks/useAuth';
import type { ChatDto, CreateChatRequest } from '../../../types/chat';
import { apiClient } from '../../../lib/api';
import { CreateChatModal } from './CreateChatModal';
import { Avatar } from '../../ui/Avatar';

interface FullChatInterfaceProps {
  className?: string;
}

const FullChatInterface: React.FC<FullChatInterfaceProps> = ({ className = "" }) => {
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [chats, setChats] = useState<ChatDto[]>([]);
  const [isChatsLoading, setIsChatsLoading] = useState(true);
  const [isCreatingChat, setIsCreatingChat] = useState(false);
  const [isCreateChatModalOpen, setIsCreateChatModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const navigate = useNavigate();
  const { chatId: urlChatId } = useParams<{ chatId: string }>();
  const { user } = useAuth();

  const { 
    messages, 
    sendMessage, 
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
    <div className={`h-full flex gap-4 ${className}`}>
      {/* Левая панель - Список чатов */}
      <Card className="w-80 flex flex-col bg-card border-border">
        {/* Шапка с поиском */}
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
                className={`w-full text-left p-4 hover:bg-muted transition-colors border-b border-border/50 flex items-center gap-3 ${
                  chat.id === activeChatId ? 'bg-muted' : ''
                }`}
              >
                <Avatar 
                  size="md"
                  src={chat.avatarUrl}
                  username={chat.name}
                  alt={`Аватар ${chat.name}`}
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
                      <span className="bg-primary text-primary-foreground text-xs font-bold rounded-full px-2 py-0.5">
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
          <div className="flex flex-col h-full bg-card rounded-lg border border-border">
            {/* ... (Chat Header can be implemented here) */}
            <div className="flex-1 flex flex-col overflow-hidden p-4">
              <ChatMessageList 
                messages={messages} 
                isLoading={isLoadingMessages} 
                currentUserId={user?.id ?? ''} 
                className="flex-1"
              />
              <TypingIndicator typingUsers={typingUsers.filter(u => u.userId !== user?.id)} className="px-4 py-2" />
            </div>
            <ChatInput 
              onSendMessage={sendMessage}
              onTyping={sendTypingNotification}
              disabled={!activeChatId || isLoadingMessages}
              className="border-t border-border"
            />
          </div>
        ) : (
          <div className="flex items-center justify-center h-full bg-card rounded-lg border border-border text-muted-foreground">
            {isChatsLoading ? (
              <Loader2 className="animate-spin" size={32} />
            ) : (
              <span>Выберите чат, чтобы начать общение</span>
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
    </div>
  );
};

export default FullChatInterface; 