import React, { useState } from 'react';
import { Button } from '../../../ui/Button';
import { Badge } from '../../../ui/Badge';
import { NewsIcon, BellIcon, GroupUsersIcon, SparklesIcon } from '../../../icons';

// Типы для News & Updates Widget
interface NewsItem {
  id: string;
  title: string;
  type: 'update' | 'patch' | 'event' | 'maintenance';
  priority: 'low' | 'medium' | 'high' | 'critical';
  content: string;
  timestamp: Date;
  read: boolean;
  game?: string;
}

interface Announcement {
  id: string;
  title: string;
  content: string;
  type: 'general' | 'tournament' | 'maintenance' | 'feature';
  priority: 'low' | 'medium' | 'high';
  timestamp: Date;
  read: boolean;
  author: string;
}

interface FriendActivity {
  id: string;
  friendName: string;
  activity: string;
  game?: string;
  timestamp: Date;
  type: 'playing' | 'achievement' | 'status' | 'joined';
}

interface NewsUpdatesData {
  news: NewsItem[];
  announcements: Announcement[];
  friendsActivity: FriendActivity[];
  unreadCount: {
    news: number;
    announcements: number;
    friendsActivity: number;
  };
}

// Mockup данные
const mockNewsUpdatesData: NewsUpdatesData = {
  news: [
    {
      id: "1",
      title: "CS2 Major Update 1.3.5",
      type: "update",
      priority: "high",
      content: "Новые карты, исправления багов и балансировка оружия",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 часа назад
      read: false,
      game: "CS2"
    },
    {
      id: "2",
      title: "Valorant Episode 8 Act 2",
      type: "patch",
      priority: "medium",
      content: "Новый агент Clove и обновления карт",
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 часов назад
      read: true,
      game: "Valorant"
    },
    {
      id: "3",
      title: "Dota 2 The International",
      type: "event",
      priority: "critical",
      content: "Началась регистрация на крупнейший турнир года",
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 часов назад
      read: false,
      game: "Dota 2"
    }
  ],
  announcements: [
    {
      id: "1",
      title: "Техническое обслуживание серверов",
      content: "Запланированное обслуживание с 03:00 до 05:00 МСК",
      type: "maintenance",
      priority: "high",
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 час назад
      read: false,
      author: "Nebula Team"
    },
    {
      id: "2",
      title: "Новые функции в Discord интеграции",
      content: "Улучшенная синхронизация статуса и активности",
      type: "feature",
      priority: "medium",
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 часа назад
      read: true,
      author: "Dev Team"
    },
    {
      id: "3",
      title: "Еженедельный турнир по CS2",
      content: "Регистрация открыта до пятницы 18:00",
      type: "tournament",
      priority: "medium",
      timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 часов назад
      read: false,
      author: "Tournament Organizer"
    }
  ],
  friendsActivity: [
    {
      id: "1",
      friendName: "ProGamer_Elite",
      activity: "Достиг ранга Global Elite",
      game: "CS2",
      timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 минут назад
      type: "achievement"
    },
    {
      id: "2",
      friendName: "ValorantMaster",
      activity: "Играет в Valorant",
      game: "Valorant",
      timestamp: new Date(Date.now() - 45 * 60 * 1000), // 45 минут назад
      type: "playing"
    },
    {
      id: "3",
      friendName: "DotaLegend",
      activity: "Присоединился к серверу Dota 2 Pro",
      game: "Dota 2",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 часа назад
      type: "joined"
    }
  ],
  unreadCount: {
    news: 2,
    announcements: 2,
    friendsActivity: 3
  }
};

export const NewsUpdatesWidget: React.FC<object> = () => {
  const [activeTab, setActiveTab] = useState<'news' | 'announcements' | 'friends'>('news');
  const [data] = useState(mockNewsUpdatesData);

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (minutes < 60) {
      return `${minutes}м назад`;
    }
    if (hours < 24) {
      return `${hours}ч назад`;
    }
    const days = Math.floor(hours / 24);
    return `${days}д назад`;
  };

  const getGameColor = (game?: string) => {
    if (!game) return 'text-gray-400';
    switch (game) {
      case 'CS2': return 'text-orange-400';
      case 'Valorant': return 'text-red-400';
      case 'Dota 2': return 'text-blue-400';
      default: return 'text-gray-400';
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'critical':
        return <Badge variant="destructive" className="text-xs">КРИТИЧНО</Badge>;
      case 'high':
        return <Badge variant="warning" className="text-xs">ВАЖНО</Badge>;
      case 'medium':
        return <Badge variant="default" className="text-xs">СРЕДНЕ</Badge>;
      case 'low':
        return <Badge variant="default" className="text-xs">НИЗКО</Badge>;
      default:
        return null;
    }
  };

  const getNewsTypeEmoji = (type: string) => {
    switch (type) {
      case 'update': return '🔄';
      case 'patch': return '🛠️';
      case 'event': return '🎉';
      case 'maintenance': return '⚠️';
      case 'tournament': return '🏆';
      case 'feature': return '✨';
      case 'general': return '📢';
      default: return '📰';
    }
  };

  const getActivityEmoji = (type: string) => {
    switch (type) {
      case 'playing': return '🎮';
      case 'achievement': return '🏆';
      case 'status': return '💬';
      case 'joined': return '🚪';
      default: return '👤';
    }
  };

  const renderNews = () => (
    <div className="space-y-3">
      {data.news.map((item: NewsItem) => (
        <div 
          key={item.id}
          className={`p-3 rounded-lg border transition-colors duration-200 ${
            item.read 
              ? 'bg-card/30 border-border hover:border-border' 
              : 'bg-card/50 border-primary/30 hover:border-primary/50'
          }`}
        >
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-sm">{getNewsTypeEmoji(item.type)}</span>
                <span className="text-sm font-medium text-foreground">{item.title}</span>
                {item.game && (
                  <span className={`text-xs font-medium ${getGameColor(item.game)}`}>
                    {item.game}
                  </span>
                )}
                {getPriorityBadge(item.priority)}
              </div>
              <div className="text-xs text-muted-foreground mb-2">
                {item.content}
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">
                  {formatTimeAgo(item.timestamp)}
                </span>
                {!item.read && (
                  <span className="w-2 h-2 bg-primary rounded-full"></span>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderAnnouncements = () => (
    <div className="space-y-3">
      {data.announcements.map((announcement: Announcement) => (
        <div 
          key={announcement.id}
          className={`p-3 rounded-lg border transition-colors duration-200 ${
            announcement.read 
              ? 'bg-card/30 border-border hover:border-border' 
              : 'bg-card/50 border-primary/30 hover:border-primary/50'
          }`}
        >
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-sm">{getNewsTypeEmoji(announcement.type)}</span>
                <span className="text-sm font-medium text-foreground">{announcement.title}</span>
                {getPriorityBadge(announcement.priority)}
              </div>
              <div className="text-xs text-muted-foreground mb-2">
                {announcement.content}
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-blue-400">{announcement.author}</span>
                <div className="flex items-center space-x-2">
                  <span className="text-muted-foreground">
                    {formatTimeAgo(announcement.timestamp)}
                  </span>
                  {!announcement.read && (
                    <span className="w-2 h-2 bg-primary rounded-full"></span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderFriendsActivity = () => (
    <div className="space-y-3">
      {data.friendsActivity.map((activity: FriendActivity) => (
        <div 
          key={activity.id}
          className="p-3 rounded-lg bg-card/50 border border-border hover:border-primary/30 transition-colors duration-200"
        >
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-sm">{getActivityEmoji(activity.type)}</span>
                <span className="text-sm font-medium text-foreground">{activity.friendName}</span>
                {activity.game && (
                  <span className={`text-xs font-medium ${getGameColor(activity.game)}`}>
                    {activity.game}
                  </span>
                )}
              </div>
              <div className="text-xs text-muted-foreground mb-2">
                {activity.activity}
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">
                  {formatTimeAgo(activity.timestamp)}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="bg-card rounded-lg border border-border p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <NewsIcon size={16} className="text-primary" />
          <h3 className="text-sm font-medium text-foreground">Новости и обновления</h3>
        </div>
      </div>

      {/* Табы */}
      <div className="grid grid-cols-3 gap-1 mb-4 p-1 bg-card/30 rounded-lg">
        <button
          onClick={() => setActiveTab('news')}
          className={`py-2 px-3 text-xs font-medium rounded-md transition-colors duration-200 ${
            activeTab === 'news'
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:text-foreground hover:bg-card/50'
          }`}
        >
          <NewsIcon size={12} className="inline mr-1" />
          Новости
          {data.unreadCount.news > 0 && (
            <span className="ml-1 px-1.5 py-0.5 bg-destructive text-destructive-foreground rounded-full text-xs">
              {data.unreadCount.news}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('announcements')}
          className={`py-2 px-3 text-xs font-medium rounded-md transition-colors duration-200 ${
            activeTab === 'announcements'
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:text-foreground hover:bg-card/50'
          }`}
        >
          <BellIcon size={12} className="inline mr-1" />
          Объявления
          {data.unreadCount.announcements > 0 && (
            <span className="ml-1 px-1.5 py-0.5 bg-destructive text-destructive-foreground rounded-full text-xs">
              {data.unreadCount.announcements}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('friends')}
          className={`py-2 px-3 text-xs font-medium rounded-md transition-colors duration-200 ${
            activeTab === 'friends'
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:text-foreground hover:bg-card/50'
          }`}
        >
          <GroupUsersIcon size={12} className="inline mr-1" />
          Друзья
          {data.unreadCount.friendsActivity > 0 && (
            <span className="ml-1 px-1.5 py-0.5 bg-destructive text-destructive-foreground rounded-full text-xs">
              {data.unreadCount.friendsActivity}
            </span>
          )}
        </button>
      </div>

      {/* Контент */}
      <div className="min-h-[300px]">
        {activeTab === 'news' && renderNews()}
        {activeTab === 'announcements' && renderAnnouncements()}
        {activeTab === 'friends' && renderFriendsActivity()}
      </div>

      {/* Кнопки действий */}
      <div className="flex space-x-2 mt-4 pt-4 border-t border-border">
        <Button 
          variant="default" 
          className="flex-1 text-xs py-2"
          onClick={() => console.log('Отметить все как прочитанное')}
        >
          Прочитано
        </Button>
        <Button 
          variant="default" 
          className="flex-1 text-xs py-2"
          onClick={() => console.log('Все новости')}
        >
          <SparklesIcon size={14} className="mr-1" />
          Все новости
        </Button>
      </div>
    </div>
  );
}; 