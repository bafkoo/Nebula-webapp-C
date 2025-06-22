import React, { useState } from 'react';
import { WidgetContainer } from '../WidgetContainer';
import { Button } from '../../../ui/Button';
import { Badge } from '../../../ui/Badge';
import { Avatar } from '../../../ui/Avatar';
import { GroupUsersIcon, SearchMagnifyIcon, MailIcon, NotificationIcon } from '../../../icons';
import type { FriendsTeamsData } from '../../../../types/dashboard';

// Mockup данные
const mockFriendsTeamsData: FriendsTeamsData = {
  onlineFriends: [
    {
      id: "friend1",
      name: "AlexGamer",
      status: "играет в CS:GO",
      isOnline: true,
      currentGame: "CS:GO",
      mutual: true
    },
    {
      id: "friend2", 
      name: "ProPlayer99",
      status: "стримит",
      isOnline: true,
      currentGame: "Valorant",
      mutual: false
    },
    {
      id: "friend3",
      name: "TeamLead",
      status: "отошел",
      isOnline: false,
      mutual: true
    }
  ],
  offlineFriends: [],
  teams: [
    {
      id: "team1",
      name: "Elite Squad",
      memberCount: {
        total: 5,
        online: 3
      },
      role: "member",
      isActive: true
    },
    {
      id: "team2",
      name: "Pro Gamers", 
      memberCount: {
        total: 12,
        online: 7
      },
      role: "admin",
      isActive: true
    }
  ],
  pendingRequests: [
    {
      id: "invite1",
      from: "NewPlayer",
      timestamp: new Date(Date.now() - 10 * 60 * 1000), // 10 минут назад
      mutual: 0
    }
  ]
};

interface FriendsTeamsWidgetProps {
  animationDelay?: number;
}

export const FriendsTeamsWidget: React.FC<FriendsTeamsWidgetProps> = ({
  animationDelay = 0
}) => {
  const [activeTab, setActiveTab] = useState<'friends' | 'teams'>('friends');
  const data = mockFriendsTeamsData;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'играет в CS:GO':
      case 'стримит': return 'bg-green-500';
      case 'в чате': return 'bg-blue-500';
      case 'отошел': return 'bg-yellow-500';
      case 'офлайн': 
      default: return 'bg-gray-500';
    }
  };

  return (
    <WidgetContainer
      id="friends-teams"
      title="Друзья и команды"
      icon={<GroupUsersIcon size={20} className="text-primary" />}
      animationDelay={animationDelay}
    >
      <div className="space-y-4">
        
        {/* Табы */}
        <div className="flex space-x-1 bg-muted/50 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('friends')}
            className={`flex-1 py-2 px-3 rounded-md text-xs font-medium transition-all duration-200 ${
              activeTab === 'friends'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Друзья ({data.onlineFriends.length})
          </button>
          <button
            onClick={() => setActiveTab('teams')}
            className={`flex-1 py-2 px-3 rounded-md text-xs font-medium transition-all duration-200 ${
              activeTab === 'teams'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Команды ({data.teams.length})
          </button>
        </div>

        {/* Уведомления о приглашениях */}
        {data.pendingRequests.length > 0 && (
          <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-blue-400 flex items-center gap-1">
                <NotificationIcon size={14} />
                {data.pendingRequests.length} новых приглашений
              </span>
              <Button variant="ghost" size="sm" className="text-xs h-6 px-2">
                Просмотреть
              </Button>
            </div>
          </div>
        )}

        {/* Контент табов */}
        {activeTab === 'friends' && (
          <div className="space-y-2">
            {data.onlineFriends.slice(0, 3).map((friend) => (
              <div 
                key={friend.id}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-accent transition-colors duration-200 group"
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
                    <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 ${getStatusColor(friend.status)} rounded-full border-2 border-background`}></div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{friend.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {friend.currentGame ? friend.currentGame : friend.status}
                    </p>
                  </div>
                </div>
                {friend.currentGame && friend.isOnline && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-xs"
                  >
                    Присоединиться
                  </Button>
                )}
              </div>
            ))}
            
            {data.onlineFriends.length === 0 && (
              <div className="text-center py-6">
                <div className="text-3xl mb-2">😴</div>
                <p className="text-sm text-muted-foreground">Друзья не в сети</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'teams' && (
          <div className="space-y-2">
            {data.teams.map((team) => (
              <div 
                key={team.id}
                className="p-3 bg-accent/30 rounded-lg border border-border/50 hover:bg-accent/50 transition-colors duration-200 group cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                      <span className="text-sm font-bold">
                        {team.name.split(' ').map(w => w[0]).join('').toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground flex items-center gap-1">
                        {team.name}
                        {team.role === 'admin' && (
                          <Badge variant="default" className="text-xs">
                            Админ
                          </Badge>
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {team.memberCount.online}/{team.memberCount.total} онлайн
                      </p>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  >
                    Открыть
                  </Button>
                </div>
              </div>
            ))}
            
            {data.teams.length === 0 && (
              <div className="text-center py-6">
                <div className="text-3xl mb-2">👥</div>
                <p className="text-sm text-muted-foreground">Нет команд</p>
                <Button variant="ghost" size="sm" className="mt-2 text-xs">
                  Создать команду
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Быстрые действия */}
        <div className="pt-2 border-t border-border">
          <div className="flex space-x-2">
            <Button variant="ghost" size="sm" className="flex-1 text-xs flex items-center gap-1">
              <SearchMagnifyIcon size={14} />
              Найти друзей
            </Button>
            <Button variant="ghost" size="sm" className="flex-1 text-xs flex items-center gap-1">
              <MailIcon size={14} />
              Пригласить друзей
            </Button>
          </div>
        </div>
      </div>
    </WidgetContainer>
  );
}; 