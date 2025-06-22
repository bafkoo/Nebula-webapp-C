import React from 'react';
import { WidgetContainer } from '../WidgetContainer';
import { Button } from '../../../ui/Button';
import { LightningIcon } from '../../../icons';
import type { QuickConnectionsData } from '../../../../types/dashboard';

// Mockup данные
const mockQuickConnectionsData: QuickConnectionsData = {
  favoriteServers: [
    {
      id: "1",
      name: "Pro Gamers",
      game: "CS:GO",
      playerCount: {
        online: 12,
        total: 50
      },
      ping: 25,
      favorite: true,
      hasPassword: false
    },
    {
      id: "2",
      name: "CS:GO RU Official",
      game: "CS:GO", 
      playerCount: {
        online: 45,
        total: 100
      },
      ping: 18,
      favorite: true,
      hasPassword: false
    },
    {
      id: "3",
      name: "Elite Squad",
      game: "Valorant",
      playerCount: {
        online: 8,
        total: 20
      },
      ping: 32,
      favorite: true,
      hasPassword: true
    }
  ],
  recentServers: [
    {
      id: "recent1",
      name: "Team Meeting",
      game: "Discord Voice",
      lastJoined: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 часа назад
      duration: 45 // минут
    },
    {
      id: "recent2", 
      name: "Dota 2 Community",
      game: "Dota 2",
      lastJoined: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 часа назад
      duration: 120 // минут
    }
  ],
  quickJoinEnabled: true
};

interface QuickConnectionsWidgetProps {
  animationDelay?: number;
}

export const QuickConnectionsWidget: React.FC<QuickConnectionsWidgetProps> = ({
  animationDelay = 0
}) => {
  const data = mockQuickConnectionsData;

  const formatLastJoined = (date: Date) => {
    const diffMs = Date.now() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffHours > 0) {
      return `${diffHours}ч назад`;
    }
    return `${diffMins}м назад`;
  };

  const getPingColor = (ping: number) => {
    if (ping <= 30) return 'text-green-500';
    if (ping <= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getServerIcon = (game: string) => {
    switch (game) {
      case 'CS:GO': return '🔫';
      case 'Valorant': return '🎯';
      case 'Dota 2': return '⚔️';
      case 'Discord Voice': return '🎤';
      default: return '🎮';
    }
  };

  return (
    <WidgetContainer
      id="quick-connections"
      title="Быстрые подключения"
      icon={<LightningIcon size={20} className="text-primary" />}
      animationDelay={animationDelay}
    >
      <div className="space-y-4">
        
        {/* Избранные серверы */}
        <div>
          <h4 className="text-sm font-medium text-foreground mb-3">Избранные серверы</h4>
          <div className="space-y-2">
            {data.favoriteServers.slice(0, 2).map((server) => (
              <div 
                key={server.id} 
                className="p-3 bg-accent/30 rounded-lg border border-border/50 hover:bg-accent/50 transition-colors duration-200 group cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">{getServerIcon(server.game)}</span>
                    <div>
                      <p className="text-sm font-medium text-foreground flex items-center gap-1">
                        {server.name}
                        {server.hasPassword && (
                          <svg className="w-3 h-3 text-muted-foreground" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground">{server.game}</p>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  >
                    Подключиться
                  </Button>
                </div>
                
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-3">
                    <span className="text-muted-foreground">
                      👥 {server.playerCount.online}/{server.playerCount.total}
                    </span>
                    <span className={`font-mono ${getPingColor(server.ping)}`}>
                      {server.ping}ms
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-green-500 text-xs">Онлайн</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {data.favoriteServers.length > 2 && (
            <Button variant="ghost" size="sm" className="w-full mt-2 text-xs">
              Показать еще {data.favoriteServers.length - 2}
            </Button>
          )}
        </div>

        {/* Недавние подключения */}
        <div>
          <h4 className="text-sm font-medium text-foreground mb-3">Недавние</h4>
          <div className="space-y-2">
            {data.recentServers.map((server) => (
              <div 
                key={server.id}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-accent transition-colors duration-200 group"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-base">{getServerIcon(server.game)}</span>
                  <div>
                    <p className="text-sm font-medium text-foreground">{server.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatLastJoined(server.lastJoined)} • {server.duration}м
                    </p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-xs"
                >
                  Повторить
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Быстрое подключение */}
        {data.quickJoinEnabled && (
          <div className="pt-2 border-t border-border">
            <Button 
              variant="primary" 
              size="sm" 
              className="w-full text-sm"
            >
              🚀 Быстрое подключение
            </Button>
          </div>
        )}
      </div>
    </WidgetContainer>
  );
}; 