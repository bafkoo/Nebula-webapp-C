import React, { useState } from 'react';
import { WidgetContainer } from '../WidgetContainer';
import { Button } from '../../../ui/Button';
import { Badge } from '../../../ui/Badge';
import { TargetIcon, DiscordCounterIcon } from '../../../icons';
import type { LobbiesData, Lobby } from '../../../../types/dashboard';

// Mockup данные
const mockLobbiesData: LobbiesData = {
  activeLobbies: [
    {
      id: "1",
      name: "CS2 Competitive",
      game: "CS2",
      mode: "Competitive",
      players: { current: 8, max: 10 },
      skillLevel: "Золото",
      isPrivate: false,
      hasPassword: false,
      host: "ProGamer_2024",
      createdAt: new Date(Date.now() - 15 * 60 * 1000),
      canJoin: true
    },
    {
      id: "2", 
      name: "Valorant Ranked",
      game: "Valorant",
      mode: "Ranked",
      players: { current: 3, max: 5 },
      skillLevel: "Платина",
      isPrivate: false,
      hasPassword: false,
      host: "TacticalShooter",
      createdAt: new Date(Date.now() - 8 * 60 * 1000),
      canJoin: true
    },
    {
      id: "3",
      name: "Dota 2 Casual",
      game: "Dota 2", 
      mode: "All Pick",
      players: { current: 7, max: 10 },
      skillLevel: "Любой",
      isPrivate: true,
      hasPassword: true,
      host: "MidLaner_Pro",
      createdAt: new Date(Date.now() - 25 * 60 * 1000),
      canJoin: false
    },
    {
      id: "4",
      name: "Apex Legends Trio",
      game: "Apex Legends",
      mode: "Trios",
      players: { current: 2, max: 3 },
      skillLevel: "Алмаз",
      isPrivate: false,
      hasPassword: false,
      host: "ApexPredator",
      createdAt: new Date(Date.now() - 5 * 60 * 1000),
      canJoin: true
    }
  ],
  myLobbies: [
    {
      id: "my-1",
      name: "Моё лобби CS2",
      game: "CS2",
      mode: "Wingman",
      players: { current: 1, max: 4 },
      skillLevel: "Серебро",
      isPrivate: false,
      hasPassword: false,
      host: "Вы",
      createdAt: new Date(Date.now() - 2 * 60 * 1000),
      canJoin: true
    }
  ],
  invitations: [
    {
      id: "inv-1",
      lobbyId: "friend-lobby-1",
      from: "BestFriend_123",
      timestamp: new Date(Date.now() - 3 * 60 * 1000),
      expiresAt: new Date(Date.now() + 12 * 60 * 1000)
    }
  ],
  quickMatch: {
    enabled: true,
    preferredGames: ["CS2", "Valorant"],
    skillRange: "similar",
    serverRegion: "EU West"
  }
};

interface GamingLobbiesWidgetProps {
  animationDelay?: number;
}

export const GamingLobbiesWidget: React.FC<GamingLobbiesWidgetProps> = ({
  animationDelay = 0
}) => {
  const data = mockLobbiesData;
  const [activeTab, setActiveTab] = useState<'browse' | 'my' | 'invites'>('browse');

  const formatTimeAgo = (date: Date) => {
    const diffMs = Date.now() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 1) return 'только что';
    if (diffMins < 60) return `${diffMins}м назад`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}ч назад`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}д назад`;
  };

  const getGameColor = (game: string) => {
    const colors: { [key: string]: string } = {
      'CS2': 'text-orange-400',
      'Valorant': 'text-red-400', 
      'Dota 2': 'text-blue-400',
      'Apex Legends': 'text-purple-400'
    };
    return colors[game] || 'text-primary';
  };

  const renderLobbyItem = (lobby: Lobby, showHost = true) => (
    <div 
      key={lobby.id}
      className="p-3 rounded-lg border border-border hover:border-primary/30 transition-colors duration-200"
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <span className={`text-sm font-medium ${getGameColor(lobby.game)}`}>
            {lobby.game}
          </span>
          <span className="text-xs text-muted-foreground">•</span>
          <span className="text-xs text-muted-foreground">{lobby.mode}</span>
        </div>
        <div className="flex items-center space-x-2">
          <DiscordCounterIcon 
            count={lobby.players.current} 
            maxLimit={lobby.players.max}
            size={32}
          />
          {lobby.isPrivate && (
            <Badge variant="warning" className="text-xs">
              🔒 Приватное
            </Badge>
          )}
        </div>
      </div>
      
      <h5 className="font-medium text-foreground mb-1">{lobby.name}</h5>
      
      <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
        {showHost && (
          <span>Хост: {lobby.host}</span>
        )}
        <span>{formatTimeAgo(lobby.createdAt)}</span>
      </div>
      
      <div className="flex items-center justify-between">
        <Badge variant="default" className="text-xs">
          {lobby.skillLevel}
        </Badge>
        {lobby.canJoin ? (
          <Button variant="primary" size="sm" className="h-7 px-3 text-xs">
            Присоединиться
          </Button>
        ) : (
          <Button variant="ghost" size="sm" className="h-7 px-3 text-xs" disabled>
            Недоступно
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <WidgetContainer
      id="gaming-lobbies"
      title="Игровые лобби"
      icon={<TargetIcon size={20} className="text-primary" />}
      animationDelay={animationDelay}
    >
      <div className="space-y-4">
        {/* Быстрый матчмейкинг */}
        {data.quickMatch.enabled && (
          <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">Быстрый поиск</span>
              <Badge variant="default" className="text-xs">
                {data.quickMatch.skillRange === 'similar' ? 'Похожий уровень' : 'Любой'}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              {data.quickMatch.preferredGames.join(', ')} • {data.quickMatch.serverRegion}
            </p>
            <Button variant="primary" size="sm" className="w-full">
              🎯 Найти матч
            </Button>
          </div>
        )}

        {/* Приглашения */}
        {data.invitations.length > 0 && (
          <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">Приглашения</span>
              <Badge variant="warning" className="text-xs text-blue-400">
                {data.invitations.length}
              </Badge>
            </div>
            {data.invitations.slice(0, 1).map((invite) => (
              <div key={invite.id} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">{invite.from}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatTimeAgo(invite.timestamp)}
                  </p>
                </div>
                <div className="flex space-x-1">
                  <Button variant="primary" size="sm" className="h-7 px-2 text-xs">
                    ✓
                  </Button>
                  <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                    ✕
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Табы */}
        <div className="flex space-x-1 p-1 bg-muted rounded-lg">
          <button
            onClick={() => setActiveTab('browse')}
            className={`flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-colors duration-200 ${
              activeTab === 'browse' 
                ? 'bg-background text-foreground shadow-sm' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Обзор ({data.activeLobbies.length})
          </button>
          <button
            onClick={() => setActiveTab('my')}
            className={`flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-colors duration-200 ${
              activeTab === 'my' 
                ? 'bg-background text-foreground shadow-sm' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Мои ({data.myLobbies.length})
          </button>
        </div>

        {/* Контент табов */}
        <div className="space-y-3">
          {activeTab === 'browse' && (
            <>
              {data.activeLobbies.slice(0, 3).map((lobby) => renderLobbyItem(lobby))}
              {data.activeLobbies.length > 3 && (
                <Button variant="ghost" size="sm" className="w-full text-xs">
                  Показать еще {data.activeLobbies.length - 3} лобби
                </Button>
              )}
            </>
          )}

          {activeTab === 'my' && (
            <>
              {data.myLobbies.length > 0 ? (
                data.myLobbies.map((lobby) => renderLobbyItem(lobby, false))
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-muted-foreground mb-3">
                    У вас нет активных лобби
                  </p>
                  <Button variant="primary" size="sm">
                    Создать лобби
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </WidgetContainer>
  );
}; 