import React, { useState, useEffect } from 'react';
import { WidgetContainer } from '../WidgetContainer';
import { Button } from '../../../ui/Button';
import { Badge } from '../../../ui/Badge';
import { Avatar } from '../../../ui/Avatar';
import { GameControllerIcon, SparklesIcon, CalendarIcon } from '../../../icons';
import type { GameActivityData, GameStatus } from '../../../../types/dashboard';

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
    },
    {
      id: "4",
      name: "ProGamer_99",
      game: "Valorant",
      status: "В матче",
      joinable: false
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
    },
    {
      id: "apex",
      name: "Apex Legends",
      playersCount: 420000,
      trending: false
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
  const [data, setData] = useState(mockGameActivityData);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showAllFriends, setShowAllFriends] = useState(false);
  const [isSessionPaused, setIsSessionPaused] = useState(false);
  const [notifications, setNotifications] = useState<string[]>([]);

  // Обновление времени каждую секунду для live таймера
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Симуляция обновления данных друзей каждые 30 секунд
  useEffect(() => {
    const updateInterval = setInterval(() => {
      setData(prevData => {
        const updatedFriends = prevData.friendsPlaying.map(friend => {
          // Случайные обновления статуса друзей
          const statuses: GameStatus[] = ["В матче", "В лобби", "В меню", "AFK"];
          const randomStatus: GameStatus = Math.random() > 0.8 ? 
            statuses[Math.floor(Math.random() * statuses.length)] : 
            friend.status;
          
          return {
            ...friend,
            status: randomStatus,
            joinable: randomStatus === "В лобби" || randomStatus === "В меню"
          };
        });

        return {
          ...prevData,
          friendsPlaying: updatedFriends
        };
      });
    }, 30000);

    return () => clearInterval(updateInterval);
  }, []);

  const formatPlayTime = (sessionStart: Date) => {
    if (isSessionPaused) return "Пауза";
    
    const diffMs = currentTime.getTime() - sessionStart.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const hours = Math.floor(diffMins / 60);
    const mins = diffMins % 60;
    
    if (hours > 0) {
      return `${hours}ч ${mins}м`;
    }
    return `${mins}м`;
  };

  const handleJoinFriend = (friendName: string, game: string) => {
    setNotifications(prev => [
      ...prev,
      `Присоединяемся к ${friendName} в ${game}...`
    ]);
    
    // Убираем уведомление через 3 секунды
    setTimeout(() => {
      setNotifications(prev => prev.slice(1));
    }, 3000);

    // Симуляция присоединения - меняем текущую игру
    setTimeout(() => {
      setData(prev => ({
        ...prev,
        currentGame: game,
        isPlaying: true,
        sessionStartTime: new Date()
      }));
    }, 1000);
  };

  const handleLaunchGame = (gameName: string) => {
    setNotifications(prev => [
      ...prev,
      `Запускаем ${gameName}...`
    ]);

    setTimeout(() => {
      setNotifications(prev => prev.slice(1));
    }, 3000);

    // Симуляция запуска игры
    setTimeout(() => {
      setData(prev => ({
        ...prev,
        currentGame: gameName,
        isPlaying: true,
        sessionStartTime: new Date()
      }));
    }, 2000);
  };

  const handleToggleSession = () => {
    if (data.isPlaying) {
      setIsSessionPaused(!isSessionPaused);
      setNotifications(prev => [
        ...prev,
        isSessionPaused ? "Игровая сессия возобновлена" : "Игровая сессия приостановлена"
      ]);
    } else {
      // Начать новую сессию
      setData(prev => ({
        ...prev,
        isPlaying: true,
        sessionStartTime: new Date()
      }));
      setIsSessionPaused(false);
      setNotifications(prev => [
        ...prev,
        "Новая игровая сессия начата"
      ]);
    }

    setTimeout(() => {
      setNotifications(prev => prev.slice(1));
    }, 3000);
  };

  const handleStopSession = () => {
    setData(prev => ({
      ...prev,
      isPlaying: false,
      currentGame: ""
    }));
    setIsSessionPaused(false);
    setNotifications(prev => [
      ...prev,
      "Игровая сессия завершена"
    ]);

    setTimeout(() => {
      setNotifications(prev => prev.slice(1));
    }, 3000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "В матче": return "text-green-400";
      case "В лобби": return "text-blue-400";
      case "В меню": return "text-yellow-400";
      case "AFK": return "text-gray-400";
      default: return "text-muted-foreground";
    }
  };

  const visibleFriends = showAllFriends ? data.friendsPlaying : data.friendsPlaying.slice(0, 3);

  return (
    <WidgetContainer
      id="game-activity"
      title="Игровая активность"
      icon={<GameControllerIcon size={20} className="text-primary" />}
      animationDelay={animationDelay}
    >
      <div className="space-y-4">
        {/* Уведомления */}
        {notifications.length > 0 && (
          <div className="space-y-1">
            {notifications.map((notification, index) => (
              <div 
                key={index}
                className="text-xs bg-primary/10 text-primary px-2 py-1 rounded animate-in slide-in-from-top-2 duration-300"
              >
                {notification}
              </div>
            ))}
          </div>
        )}

        {/* Текущая игра */}
        {data.currentGame && data.isPlaying && (
          <div className={`p-3 rounded-lg border transition-all duration-300 ${
            isSessionPaused 
              ? 'bg-yellow-500/10 border-yellow-500/20' 
              : 'bg-primary/10 border-primary/20'
          }`}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${
                  isSessionPaused 
                    ? 'bg-yellow-500' 
                    : 'bg-green-500 animate-pulse'
                }`}></div>
                <span className="text-sm font-medium text-foreground">
                  {isSessionPaused ? "Игра на паузе" : "Сейчас играете"}
                </span>
              </div>
              <Badge variant="default" className="text-xs">
                {data.sessionStartTime && formatPlayTime(data.sessionStartTime)}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between mb-3">
              <p className="font-semibold text-foreground text-lg">{data.currentGame}</p>
              <div className="flex space-x-1">
                <Button 
                  size="sm"
                  variant="ghost"
                  onClick={handleToggleSession}
                  className="text-xs px-2 py-1 h-auto"
                >
                  {isSessionPaused ? "▶️" : "⏸️"}
                </Button>
                <Button 
                  size="sm"
                  variant="ghost"
                  onClick={handleStopSession}
                  className="text-xs px-2 py-1 h-auto text-red-400 hover:text-red-300"
                >
                  ⏹️
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Если не играем - кнопка начать сессию */}
        {!data.isPlaying && (
          <div className="p-3 bg-card/50 rounded-lg border border-border">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Не играете в данный момент</p>
              <Button 
                size="sm"
                variant="primary"
                onClick={handleToggleSession}
                className="text-xs"
              >
                <GameControllerIcon size={14} className="mr-1" />
                Начать игровую сессию
              </Button>
            </div>
          </div>
        )}

        {/* Друзья в игре */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-foreground">Друзья в игре</h4>
            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
              <span>Live</span>
            </div>
          </div>
          
          <div className="space-y-2">
            {visibleFriends.map((friend) => (
              <div key={friend.id} className="flex items-center justify-between group p-2 rounded-lg hover:bg-accent/50 transition-all duration-200">
                <div className="flex items-center space-x-3">
                  <Avatar 
                    username={friend.name}
                    size="sm"
                    showStatus={false}
                  />
                  <div>
                    <p className="text-sm font-medium text-foreground">{friend.name}</p>
                    <p className={`text-xs ${getStatusColor(friend.status)}`}>
                      {friend.game} • {friend.status}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-1">
                  {friend.joinable && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-xs px-2 py-1 h-auto"
                      onClick={() => handleJoinFriend(friend.name, friend.game)}
                    >
                      Присоединиться
                    </Button>
                  )}
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-xs px-2 py-1 h-auto"
                    onClick={() => {
                      setNotifications(prev => [...prev, `Приглашение отправлено ${friend.name}`]);
                      setTimeout(() => setNotifications(prev => prev.slice(1)), 3000);
                    }}
                  >
                    💬
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          {data.friendsPlaying.length > 3 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full mt-2 text-xs"
              onClick={() => setShowAllFriends(!showAllFriends)}
            >
              {showAllFriends 
                ? "Скрыть" 
                : `Показать еще ${data.friendsPlaying.length - 3}`
              }
            </Button>
          )}
        </div>

        {/* Популярные игры */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-foreground">Популярные игры</h4>
            <SparklesIcon size={14} className="text-yellow-400" />
          </div>
          
          <div className="grid grid-cols-1 gap-2">
            {data.popularGames.slice(0, 3).map((game) => (
              <div 
                key={game.id} 
                className="flex items-center justify-between p-2 rounded-lg hover:bg-accent transition-all duration-200 cursor-pointer group"
                onClick={() => handleLaunchGame(game.name)}
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
                <div className="flex items-center space-x-2">
                  {game.trending && (
                    <Badge variant="default" className="text-xs">
                      🔥 Тренд
                    </Badge>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-xs px-2 py-1 h-auto"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLaunchGame(game.name);
                    }}
                  >
                    ▶️
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          {data.popularGames.length > 3 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full mt-2 text-xs"
              onClick={() => {
                setNotifications(prev => [...prev, "Открываем каталог игр..."]);
                setTimeout(() => setNotifications(prev => prev.slice(1)), 3000);
              }}
            >
              <CalendarIcon size={12} className="mr-1" />
              Все игры ({data.popularGames.length})
            </Button>
          )}
        </div>
      </div>
    </WidgetContainer>
  );
}; 