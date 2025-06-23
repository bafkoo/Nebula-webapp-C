import React, { useState, useEffect, useCallback } from 'react';
import { WidgetContainer } from '../WidgetContainer';
import { Button } from '../../../ui/Button';
import { Badge } from '../../../ui/Badge';
import { SparklesIcon, TrophyIcon, CalendarIcon, GroupUsersIcon } from '../../../icons';
import type { QuickConnectionsData, FavoriteServer, RecentServer } from '../../../../types/dashboard';

// Расширенные mockup данные
const mockQuickConnectionsData: QuickConnectionsData = {
  favoriteServers: [
    {
      id: "1",
      name: "🏆 Pro Gamers Elite",
      game: "CS:GO",
      playerCount: { online: 47, total: 50 },
      ping: 12,
      favorite: true,
      hasPassword: false
    },
    {
      id: "2", 
      name: "🇷🇺 CS:GO RU Official",
      game: "CS:GO",
      playerCount: { online: 94, total: 100 },
      ping: 8,
      favorite: true,
      hasPassword: false
    },
    {
      id: "3",
      name: "🎯 Elite Valorant Squad",
      game: "Valorant", 
      playerCount: { online: 18, total: 20 },
      ping: 15,
      favorite: true,
      hasPassword: true
    },
    {
      id: "4",
      name: "⚔️ Dota 2 Legends",
      game: "Dota 2",
      playerCount: { online: 28, total: 40 },
      ping: 22,
      favorite: true,
      hasPassword: false
    },
    {
      id: "5",
      name: "🔥 Apex Predators",
      game: "Apex Legends",
      playerCount: { online: 55, total: 60 },
      ping: 18,
      favorite: true,
      hasPassword: true
    }
  ],
  recentServers: [
    {
      id: "recent1",
      name: "🎤 Team Strategy Meeting", 
      game: "Discord Voice",
      lastJoined: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 час назад
      duration: 75
    },
    {
      id: "recent2",
      name: "🏅 Tournament Practice",
      game: "CS:GO", 
      lastJoined: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 часа назад
      duration: 180
    },
    {
      id: "recent3",
      name: "⚡ Quick Match Lobby",
      game: "Valorant",
      lastJoined: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 часов назад
      duration: 45
    },
    {
      id: "recent4",
      name: "🌟 Community Hangout",
      game: "Discord Voice",
      lastJoined: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 часов назад
      duration: 240
    }
  ],
  quickJoinEnabled: true
};

interface ConnectionStatus {
  status: 'idle' | 'connecting' | 'connected' | 'failed' | 'reconnecting';
  server?: string;
  attempt?: number;
}

interface SmartRecommendation {
  serverId: string;
  reason: string;
  score: number;
  badge: string;
}

interface QuickConnectionsWidgetProps {
  animationDelay?: number;
}

export const QuickConnectionsWidget: React.FC<QuickConnectionsWidgetProps> = ({
  animationDelay = 0
}) => {
  const [data, setData] = useState(mockQuickConnectionsData);
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({ status: 'idle' });
  const [notifications, setNotifications] = useState<string[]>([]);
  const [showAllFavorites, setShowAllFavorites] = useState(false);
  const [showAllRecent, setShowAllRecent] = useState(false);
  const [smartRecommendations, setSmartRecommendations] = useState<SmartRecommendation[]>([]);
  const [pingUpdates, setPingUpdates] = useState<Record<string, number>>({});
  const [autoReconnectEnabled, setAutoReconnectEnabled] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Обновление времени каждую секунду
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Real-time обновление пинга серверов
  useEffect(() => {
    const pingInterval = setInterval(() => {
      setData(prevData => ({
        ...prevData,
        favoriteServers: prevData.favoriteServers.map(server => {
          // Симуляция изменения пинга ±5ms
          const pingVariation = Math.floor(Math.random() * 10) - 5;
          const newPing = Math.max(5, server.ping + pingVariation);
          
          setPingUpdates(prev => ({
            ...prev,
            [server.id]: newPing
          }));

          return {
            ...server,
            ping: newPing,
            // Симуляция изменения количества игроков
            playerCount: {
              ...server.playerCount,
              online: Math.min(
                server.playerCount.total,
                Math.max(1, server.playerCount.online + Math.floor(Math.random() * 6) - 3)
              )
            }
          };
        })
      }));
    }, 5000); // Обновление каждые 5 секунд

    return () => clearInterval(pingInterval);
  }, []);

  // Генерация умных рекомендаций
  useEffect(() => {
    const generateRecommendations = () => {
      const recommendations: SmartRecommendation[] = [];
      
      data.favoriteServers.forEach(server => {
        let score = 0;
        let reason = '';
        let badge = '';

        // Логика скоринга
        if (server.ping <= 15) {
          score += 30;
          reason = 'Отличный пинг';
          badge = '⚡';
        }
        
        if (server.playerCount.online / server.playerCount.total > 0.8) {
          score += 25;
          reason = reason ? `${reason} • Высокая активность` : 'Высокая активность';
          badge = badge || '🔥';
        }

        if (server.playerCount.online >= 10 && server.playerCount.online <= 30) {
          score += 20;
          reason = reason ? `${reason} • Оптимальный размер лобби` : 'Оптимальный размер лобби';
          badge = badge || '👥';
        }

        if (!server.hasPassword) {
          score += 15;
        }

        if (score >= 40) {
          recommendations.push({
            serverId: server.id,
            reason,
            score,
            badge
          });
        }
      });

      setSmartRecommendations(recommendations.sort((a, b) => b.score - a.score).slice(0, 2));
    };

    generateRecommendations();
  }, [data]);

  const addNotification = useCallback((message: string) => {
    setNotifications(prev => [...prev, message]);
    setTimeout(() => {
      setNotifications(prev => prev.slice(1));
    }, 4000);
  }, []);

  const handleConnect = async (server: FavoriteServer) => {
    setConnectionStatus({ status: 'connecting', server: server.name });
    addNotification(`🔄 Подключение к ${server.name}...`);

    // Симуляция процесса подключения
    await new Promise(resolve => setTimeout(resolve, 1500));

    const success = Math.random() > 0.1; // 90% успех

    if (success) {
      setConnectionStatus({ status: 'connected', server: server.name });
      addNotification(`✅ Подключен к ${server.name}!`);
      
      // Добавляем в недавние
      const newRecentServer: RecentServer = {
        id: `recent_${Date.now()}`,
        name: server.name,
        game: server.game,
        lastJoined: new Date(),
        duration: 0
      };
      
      setData(prev => ({
        ...prev,
        recentServers: [newRecentServer, ...prev.recentServers.slice(0, 3)]
      }));
    } else {
      setConnectionStatus({ status: 'failed', server: server.name });
      addNotification(`❌ Ошибка подключения к ${server.name}`);
      
      if (autoReconnectEnabled) {
        setTimeout(() => {
          setConnectionStatus({ status: 'reconnecting', server: server.name, attempt: 1 });
          addNotification(`🔄 Повторная попытка подключения...`);
          handleConnect(server);
        }, 3000);
      }
    }

    setTimeout(() => {
      setConnectionStatus({ status: 'idle' });
    }, 2000);
  };

  const handleQuickJoin = () => {
    // Находим лучший сервер по алгоритму
    const bestServer = data.favoriteServers
      .filter(s => !s.hasPassword && s.playerCount.online > 5)
      .sort((a, b) => {
        const scoreA = (100 - a.ping) + (a.playerCount.online * 2);
        const scoreB = (100 - b.ping) + (b.playerCount.online * 2);
        return scoreB - scoreA;
      })[0];

    if (bestServer) {
      addNotification(`🎯 Умное подключение: выбран лучший сервер`);
      handleConnect(bestServer);
    } else {
      addNotification(`⚠️ Нет доступных серверов для быстрого подключения`);
    }
  };

  const handleReconnect = (recentServer: RecentServer) => {
    const originalServer = data.favoriteServers.find(s => s.name === recentServer.name);
    if (originalServer) {
      addNotification(`🔄 Переподключение к ${recentServer.name}...`);
      handleConnect(originalServer);
    } else {
      addNotification(`⚠️ Сервер ${recentServer.name} недоступен`);
    }
  };

  const formatLastJoined = (date: Date) => {
    const diffMs = currentTime.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffHours >= 24) {
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays}д назад`;
    }
    if (diffHours > 0) {
      return `${diffHours}ч назад`;
    }
    return `${diffMins}м назад`;
  };

  const getPingColor = (ping: number) => {
    if (ping <= 20) return 'text-green-400';
    if (ping <= 50) return 'text-yellow-400';
    if (ping <= 100) return 'text-orange-400';
    return 'text-red-400';
  };

  const getServerHealthColor = (server: FavoriteServer) => {
    const healthRatio = server.playerCount.online / server.playerCount.total;
    if (healthRatio >= 0.8) return 'text-green-400';
    if (healthRatio >= 0.5) return 'text-yellow-400';
    if (healthRatio >= 0.2) return 'text-orange-400';
    return 'text-red-400';
  };

  const getConnectionStatusIcon = (status: ConnectionStatus['status']) => {
    switch (status) {
      case 'connecting': return '🔄';
      case 'connected': return '✅';
      case 'failed': return '❌';
      case 'reconnecting': return '🔄';
      default: return '';
    }
  };

  const visibleFavorites = showAllFavorites ? data.favoriteServers : data.favoriteServers.slice(0, 3);
  const visibleRecent = showAllRecent ? data.recentServers : data.recentServers.slice(0, 2);

  return (
    <WidgetContainer
      id="quick-connections"
      title="Быстрые подключения"
      icon={<SparklesIcon size={20} className="text-primary" />}
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

        {/* Статус подключения */}
        {connectionStatus.status !== 'idle' && (
          <div className="p-2 bg-accent/30 rounded-lg border border-border/50">
            <div className="flex items-center space-x-2 text-xs">
              <span className="animate-pulse">{getConnectionStatusIcon(connectionStatus.status)}</span>
              <span className="text-foreground">
                {connectionStatus.status === 'connecting' && `Подключение к ${connectionStatus.server}...`}
                {connectionStatus.status === 'connected' && `Подключен к ${connectionStatus.server}`}
                {connectionStatus.status === 'failed' && `Ошибка подключения к ${connectionStatus.server}`}
                {connectionStatus.status === 'reconnecting' && `Переподключение... (попытка ${connectionStatus.attempt})`}
              </span>
            </div>
          </div>
        )}

        {/* Умные рекомендации */}
        {smartRecommendations.length > 0 && (
          <div className="p-3 bg-gradient-to-r from-primary/10 to-accent/20 rounded-lg border border-primary/20">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-foreground flex items-center">
                <TrophyIcon size={14} className="mr-1 text-yellow-400" />
                Рекомендуется
              </h4>
              <Badge variant="default" className="text-xs">AI</Badge>
            </div>
            <div className="space-y-1">
              {smartRecommendations.map(rec => {
                const server = data.favoriteServers.find(s => s.id === rec.serverId);
                return server ? (
                  <div key={rec.serverId} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">{rec.badge}</span>
                      <span className="text-xs text-foreground font-medium">{server.name}</span>
                    </div>
                    <Button 
                      size="sm"
                      variant="primary"
                      className="text-xs px-2 py-1 h-auto"
                      onClick={() => handleConnect(server)}
                      disabled={connectionStatus.status !== 'idle'}
                    >
                      Подключиться
                    </Button>
                  </div>
                ) : null;
              })}
            </div>
            <p className="text-xs text-muted-foreground mt-1">{smartRecommendations[0]?.reason}</p>
          </div>
        )}

        {/* Быстрое подключение */}
        {data.quickJoinEnabled && (
          <div className="p-3 bg-accent/20 rounded-lg border border-border/50">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-medium text-foreground flex items-center">
                  <SparklesIcon size={14} className="mr-1 text-primary" />
                  Умное подключение
                </h4>
                <p className="text-xs text-muted-foreground">
                  Автоматический выбор лучшего сервера
                </p>
              </div>
              <Button 
                variant="primary"
                size="sm" 
                onClick={handleQuickJoin}
                disabled={connectionStatus.status !== 'idle'}
                className="text-xs"
              >
                🎯 Найти игру
              </Button>
            </div>
          </div>
        )}

        {/* Избранные серверы */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-foreground">Избранные серверы</h4>
            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
              <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></div>
              <span>Live</span>
            </div>
          </div>
          
          <div className="space-y-2">
            {visibleFavorites.map((server) => {
              const isPingUpdated = pingUpdates[server.id] && pingUpdates[server.id] !== server.ping;
              return (
                <div 
                  key={server.id} 
                  className="p-3 bg-accent/30 rounded-lg border border-border/50 hover:bg-accent/50 transition-all duration-200 group cursor-pointer"
                  onClick={() => connectionStatus.status === 'idle' && handleConnect(server)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div>
                        <p className="text-sm font-medium text-foreground flex items-center gap-1">
                          {server.name}
                          {server.hasPassword && (
                            <svg className="w-3 h-3 text-muted-foreground" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                            </svg>
                          )}
                          {smartRecommendations.find(r => r.serverId === server.id) && (
                            <TrophyIcon size={12} className="text-yellow-400" />
                          )}
                        </p>
                        <p className="text-xs text-muted-foreground">{server.game}</p>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-xs px-2 py-1 h-auto"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleConnect(server);
                      }}
                      disabled={connectionStatus.status !== 'idle'}
                    >
                      Подключиться
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-3">
                      <span className={`flex items-center ${getServerHealthColor(server)}`}>
                        <GroupUsersIcon size={12} className="mr-1" />
                        {server.playerCount.online}/{server.playerCount.total}
                      </span>
                      <span className={`font-mono ${getPingColor(server.ping)} ${isPingUpdated ? 'animate-pulse' : ''}`}>
                        {server.ping}ms
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-green-400 text-xs">
                        {Math.round((server.playerCount.online / server.playerCount.total) * 100)}%
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {data.favoriteServers.length > 3 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full mt-2 text-xs"
              onClick={() => setShowAllFavorites(!showAllFavorites)}
            >
              {showAllFavorites 
                ? "Скрыть" 
                : `Показать еще ${data.favoriteServers.length - 3}`
              }
            </Button>
          )}
        </div>

        {/* Недавние подключения */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-foreground">Недавние</h4>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs px-2 py-1 h-auto"
              onClick={() => {
                addNotification("🧹 История очищена");
                setData(prev => ({ ...prev, recentServers: [] }));
              }}
            >
              Очистить
            </Button>
          </div>
          
          <div className="space-y-2">
            {visibleRecent.map((server) => (
              <div 
                key={server.id}
                className="flex items-center justify-between p-2 rounded-lg hover:bg-accent/50 transition-all duration-200 group"
              >
                <div className="flex items-center space-x-3">
                  <div>
                    <p className="text-sm font-medium text-foreground">{server.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatLastJoined(server.lastJoined)} • {server.duration}м • {server.game}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-1">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-xs px-2 py-1 h-auto"
                    onClick={() => handleReconnect(server)}
                    disabled={connectionStatus.status !== 'idle'}
                  >
                    🔄 Повторить
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-xs px-2 py-1 h-auto"
                    onClick={() => {
                      // Добавляем в избранное (если это возможно)
                      addNotification(`⭐ ${server.name} добавлен в избранное`);
                    }}
                  >
                    ⭐
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {data.recentServers.length > 2 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full mt-2 text-xs"
              onClick={() => setShowAllRecent(!showAllRecent)}
            >
              {showAllRecent 
                ? "Скрыть" 
                : `Показать еще ${data.recentServers.length - 2}`
              }
            </Button>
          )}
        </div>

        {/* Настройки автоподключения */}
        <div className="pt-2 border-t border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="auto-reconnect"
                checked={autoReconnectEnabled}
                onChange={(e) => setAutoReconnectEnabled(e.target.checked)}
                className="w-3 h-3 text-primary bg-transparent border-border rounded focus:ring-primary focus:ring-1"
              />
              <label htmlFor="auto-reconnect" className="text-xs text-muted-foreground">
                Автопереподключение
              </label>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-xs px-2 py-1 h-auto"
              onClick={() => {
                addNotification("🔧 Открываем настройки подключений...");
              }}
            >
              <CalendarIcon size={12} className="mr-1" />
              Настройки
            </Button>
          </div>
        </div>
      </div>
    </WidgetContainer>
  );
}; 