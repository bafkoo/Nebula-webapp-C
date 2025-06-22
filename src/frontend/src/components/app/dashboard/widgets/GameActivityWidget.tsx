import React from 'react';
import { WidgetContainer } from '../WidgetContainer';
import { Button } from '../../../ui/Button';
import { Badge } from '../../../ui/Badge';
import { Avatar } from '../../../ui/Avatar';
import { GameControllerIcon } from '../../../icons';
import type { GameActivityData } from '../../../../types/dashboard';

// Mockup данные
const mockGameActivityData: GameActivityData = {
  currentGame: "CS:GO",
  isPlaying: true,
  sessionStartTime: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 часа назад
  friendsPlaying: [
    {
      id: "1",
      name: "Alex_Pro",
      game: "CS:GO",
      status: "В матче",
      joinable: true
    },
    {
      id: "2", 
      name: "GameMaster",
      game: "Dota 2",
      status: "В лобби",
      joinable: false
    },
    {
      id: "3",
      name: "Sniper_Elite",
      game: "CS:GO", 
      status: "В меню",
      joinable: true
    }
  ],
  popularGames: [
    {
      id: "csgo",
      name: "CS:GO",
      playersCount: 1250000,
      trending: true
    },
    {
      id: "dota2",
      name: "Dota 2", 
      playersCount: 850000,
      trending: false
    },
    {
      id: "valorant",
      name: "Valorant",
      playersCount: 650000,
      trending: true
    }
  ],
  recentActivity: [
    {
      id: "1",
      game: "CS:GO",
      action: "Победа в матче",
      timestamp: new Date(Date.now() - 30 * 60 * 1000)
    },
    {
      id: "2", 
      game: "CS:GO",
      action: "Присоединился к серверу",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
    }
  ]
};

interface GameActivityWidgetProps {
  animationDelay?: number;
}

export const GameActivityWidget: React.FC<GameActivityWidgetProps> = ({
  animationDelay = 0
}) => {
  const data = mockGameActivityData;

  const formatPlayTime = (sessionStart: Date) => {
    const diffMs = Date.now() - sessionStart.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const hours = Math.floor(diffMins / 60);
    const mins = diffMins % 60;
    
    if (hours > 0) {
      return `${hours}ч ${mins}м`;
    }
    return `${mins}м`;
  };

  return (
    <WidgetContainer
      id="game-activity"
      title="Игровая активность"
      icon={<GameControllerIcon size={20} className="text-primary" />}
      animationDelay={animationDelay}
    >
      <div className="space-y-4">
        {/* Текущая игра */}
        {data.currentGame && data.isPlaying && (
          <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-foreground">Сейчас играете</span>
              </div>
              <Badge variant="default" className="text-xs">
                {data.sessionStartTime && formatPlayTime(data.sessionStartTime)}
              </Badge>
            </div>
            <p className="font-semibold text-foreground text-lg">{data.currentGame}</p>
          </div>
        )}

        {/* Друзья в игре */}
        <div>
          <h4 className="text-sm font-medium text-foreground mb-3">Друзья в игре</h4>
          <div className="space-y-2">
            {data.friendsPlaying.slice(0, 3).map((friend) => (
              <div key={friend.id} className="flex items-center justify-between group">
                <div className="flex items-center space-x-3">
                  <Avatar 
                    username={friend.name}
                    size="sm"
                    showStatus={false}
                  />
                  <div>
                    <p className="text-sm font-medium text-foreground">{friend.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {friend.game} • {friend.status}
                    </p>
                  </div>
                </div>
                {friend.joinable && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  >
                    Присоединиться
                  </Button>
                )}
              </div>
            ))}
          </div>
          
          {data.friendsPlaying.length > 3 && (
            <Button variant="ghost" size="sm" className="w-full mt-2 text-xs">
              Показать еще {data.friendsPlaying.length - 3}
            </Button>
          )}
        </div>

        {/* Популярные игры */}
        <div>
          <h4 className="text-sm font-medium text-foreground mb-3">Популярные игры</h4>
          <div className="grid grid-cols-1 gap-2">
            {data.popularGames.slice(0, 3).map((game) => (
              <div 
                key={game.id} 
                className="flex items-center justify-between p-2 rounded-lg hover:bg-accent transition-colors duration-200 cursor-pointer"
              >
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-primary/20 rounded flex items-center justify-center">
                    <GameControllerIcon size={16} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{game.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(game.playersCount / 1000).toFixed(0)}K игроков
                    </p>
                  </div>
                </div>
                {game.trending && (
                  <Badge variant="default" className="text-xs">
                    🔥 Тренд
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </WidgetContainer>
  );
}; 