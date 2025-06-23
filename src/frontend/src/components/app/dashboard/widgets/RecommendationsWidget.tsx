import React, { useState } from 'react';
import { Button } from '../../../ui/Button';
import { Badge } from '../../../ui/Badge';
import { SparklesIcon, GameControllerIcon, GroupUsersIcon, TrophyIcon } from '../../../icons';

// Типы для Recommendations Widget
interface RecommendedServer {
  id: string;
  name: string;
  game: string;
  description: string;
  memberCount: number;
  tags: string[];
  rating: number;
  reason: string;
}

interface RecommendedGame {
  id: string;
  name: string;
  genre: string;
  rating: number;
  friendsCount: number;
  reason: string;
  onSale: boolean;
}

interface RecommendedFriend {
  id: string;
  name: string;
  avatar?: string;
  mutualFriends: number;
  commonGames: string[];
  reason: string;
}

interface TrendingContent {
  id: string;
  title: string;
  type: string;
  category: string;
  engagement: number;
  timeframe: string;
}

interface RecommendationsData {
  recommendedServers: RecommendedServer[];
  recommendedGames: RecommendedGame[];
  recommendedFriends: RecommendedFriend[];
  trendingContent: TrendingContent[];
}

// Mockup данные
const mockRecommendationsData: RecommendationsData = {
  recommendedServers: [
    {
      id: "1",
      name: "CS2 Competitive Pro",
      game: "CS2",
      description: "Высококонкурентный сервер с хорошей модерацией",
      memberCount: 1247,
      tags: ["competitive", "pro", "russia"],
      rating: 4.8,
      reason: "Похожие интересы"
    },
    {
      id: "2",
      name: "Valorant Champions",
      game: "Valorant", 
      description: "Сервер для топ игроков Valorant",
      memberCount: 892,
      tags: ["champions", "skilled", "tournaments"],
      rating: 4.6,
      reason: "Высокий ранг"
    },
    {
      id: "3",
      name: "Dota 2 CIS",
      game: "Dota 2",
      description: "Крупнейшее сообщество Dota 2 в СНГ",
      memberCount: 3421,
      tags: ["cis", "russian", "friendly"],
      rating: 4.4,
      reason: "Популярен среди друзей"
    }
  ],
  recommendedGames: [
    {
      id: "1",
      name: "Apex Legends",
      genre: "Battle Royale",
      rating: 4.5,
      friendsCount: 15,
      reason: "15 друзей играют",
      onSale: true
    },
    {
      id: "2", 
      name: "Rocket League",
      genre: "Sports",
      rating: 4.7,
      friendsCount: 8,
      reason: "Похожие игры",
      onSale: false
    },
    {
      id: "3",
      name: "Among Us",
      genre: "Social Deduction", 
      rating: 4.2,
      friendsCount: 12,
      reason: "Трендинг в группе",
      onSale: true
    }
  ],
  recommendedFriends: [
    {
      id: "1",
      name: "ProGamer_Elite",
      avatar: undefined,
      mutualFriends: 5,
      commonGames: ["CS2", "Valorant"],
      reason: "Общие друзья"
    },
    {
      id: "2",
      name: "DotaMaster_2024", 
      avatar: undefined,
      mutualFriends: 3,
      commonGames: ["Dota 2"],
      reason: "Похожий стиль игры"
    },
    {
      id: "3",
      name: "TeamPlayer_Pro",
      avatar: undefined,
      mutualFriends: 7,
      commonGames: ["CS2", "Valorant", "Apex"],
      reason: "Активен в командных играх"
    }
  ],
  trendingContent: [
    {
      id: "1",
      title: "CS2 Major Guide",
      type: "guide",
      category: "CS2",
      engagement: 1250,
      timeframe: "Эта неделя"
    },
    {
      id: "2",
      title: "Valorant Pro Tournament",
      type: "tournament", 
      category: "Valorant",
      engagement: 890,
      timeframe: "Сегодня"
    },
    {
      id: "3",
      title: "Dota 2 Meta Analysis",
      type: "guide",
      category: "Dota 2", 
      engagement: 675,
      timeframe: "Вчера"
    }
  ]
};

export const RecommendationsWidget: React.FC<object> = () => {
  const [activeTab, setActiveTab] = useState<'servers' | 'games' | 'friends' | 'trending'>('servers');
  const [data] = useState(mockRecommendationsData);

  const getGameColor = (game: string) => {
    switch (game) {
      case 'CS2': return 'text-orange-400';
      case 'Valorant': return 'text-red-400';
      case 'Dota 2': return 'text-blue-400';
      case 'Apex Legends': return 'text-purple-400';
      default: return 'text-gray-400';
    }
  };

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'tournament': return '🏆';
      case 'guide': return '📖';
      case 'stream': return '📺';
      case 'server': return '🖥️';
      default: return '📄';
    }
  };

  const renderServers = () => (
    <div className="space-y-3">
      {data.recommendedServers.map((server: RecommendedServer) => (
        <div 
          key={server.id}
          className="p-3 rounded-lg bg-card/50 border border-border hover:border-primary/30 transition-colors duration-200"
        >
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-sm font-medium text-foreground">{server.name}</span>
                <span className={`text-xs font-medium ${getGameColor(server.game)}`}>
                  {server.game}
                </span>
                <div className="flex items-center space-x-1">
                  <span className="text-yellow-400">⭐</span>
                  <span className="text-xs text-foreground">{server.rating}</span>
                </div>
              </div>
              <div className="text-xs text-muted-foreground mb-2">
                {server.description}
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">
                  {server.memberCount.toLocaleString()} участников
                </span>
                <span className="text-blue-400">{server.reason}</span>
              </div>
            </div>
          </div>
          <div className="mt-2">
            <Button
              size="sm"
              variant="primary"
              onClick={() => console.log('Подключиться к серверу:', server.name)}
            >
              Подключиться
            </Button>
          </div>
        </div>
      ))}
    </div>
  );

  const renderGames = () => (
    <div className="space-y-3">
      {data.recommendedGames.map((game: RecommendedGame) => (
        <div 
          key={game.id}
          className="p-3 rounded-lg bg-card/50 border border-border hover:border-primary/30 transition-colors duration-200"
        >
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-sm font-medium text-foreground">{game.name}</span>
                {game.onSale && (
                  <Badge variant="destructive" className="text-xs px-1.5 py-0.5">
                    СКИДКА
                  </Badge>
                )}
                <div className="flex items-center space-x-1">
                  <span className="text-yellow-400">⭐</span>
                  <span className="text-xs text-foreground">{game.rating}</span>
                </div>
              </div>
              <div className="text-xs text-muted-foreground mb-2">
                {game.genre} • {game.reason}
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">
                  {game.friendsCount} друзей играют
                </span>
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => console.log('Скачать игру:', game.name)}
                >
                  Скачать
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderFriends = () => (
    <div className="space-y-3">
      {data.recommendedFriends.map((friend: RecommendedFriend) => (
        <div 
          key={friend.id}
          className="p-3 rounded-lg bg-card/50 border border-border hover:border-primary/30 transition-colors duration-200"
        >
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium text-primary">
                    {friend.name.substring(0, 2).toUpperCase()}
                  </span>
                </div>
                <span className="text-sm font-medium text-foreground">{friend.name}</span>
              </div>
              <div className="text-xs text-muted-foreground mb-2">
                {friend.mutualFriends} общих друзей • {friend.commonGames.join(', ')}
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-blue-400">{friend.reason}</span>
                <Button 
                  variant="primary" 
                  className="text-xs py-1 px-2 h-auto"
                  onClick={() => console.log('Добавить в друзья:', friend.name)}
                >
                  Добавить
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderTrending = () => (
    <div className="space-y-3">
      {data.trendingContent.map((content: TrendingContent) => (
        <div 
          key={content.id}
          className="p-3 rounded-lg bg-card/50 border border-border hover:border-primary/30 transition-colors duration-200"
        >
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-sm">{getContentTypeIcon(content.type)}</span>
                <span className="text-sm font-medium text-foreground">{content.title}</span>
                <span className={`text-xs font-medium ${getGameColor(content.category)}`}>
                  {content.category}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">
                  {content.engagement.toLocaleString()} взаимодействий
                </span>
                <span className="text-blue-400">{content.timeframe}</span>
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
          <SparklesIcon size={16} className="text-primary" />
          <h3 className="text-sm font-medium text-foreground">Рекомендации</h3>
        </div>
      </div>

      {/* Табы */}
      <div className="grid grid-cols-4 gap-1 mb-4 p-1 bg-card/30 rounded-lg">
        <button
          onClick={() => setActiveTab('servers')}
          className={`py-2 px-2 text-xs font-medium rounded-md transition-colors duration-200 ${
            activeTab === 'servers'
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:text-foreground hover:bg-card/50'
          }`}
        >
          <GroupUsersIcon size={12} className="inline mr-1" />
          Серверы
        </button>
        <button
          onClick={() => setActiveTab('games')}
          className={`py-2 px-2 text-xs font-medium rounded-md transition-colors duration-200 ${
            activeTab === 'games'
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:text-foreground hover:bg-card/50'
          }`}
        >
          <GameControllerIcon size={12} className="inline mr-1" />
          Игры
        </button>
        <button
          onClick={() => setActiveTab('friends')}
          className={`py-2 px-2 text-xs font-medium rounded-md transition-colors duration-200 ${
            activeTab === 'friends'
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:text-foreground hover:bg-card/50'
          }`}
        >
          <GroupUsersIcon size={12} className="inline mr-1" />
          Друзья
        </button>
        <button
          onClick={() => setActiveTab('trending')}
          className={`py-2 px-2 text-xs font-medium rounded-md transition-colors duration-200 ${
            activeTab === 'trending'
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:text-foreground hover:bg-card/50'
          }`}
        >
          <TrophyIcon size={12} className="inline mr-1" />
          Тренды
        </button>
      </div>

      {/* Контент */}
      <div className="min-h-[300px]">
        {activeTab === 'servers' && renderServers()}
        {activeTab === 'games' && renderGames()}
        {activeTab === 'friends' && renderFriends()}
        {activeTab === 'trending' && renderTrending()}
      </div>

      {/* Кнопки действий */}
      <div className="flex space-x-2 mt-4 pt-4 border-t border-border">
        <Button
          variant="primary"
          className="w-full"
          onClick={() => console.log('Больше рекомендаций')}
        >
          Больше
        </Button>
        <Button
          variant="secondary"
          className="w-full"
          onClick={() => console.log('Настроить рекомендации')}
        >
          Настроить
        </Button>
      </div>
    </div>
  );
}; 