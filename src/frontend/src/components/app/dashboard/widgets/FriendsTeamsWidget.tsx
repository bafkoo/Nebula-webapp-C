import React, { useState, useEffect } from 'react';
import { Button } from '../../../ui/Button';
import { Badge } from '../../../ui/Badge';
import { Avatar } from '../../../ui/Avatar';
import { GroupUsersIcon, MicrophoneIcon, SettingsIcon, NotificationIcon } from '../../../icons';

// Локальные типы для независимости виджета
interface Friend {
  id: string;
  name: string;
  status: 'online' | 'ingame' | 'away' | 'dnd' | 'offline';
  currentGame?: string;
  avatar?: string;
  isVoice?: boolean;
  joinable?: boolean;
  lastSeen?: string;
}

interface Team {
  id: string;
  name: string;
  description?: string;
  memberCount: {
    total: number;
    online: number;
    voice: number;
  };
  role: 'owner' | 'admin' | 'member';
  isActive: boolean;
  hasActivity?: boolean;
  unreadMessages?: number;
}

interface PendingRequest {
  id: string;
  from: string;
  type: 'friend' | 'team';
  timestamp: Date;
  mutual: number;
  avatar?: string;
}

interface Notification {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning';
  duration?: number;
}

interface FriendsTeamsWidgetProps {
  animationDelay?: number;
}

export const FriendsTeamsWidget: React.FC<FriendsTeamsWidgetProps> = ({
  animationDelay = 0
}) => {
  const [activeTab, setActiveTab] = useState<'friends' | 'teams'>('friends');
  const [showAll, setShowAll] = useState(false);
  const [friends, setFriends] = useState<Friend[]>([
    {
      id: "1",
      name: "AlexGamer",
      status: "ingame",
      currentGame: "CS:GO",
      isVoice: true,
      joinable: true
    },
    {
      id: "2", 
      name: "ProStreamer",
      status: "online",
      isVoice: false,
      joinable: false
    },
    {
      id: "3",
      name: "TeamLead",
      status: "dnd",
      currentGame: "В голосовом канале",
      isVoice: true,
      joinable: true
    },
    {
      id: "4",
      name: "NightOwl",
      status: "away",
      lastSeen: "2ч назад"
    },
    {
      id: "5",
      name: "Sniper95",
      status: "offline",
      lastSeen: "Вчера в 23:45"
    },
    {
      id: "6",
      name: "GameMaster",
      status: "ingame",
      currentGame: "Valorant",
      joinable: false
    }
  ]);

  const [teams, setTeams] = useState<Team[]>([
    {
      id: "1",
      name: "Elite Squad",
      description: "Профессиональная киберспорт команда",
      memberCount: { total: 5, online: 3, voice: 2 },
      role: "admin",
      isActive: true,
      hasActivity: true,
      unreadMessages: 5
    },
    {
      id: "2",
      name: "Casual Gamers", 
      description: "Для расслабленных игр",
      memberCount: { total: 12, online: 7, voice: 0 },
      role: "member",
      isActive: true,
      hasActivity: false,
      unreadMessages: 0
    },
    {
      id: "3",
      name: "Tournament Hunters",
      description: "Охотимся за призами!",
      memberCount: { total: 8, online: 2, voice: 1 },
      role: "owner",
      isActive: true,
      hasActivity: true,
      unreadMessages: 12
    }
  ]);

  const [pendingRequests, setPendingRequests] = useState<PendingRequest[]>([
    {
      id: "1",
      from: "NewPlayer123",
      type: "friend",
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      mutual: 2
    },
    {
      id: "2",
      from: "Pro Team Alpha",
      type: "team",
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      mutual: 0
    }
  ]);

  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Показать уведомление
  const showNotification = (message: string, type: Notification['type'] = 'info', duration = 3000) => {
    const id = Date.now().toString();
    const notification: Notification = { id, message, type, duration };
    setNotifications(prev => [...prev, notification]);
    
    if (duration > 0) {
      setTimeout(() => {
        setNotifications(prev => prev.filter(n => n.id !== id));
      }, duration);
    }
  };

  // Симуляция real-time обновлений статусов
  useEffect(() => {
    const interval = setInterval(() => {
      setFriends(prev => prev.map(friend => {
        // Случайное изменение статуса для симуляции активности
        if (Math.random() < 0.1) {
          const statuses: Friend['status'][] = ['online', 'ingame', 'away', 'dnd'];
          const newStatus = statuses[Math.floor(Math.random() * statuses.length)];
          
          if (newStatus !== friend.status) {
            const statusText = {
              'online': 'онлайн',
              'ingame': 'в игре',
              'away': 'отошел',
              'dnd': 'не беспокоить',
              'offline': 'не в сети'
            }[newStatus];
            
            setTimeout(() => {
              showNotification(`${friend.name} теперь ${statusText}`, 'info');
            }, 500);
          }
          
          return { ...friend, status: newStatus };
        }
        return friend;
      }));
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  // Симуляция новых уведомлений
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() < 0.3) {
        const events = [
          'ProStreamer начал стрим Dota 2',
          'TeamLead создал новое лобби в CS:GO',
          'AlexGamer достиг нового звания!',
          'Elite Squad выиграла турнир!'
        ];
        
        const randomEvent = events[Math.floor(Math.random() * events.length)];
        showNotification(randomEvent, 'success');
      }
    }, 25000);

    return () => clearInterval(interval);
  }, []);

  const getStatusInfo = (status: Friend['status']) => {
    switch (status) {
      case 'online': return { color: 'bg-green-500', text: 'В сети' };
      case 'ingame': return { color: 'bg-blue-500', text: 'В игре' };
      case 'away': return { color: 'bg-yellow-500', text: 'Отошел' };
      case 'dnd': return { color: 'bg-red-500', text: 'Не беспокоить' };
      case 'offline': return { color: 'bg-gray-500', text: 'Не в сети' };
      default: return { color: 'bg-gray-500', text: 'Неизвестно' };
    }
  };

  const handleJoinFriend = (friend: Friend) => {
    if (friend.joinable) {
      showNotification(`Присоединяюсь к ${friend.name}...`, 'info');
      setTimeout(() => {
        showNotification(`Успешно присоединился к ${friend.name}!`, 'success');
      }, 1500);
    }
  };

  const handleVoiceJoin = (friend: Friend) => {
    showNotification(`Подключаюсь к голосовому каналу ${friend.name}...`, 'info');
    setTimeout(() => {
      showNotification(`Подключен к голосовому каналу!`, 'success');
    }, 1000);
  };

  const handleTeamOpen = (team: Team) => {
    showNotification(`Открываю команду ${team.name}...`, 'info');
    // Сбрасываем непрочитанные сообщения
    setTeams(prev => prev.map(t => 
      t.id === team.id ? { ...t, unreadMessages: 0 } : t
    ));
  };

  const handleAcceptRequest = (request: PendingRequest) => {
    showNotification(`Приглашение от ${request.from} принято!`, 'success');
    setPendingRequests(prev => prev.filter(r => r.id !== request.id));
  };

  const handleDeclineRequest = (request: PendingRequest) => {
    showNotification(`Приглашение от ${request.from} отклонено`, 'info');
    setPendingRequests(prev => prev.filter(r => r.id !== request.id));
  };

  const onlineFriends = friends.filter(f => f.status !== 'offline');
  const offlineFriends = friends.filter(f => f.status === 'offline');
  const displayFriends = activeTab === 'friends' 
    ? (showAll ? friends : [...onlineFriends.slice(0, 3), ...offlineFriends.slice(0, 1)])
    : [];

  return (
    <div 
      className="bg-card/95 backdrop-blur-sm border border-border rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300"
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      {/* Заголовок с индикаторами */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-primary/20 rounded-lg">
            <GroupUsersIcon size={20} className="text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">Друзья и команды</h3>
            <p className="text-xs text-muted-foreground">
              {onlineFriends.length} друзей в сети
            </p>
          </div>
        </div>
        
        {/* Уведомления */}
        {pendingRequests.length > 0 && (
          <div className="relative">
            <NotificationIcon size={16} className="text-blue-400" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
              {pendingRequests.length}
            </span>
          </div>
        )}
      </div>

      {/* Live уведомления */}
      {notifications.length > 0 && (
        <div className="space-y-1 mb-3">
          {notifications.slice(-2).map((notification) => (
            <div
              key={notification.id}
              className={`p-2 rounded-lg text-xs animate-slide-in-right ${
                notification.type === 'success' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                notification.type === 'warning' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                'bg-blue-500/20 text-blue-400 border border-blue-500/30'
              }`}
            >
              {notification.message}
            </div>
          ))}
        </div>
      )}

      {/* Pending Requests */}
      {pendingRequests.length > 0 && (
        <div className="mb-4 space-y-2">
          <h4 className="text-xs font-medium text-blue-400 flex items-center gap-1">
            <NotificationIcon size={12} />
            Новые приглашения ({pendingRequests.length})
          </h4>
          {pendingRequests.slice(0, 2).map((request) => (
            <div key={request.id} className="p-2 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-foreground">{request.from}</p>
                  <p className="text-xs text-muted-foreground">
                    {request.type === 'friend' ? 'Заявка в друзья' : 'Приглашение в команду'}
                    {request.mutual > 0 && ` • ${request.mutual} общих друзей`}
                  </p>
                </div>
                <div className="flex gap-1">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 px-2 text-xs text-green-400 hover:bg-green-500/20"
                    onClick={() => handleAcceptRequest(request)}
                  >
                    ✓
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-6 px-2 text-xs text-red-400 hover:bg-red-500/20"
                    onClick={() => handleDeclineRequest(request)}
                  >
                    ✗
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Табы */}
      <div className="flex space-x-1 bg-muted/50 rounded-lg p-1 mb-4">
        <button
          onClick={() => setActiveTab('friends')}
          className={`flex-1 py-2 px-3 rounded-md text-xs font-medium transition-all duration-200 ${
            activeTab === 'friends'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Друзья ({onlineFriends.length}/{friends.length})
        </button>
        <button
          onClick={() => setActiveTab('teams')}
          className={`flex-1 py-2 px-3 rounded-md text-xs font-medium transition-all duration-200 ${
            activeTab === 'teams'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Команды ({teams.length})
        </button>
      </div>

      {/* Контент табов */}
      <div className="space-y-2 min-h-[120px]">
        {activeTab === 'friends' && (
          <div className="space-y-1">
            {displayFriends.map((friend) => {
              const statusInfo = getStatusInfo(friend.status);
              return (
                <div 
                  key={friend.id}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-accent/50 transition-all duration-200 group"
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Avatar
                        src={friend.avatar}
                        alt={friend.name}
                        username={friend.name}
                        size="sm"
                        showStatus={false}
                      />
                      <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 ${statusInfo.color} rounded-full border-2 border-background`} />
                      {friend.isVoice && (
                        <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border border-background flex items-center justify-center">
                          <MicrophoneIcon size={8} className="text-white" />
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{friend.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {friend.currentGame || statusInfo.text}
                        {friend.status === 'offline' && friend.lastSeen && ` • ${friend.lastSeen}`}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    {friend.isVoice && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="h-6 px-2 text-xs text-green-400 hover:bg-green-500/20"
                        onClick={() => handleVoiceJoin(friend)}
                      >
                        🎤
                      </Button>
                    )}
                    {friend.joinable && friend.status !== 'offline' && (
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="h-6 px-2 text-xs"
                        onClick={() => handleJoinFriend(friend)}
                      >
                        Играть
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
            
            {friends.length > 4 && (
              <div className="text-center">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setShowAll(!showAll)}
                  className="text-xs text-primary"
                >
                  {showAll ? 'Скрыть' : `Показать еще ${friends.length - 4}`}
                </Button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'teams' && (
          <div className="space-y-2">
            {teams.map((team) => (
              <div 
                key={team.id}
                className="p-3 bg-accent/30 rounded-lg border border-border/50 hover:bg-accent/50 transition-all duration-200 group cursor-pointer"
                onClick={() => handleTeamOpen(team)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center relative">
                      <span className="text-sm font-bold">
                        {team.name.split(' ').map(w => w[0]).join('').toUpperCase()}
                      </span>
                      {team.hasActivity && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border border-background" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-1">
                        <p className="text-sm font-medium text-foreground">{team.name}</p>
                        {team.role === 'owner' && (
                          <Badge variant="default" className="text-xs bg-yellow-500/20 text-yellow-400">
                            Владелец
                          </Badge>
                        )}
                        {team.role === 'admin' && (
                          <Badge variant="default" className="text-xs bg-blue-500/20 text-blue-400">
                            Админ
                          </Badge>
                        )}
                        {(team.unreadMessages ?? 0) > 0 && (
                          <span className="bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                            {(team.unreadMessages ?? 0) > 9 ? '9+' : team.unreadMessages}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {team.memberCount.online}/{team.memberCount.total} онлайн
                        {team.memberCount.voice > 0 && ` • ${team.memberCount.voice} в голосе`}
                      </p>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-xs"
                  >
                    Открыть
                  </Button>
                </div>
                
                {team.description && (
                  <p className="text-xs text-muted-foreground mt-1 opacity-75">
                    {team.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Быстрые действия */}
      <div className="pt-3 border-t border-border mt-4">
        <div className="flex space-x-2">
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex-1 text-xs flex items-center gap-1 hover:bg-primary/20"
            onClick={() => showNotification('Открываю поиск друзей...', 'info')}
          >
            <GroupUsersIcon size={12} />
            Найти друзей
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex-1 text-xs flex items-center gap-1 hover:bg-primary/20"
            onClick={() => showNotification('Открываю настройки...', 'info')}
          >
            <SettingsIcon size={12} />
            Настройки
          </Button>
        </div>
      </div>
    </div>
  );
}; 