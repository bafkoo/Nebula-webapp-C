import React, { useState, useEffect } from 'react';
import { Button } from '../../../ui/Button';
import { Badge } from '../../../ui/Badge';
import { 
  AnnouncementIcon, 
  SparklesIcon
} from '../../../icons';

// Локальные типы для полной независимости виджета
interface NewsItem {
  id: string;
  title: string;
  type: 'breaking' | 'update' | 'patch' | 'tournament' | 'community';
  priority: 'low' | 'medium' | 'high' | 'critical';
  content: string;
  timestamp: Date;
  read: boolean;
  game?: string;
  likes: number;
  comments: number;
  shares: number;
  isBreaking?: boolean;
  isPersonalized?: boolean;
  aiScore?: number;
  tags: string[];
  source: string;
  imageUrl?: string;
  upvotes?: number;
  trending?: boolean;
}

interface Notification {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'breaking';
  duration?: number;
}

interface FeedFilter {
  type: 'all' | 'personalized' | 'trending' | 'breaking';
  games: string[];
  priority: string[];
}

interface NewsUpdatesWidgetProps {
  animationDelay?: number;
}

export const NewsUpdatesWidget: React.FC<NewsUpdatesWidgetProps> = ({
  animationDelay = 0
}) => {
  const [activeTab, setActiveTab] = useState<'feed' | 'notifications' | 'trending'>('feed');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<FeedFilter>({
    type: 'all',
    games: [],
    priority: []
  });
  const [news, setNews] = useState<NewsItem[]>([
    {
      id: "1",
      title: "🔥 CS2 MAJOR: NaVi vs G2 Finals LIVE",
      type: "breaking",
      priority: "critical",
      content: "Финал Major Championships началась! NaVi ведет 2:1 в BO5",
      timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 мин
      read: false,
      game: "CS2",
      likes: 1250,
      comments: 89,
      shares: 156,
      isBreaking: true,
      aiScore: 98,
      tags: ["live", "major", "finals"],
      source: "ESL Official",
      trending: true,
      upvotes: 2341
    },
    {
      id: "2",
      title: "Valorant Episode 9 с новым агентом Vyse",
      type: "update",
      priority: "high",
      content: "Революционные способности и новые карты уже доступны",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      read: false,
      game: "Valorant",
      likes: 892,
      comments: 145,
      shares: 67,
      isPersonalized: true,
      aiScore: 85,
      tags: ["agent", "update", "vyse"],
      source: "Riot Games",
      trending: true,
      upvotes: 1456
    },
    {
      id: "3",
      title: "Dota 2 International: $18M призовой фонд",
      type: "tournament",
      priority: "high",
      content: "Крупнейший призовой фонд в истории киберспорта побит!",
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      read: true,
      game: "Dota 2",
      likes: 2456,
      comments: 234,
      shares: 345,
      aiScore: 92,
      tags: ["international", "prizepool", "record"],
      source: "Valve Corp",
      trending: true,
      upvotes: 3421
    },
    {
      id: "4",
      title: "Nebula Chat достиг 1M пользователей!",
      type: "community",
      priority: "medium",
      content: "Спасибо нашему невероятному сообществу геймеров 🎉",
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      read: false,
      game: undefined,
      likes: 5672,
      comments: 432,
      shares: 891,
      isPersonalized: true,
      aiScore: 78,
      tags: ["milestone", "community", "achievement"],
      source: "Nebula Team",
      upvotes: 7834
    },
    {
      id: "5",
      title: "Apex Legends: Season 19 Battle Pass утечка",
      type: "update",
      priority: "medium",
      content: "Новые скины и легенда Catalyst подтверждены датамайнерами",
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
      read: true,
      game: "Apex Legends",
      likes: 678,
      comments: 89,
      shares: 34,
      aiScore: 72,
      tags: ["leak", "season19", "battlepass"],
      source: "ApexLeaks",
      upvotes: 1234
    },
    {
      id: "6",
      title: "NVIDIA RTX 4090 цены упали на 30%",
      type: "update",
      priority: "medium",
      content: "Лучшее время для апгрейда геймерской установки",
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
      read: false,
      game: undefined,
      likes: 1890,
      comments: 267,
      shares: 445,
      isPersonalized: true,
      aiScore: 81,
      tags: ["hardware", "nvidia", "price"],
      source: "TechNews",
      upvotes: 2567
    }
  ]);

  // AI персонализация feed
  const [personalizedFeed, setPersonalizedFeed] = useState<NewsItem[]>([]);
  const [trendingFeed, setTrendingFeed] = useState<NewsItem[]>([]);

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

  // AI алгоритм персонализации
  useEffect(() => {
    const personalizeNews = () => {
      // Симуляция AI скоринга на основе предпочтений пользователя
      const scored = news.map(item => {
        let score = item.aiScore || 50;
        
        // Бонус за игры которые пользователь играет
        if (item.game === 'CS2') score += 15;
        if (item.game === 'Valorant') score += 10;
        
        // Бонус за breaking news
        if (item.isBreaking) score += 20;
        
        // Бонус за высокую активность
        if (item.likes > 1000) score += 10;
        if (item.upvotes && item.upvotes > 2000) score += 15;
        
        // Штраф за прочитанные новости
        if (item.read) score -= 30;
        
        // Бонус за недавние новости
        const hoursAgo = (Date.now() - item.timestamp.getTime()) / (1000 * 60 * 60);
        if (hoursAgo < 2) score += 25;
        else if (hoursAgo < 6) score += 10;
        
        return { ...item, personalizedScore: score };
      });
      
      setPersonalizedFeed(scored.sort((a, b) => (b.personalizedScore || 0) - (a.personalizedScore || 0)));
    };

    const trendingAlgorithm = () => {
      // Trending алгоритм на основе engagement
      const trending = news.map(item => {
        const engagement = item.likes + item.comments * 3 + item.shares * 5 + (item.upvotes || 0) * 0.5;
        const hoursAgo = (Date.now() - item.timestamp.getTime()) / (1000 * 60 * 60);
        const trendingScore = engagement / Math.max(hoursAgo, 0.5); // Velocity score
        
        return { ...item, trendingScore };
      });
      
      setTrendingFeed(trending.sort((a, b) => (b.trendingScore || 0) - (a.trendingScore || 0)));
    };

    personalizeNews();
    trendingAlgorithm();
  }, [news]);

  // Симуляция real-time обновлений
  useEffect(() => {
    const interval = setInterval(() => {
      // Обновляем лайки и комментарии
      setNews(prev => prev.map(item => {
        if (Math.random() < 0.3) {
          const likesIncrease = Math.floor(Math.random() * 10);
          const commentsIncrease = Math.floor(Math.random() * 3);
          
          return {
            ...item,
            likes: item.likes + likesIncrease,
            comments: item.comments + commentsIncrease,
            upvotes: (item.upvotes || 0) + Math.floor(Math.random() * 5)
          };
        }
        return item;
      }));
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  // Breaking news симуляция
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() < 0.3) {
        const breakingNews = [
          '🚨 CS2 Major: Upset! Underdog team в финале!',
          '⚡ Valorant: Внезапный hotfix изменил мету!',
          '🔥 Новый рекорд concurrent players в Steam!',
          '💰 Крупнейшая киберспорт сделка года!',
          '🎮 Эксклюзивная игра станет free-to-play!'
        ];
        
        const randomNews = breakingNews[Math.floor(Math.random() * breakingNews.length)];
        showNotification(randomNews, 'breaking', 5000);
      }
    }, 20000);

    return () => clearInterval(interval);
  }, []);

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (minutes < 1) return 'сейчас';
    if (minutes < 60) return `${minutes}м`;
    if (hours < 24) return `${hours}ч`;
    const days = Math.floor(hours / 24);
    return `${days}д`;
  };

  const getGameColor = (game?: string) => {
    if (!game) return 'text-gray-400';
    switch (game) {
      case 'CS2': return 'text-orange-400';
      case 'Valorant': return 'text-red-400';
      case 'Dota 2': return 'text-blue-400';
      case 'Apex Legends': return 'text-purple-400';
      default: return 'text-gray-400';
    }
  };

  const getPriorityIndicator = (priority: string, isBreaking?: boolean) => {
    if (isBreaking) {
      return <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />;
    }
    
    switch (priority) {
      case 'critical':
        return <div className="w-2 h-2 bg-red-500 rounded-full" />;
      case 'high':
        return <div className="w-2 h-2 bg-yellow-500 rounded-full" />;
      case 'medium':
        return <div className="w-2 h-2 bg-blue-500 rounded-full" />;
      default:
        return <div className="w-2 h-2 bg-gray-500 rounded-full" />;
    }
  };

  const handleLike = (newsId: string) => {
    setNews(prev => prev.map(item => 
      item.id === newsId 
        ? { ...item, likes: item.likes + 1 }
        : item
    ));
    showNotification('👍 Лайк добавлен!', 'success', 1500);
  };

  const handleShare = (newsId: string, title: string) => {
    setNews(prev => prev.map(item => 
      item.id === newsId 
        ? { ...item, shares: item.shares + 1 }
        : item
    ));
    showNotification(`📤 "${title}" отправлено друзьям!`, 'info', 2000);
  };

  const markAsRead = (newsId: string) => {
    setNews(prev => prev.map(item => 
      item.id === newsId ? { ...item, read: true } : item
    ));
  };

  const getCurrentFeed = () => {
    switch (activeTab) {
      case 'feed':
        return filter.type === 'personalized' ? personalizedFeed : 
               filter.type === 'trending' ? trendingFeed :
               news;
      case 'notifications':
        return news.filter(item => !item.read);
      case 'trending':
        return trendingFeed;
      default:
        return news;
    }
  };

  const formatEngagement = (num: number) => {
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div 
      className="bg-card/95 backdrop-blur-sm border border-border rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300"
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      {/* Заголовок с AI индикатором */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-primary/20 rounded-lg">
            <AnnouncementIcon size={20} className="text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">Новости и обновления</h3>
            <div className="flex items-center gap-1">
              <SparklesIcon size={12} className="text-yellow-400" />
              <p className="text-xs text-muted-foreground">AI персонализация</p>
            </div>
          </div>
        </div>
        
        {/* Breaking индикатор */}
        {news.some(item => item.isBreaking) && (
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span className="text-xs text-red-400 font-medium">BREAKING</span>
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
                notification.type === 'breaking' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                'bg-blue-500/20 text-blue-400 border border-blue-500/30'
              }`}
            >
              {notification.message}
            </div>
          ))}
        </div>
      )}

      {/* Табы и фильтры */}
      <div className="space-y-2 mb-4">
        {/* Главные табы */}
        <div className="flex space-x-1 bg-muted/50 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('feed')}
            className={`flex-1 py-2 px-3 rounded-md text-xs font-medium transition-all duration-200 ${
              activeTab === 'feed'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Лента
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`flex-1 py-2 px-3 rounded-md text-xs font-medium transition-all duration-200 ${
              activeTab === 'notifications'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <div className="flex items-center justify-center gap-1">
              Уведомления
              {news.filter(item => !item.read).length > 0 && (
                <Badge variant="default" className="text-xs bg-red-500/20 text-red-400 px-1">
                  {news.filter(item => !item.read).length}
                </Badge>
              )}
            </div>
          </button>
          <button
            onClick={() => setActiveTab('trending')}
            className={`flex-1 py-2 px-3 rounded-md text-xs font-medium transition-all duration-200 ${
              activeTab === 'trending'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            🔥 Trending
          </button>
        </div>

        {/* AI фильтры для ленты */}
        {activeTab === 'feed' && (
          <div className="flex space-x-1">
            <button
              onClick={() => setFilter(prev => ({ ...prev, type: 'all' }))}
              className={`px-2 py-1 rounded text-xs transition-all ${
                filter.type === 'all'
                  ? 'bg-primary/20 text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Все
            </button>
            <button
              onClick={() => setFilter(prev => ({ ...prev, type: 'personalized' }))}
              className={`px-2 py-1 rounded text-xs transition-all flex items-center gap-1 ${
                filter.type === 'personalized'
                  ? 'bg-yellow-500/20 text-yellow-400'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <SparklesIcon size={10} />
              Для меня
            </button>
            <button
              onClick={() => setFilter(prev => ({ ...prev, type: 'trending' }))}
              className={`px-2 py-1 rounded text-xs transition-all ${
                filter.type === 'trending'
                  ? 'bg-red-500/20 text-red-400'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              🔥 Горячее
            </button>
          </div>
        )}
      </div>

      {/* Контент новостей */}
      <div className="space-y-2 min-h-[160px] max-h-[320px] overflow-y-auto custom-scrollbar">
        {getCurrentFeed().slice(0, 6).map((item) => (
          <div 
            key={item.id}
            className={`p-3 rounded-lg border transition-all duration-200 group cursor-pointer ${
              item.read 
                ? 'bg-accent/20 border-border/50 opacity-75' 
                : 'bg-accent/30 border-border/50 hover:bg-accent/50'
            } ${item.isBreaking ? 'ring-1 ring-red-500/50' : ''}`}
            onClick={() => markAsRead(item.id)}
          >
            {/* Заголовок и метаданные */}
            <div className="flex items-start gap-2 mb-2">
              {getPriorityIndicator(item.priority, item.isBreaking)}
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className={`text-sm font-medium ${
                      item.isBreaking ? 'text-red-400' : 'text-foreground'
                    } line-clamp-2`}>
                      {item.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                      <span>{item.source}</span>
                      <span>•</span>
                      <span>{formatTimeAgo(item.timestamp)}</span>
                      {item.game && (
                        <>
                          <span>•</span>
                          <span className={getGameColor(item.game)}>{item.game}</span>
                        </>
                      )}
                      {item.isPersonalized && (
                        <>
                          <span>•</span>
                          <SparklesIcon size={10} className="text-yellow-400" />
                        </>
                      )}
                    </div>
                  </div>
                  {item.trending && (
                    <div className="text-xs text-red-400">🔥</div>
                  )}
                </div>
              </div>
            </div>

            {/* Содержание */}
            <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
              {item.content}
            </p>

            {/* Теги */}
            {item.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2">
                {item.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="default" className="text-xs px-1.5 py-0.5 bg-primary/10 text-primary">
                    #{tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* Engagement метрики */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <button 
                  className="flex items-center gap-1 hover:text-red-400 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLike(item.id);
                  }}
                >
                  <span>👍</span>
                  <span>{formatEngagement(item.likes)}</span>
                </button>
                <span className="flex items-center gap-1">
                  <span>💬</span>
                  <span>{formatEngagement(item.comments)}</span>
                </span>
                <button 
                  className="flex items-center gap-1 hover:text-blue-400 transition-colors"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleShare(item.id, item.title);
                  }}
                >
                  <span>📤</span>
                  <span>{formatEngagement(item.shares)}</span>
                </button>
              </div>
              
              {item.aiScore && filter.type === 'personalized' && (
                <div className="text-xs text-yellow-400">
                  AI: {item.aiScore}%
                </div>
              )}
              
              {item.upvotes && filter.type === 'trending' && (
                <div className="text-xs text-red-400">
                  ↗ {formatEngagement(item.upvotes)}
                </div>
              )}
            </div>
          </div>
        ))}

        {getCurrentFeed().length === 0 && (
          <div className="text-center py-8">
            <div className="text-3xl mb-2">📰</div>
            <p className="text-sm text-muted-foreground">
              {activeTab === 'feed' && 'Нет новостей в ленте'}
              {activeTab === 'notifications' && 'Все уведомления прочитаны'}
              {activeTab === 'trending' && 'Нет трендовых новостей'}
            </p>
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
            onClick={() => showNotification('Обновляю ленту новостей...', 'info')}
          >
            <AnnouncementIcon size={12} />
            Обновить
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex-1 text-xs flex items-center gap-1 hover:bg-primary/20"
            onClick={() => showNotification('Настройки персонализации открыты', 'info')}
          >
            <SparklesIcon size={12} />
            Настроить AI
          </Button>
        </div>
      </div>
    </div>
  );
}; 