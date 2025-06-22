import React, { useState } from 'react';
import { Button } from '../../../ui/Button';
import { Badge } from '../../../ui/Badge';
import { TrophyIcon, BarChartIcon, SparklesIcon, GameControllerIcon } from '../../../icons';

// Типы для Stats & Achievements Widget
interface GameStats {
  game: string;
  hoursPlayed: number;
  matchesWon: number;
  matchesTotal: number;
  currentRank: string;
  peakRank: string;
  killDeathRatio?: number;
  winRate: number;
  recentPerformance: 'up' | 'down' | 'stable';
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  game: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlockedAt: Date;
  progress?: number;
  maxProgress?: number;
  isUnlocked: boolean;
}

interface LeaderboardEntry {
  rank: number;
  playerName: string;
  game: string;
  rating: number;
  change: number;
  isCurrentUser?: boolean;
}

interface StatsAchievementsData {
  playerLevel: number;
  experience: number;
  experienceToNextLevel: number;
  totalPlayTime: number;
  gamesOwned: number;
  achievements: Achievement[];
  gameStats: GameStats[];
  leaderboards: LeaderboardEntry[];
  dailyStats: {
    gamesPlayed: number;
    hoursPlayed: number;
    achievementsUnlocked: number;
  };
  weeklyStats: {
    gamesPlayed: number;
    hoursPlayed: number;
    achievementsUnlocked: number;
  };
}

// Mockup данные
const mockStatsAchievementsData: StatsAchievementsData = {
  playerLevel: 47,
  experience: 8450,
  experienceToNextLevel: 10000,
  totalPlayTime: 1247,
  gamesOwned: 156,
  dailyStats: {
    gamesPlayed: 8,
    hoursPlayed: 4.5,
    achievementsUnlocked: 2
  },
  weeklyStats: {
    gamesPlayed: 42,
    hoursPlayed: 28.5,
    achievementsUnlocked: 7
  },
  gameStats: [
    {
      game: "CS2",
      hoursPlayed: 847,
      matchesWon: 423,
      matchesTotal: 651,
      currentRank: "Global Elite",
      peakRank: "Global Elite",
      killDeathRatio: 1.34,
      winRate: 65,
      recentPerformance: "up"
    },
    {
      game: "Valorant",
      hoursPlayed: 234,
      matchesWon: 156,
      matchesTotal: 298,
      currentRank: "Immortal 2",
      peakRank: "Radiant",
      killDeathRatio: 1.18,
      winRate: 52,
      recentPerformance: "stable"
    },
    {
      game: "Dota 2",
      hoursPlayed: 166,
      matchesWon: 87,
      matchesTotal: 145,
      currentRank: "Ancient 5",
      peakRank: "Divine 1",
      winRate: 60,
      recentPerformance: "down"
    }
  ],
  achievements: [
    {
      id: "1",
      title: "Первая кровь",
      description: "Получите первое убийство в матче",
      game: "CS2",
      rarity: "common",
      unlockedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      isUnlocked: true
    },
    {
      id: "2",
      title: "Ace мастер",
      description: "Убейте всю команду противника в одном раунде",
      game: "CS2",
      rarity: "epic",
      unlockedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
      isUnlocked: true
    },
    {
      id: "3",
      title: "Неудержимый",
      description: "Выиграйте 10 матчей подряд",
      game: "Valorant",
      rarity: "legendary",
      progress: 7,
      maxProgress: 10,
      unlockedAt: new Date(),
      isUnlocked: false
    },
    {
      id: "4",
      title: "Rampage",
      description: "Убейте 5 врагов без смерти",
      game: "Dota 2",
      rarity: "rare",
      unlockedAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
      isUnlocked: true
    }
  ],
  leaderboards: [
    {
      rank: 1,
      playerName: "ProGamer_Elite",
      game: "CS2",
      rating: 3247,
      change: 25
    },
    {
      rank: 2,
      playerName: "You",
      game: "CS2",
      rating: 3198,
      change: 12,
      isCurrentUser: true
    },
    {
      rank: 3,
      playerName: "ValoMaster_2024",
      game: "CS2",
      rating: 3156,
      change: -8
    },
    {
      rank: 4,
      playerName: "DotaLegend",
      game: "Valorant",
      rating: 2987,
      change: 18
    },
    {
      rank: 5,
      playerName: "SkillMaster",
      game: "Valorant",
      rating: 2934,
      change: -5
    }
  ]
};

export const StatsAchievementsWidget: React.FC<object> = () => {
  const [activeTab, setActiveTab] = useState<'stats' | 'achievements' | 'leaderboard'>('stats');
  const [data] = useState(mockStatsAchievementsData);

  const getGameColor = (game: string) => {
    switch (game) {
      case 'CS2': return 'text-orange-400';
      case 'Valorant': return 'text-red-400';
      case 'Dota 2': return 'text-blue-400';
      default: return 'text-gray-400';
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-400 bg-gray-400/10';
      case 'rare': return 'text-blue-400 bg-blue-400/10';
      case 'epic': return 'text-purple-400 bg-purple-400/10';
      case 'legendary': return 'text-yellow-400 bg-yellow-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
    }
  };

  const getPerformanceIcon = (performance: string) => {
    switch (performance) {
      case 'up': return '📈';
      case 'down': return '📉';
      case 'stable': return '➡️';
      default: return '➡️';
    }
  };

  const renderStats = () => (
    <div className="space-y-4">
      {/* Уровень игрока */}
      <div className="p-3 rounded-lg bg-card/50 border border-border">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-foreground">Уровень {data.playerLevel}</span>
          <span className="text-xs text-muted-foreground">
            {data.experience} / {data.experienceToNextLevel} XP
          </span>
        </div>
        <div className="w-full bg-card rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${(data.experience / data.experienceToNextLevel) * 100}%` }}
          />
        </div>
      </div>

      {/* Дневная и недельная статистика */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 rounded-lg bg-card/50 border border-border">
          <div className="text-xs font-medium text-muted-foreground mb-2">Сегодня</div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Игр:</span>
              <span className="text-foreground">{data.dailyStats.gamesPlayed}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Часов:</span>
              <span className="text-foreground">{data.dailyStats.hoursPlayed}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Достижений:</span>
              <span className="text-yellow-400">{data.dailyStats.achievementsUnlocked}</span>
            </div>
          </div>
        </div>

        <div className="p-3 rounded-lg bg-card/50 border border-border">
          <div className="text-xs font-medium text-muted-foreground mb-2">За неделю</div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Игр:</span>
              <span className="text-foreground">{data.weeklyStats.gamesPlayed}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Часов:</span>
              <span className="text-foreground">{data.weeklyStats.hoursPlayed}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Достижений:</span>
              <span className="text-yellow-400">{data.weeklyStats.achievementsUnlocked}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Статистика по играм */}
      <div className="space-y-3">
        {data.gameStats.map((stats: GameStats, index: number) => (
          <div 
            key={index}
            className="p-3 rounded-lg bg-card/50 border border-border"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <span className={`text-sm font-medium ${getGameColor(stats.game)}`}>
                  {stats.game}
                </span>
                <span className="text-xs">{getPerformanceIcon(stats.recentPerformance)}</span>
              </div>
              <div className="text-xs text-muted-foreground">
                {stats.hoursPlayed}ч
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Ранг:</span>
                <span className="text-foreground">{stats.currentRank}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Винрейт:</span>
                <span className="text-green-400">{stats.winRate}%</span>
              </div>
              {stats.killDeathRatio && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">K/D:</span>
                  <span className="text-foreground">{stats.killDeathRatio}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Матчи:</span>
                <span className="text-foreground">{stats.matchesWon}/{stats.matchesTotal}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAchievements = () => (
    <div className="space-y-3">
      {data.achievements.map((achievement: Achievement) => (
        <div 
          key={achievement.id}
          className={`p-3 rounded-lg border transition-colors duration-200 ${
            achievement.isUnlocked 
              ? 'bg-card/50 border-border hover:border-primary/30' 
              : 'bg-card/30 border-border/50'
          }`}
        >
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-sm font-medium text-foreground">{achievement.title}</span>
                <span className={`text-xs font-medium ${getGameColor(achievement.game)}`}>
                  {achievement.game}
                </span>
                <Badge 
                  variant="default" 
                  className={`text-xs px-1.5 py-0.5 ${getRarityColor(achievement.rarity)}`}
                >
                  {achievement.rarity.toUpperCase()}
                </Badge>
              </div>
              <div className="text-xs text-muted-foreground mb-2">
                {achievement.description}
              </div>
              
              {/* Прогресс для незавершенных достижений */}
              {!achievement.isUnlocked && achievement.progress && achievement.maxProgress && (
                <div className="mb-2">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-muted-foreground">Прогресс</span>
                    <span className="text-foreground">
                      {achievement.progress}/{achievement.maxProgress}
                    </span>
                  </div>
                  <div className="w-full bg-card rounded-full h-1.5">
                    <div 
                      className="bg-primary h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                    />
                  </div>
                </div>
              )}
              
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">
                  {achievement.isUnlocked ? 'Получено' : 'В процессе'}
                </span>
                {achievement.isUnlocked && (
                  <span className="text-yellow-400">🏆</span>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderLeaderboard = () => (
    <div className="space-y-3">
      {data.leaderboards.map((entry: LeaderboardEntry) => (
        <div 
          key={entry.rank}
          className={`p-3 rounded-lg border transition-colors duration-200 ${
            entry.isCurrentUser 
              ? 'bg-primary/10 border-primary/30 hover:border-primary/50' 
              : 'bg-card/50 border-border hover:border-primary/30'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                entry.rank === 1 ? 'bg-yellow-400/20 text-yellow-400' :
                entry.rank === 2 ? 'bg-gray-400/20 text-gray-400' :
                entry.rank === 3 ? 'bg-orange-400/20 text-orange-400' :
                'bg-card text-muted-foreground'
              }`}>
                {entry.rank}
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className={`text-sm font-medium ${entry.isCurrentUser ? 'text-primary' : 'text-foreground'}`}>
                    {entry.playerName}
                  </span>
                  <span className={`text-xs font-medium ${getGameColor(entry.game)}`}>
                    {entry.game}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground">
                  MMR: {entry.rating}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className={`text-xs font-medium ${
                entry.change > 0 ? 'text-green-400' : 
                entry.change < 0 ? 'text-red-400' : 
                'text-muted-foreground'
              }`}>
                {entry.change > 0 ? '+' : ''}{entry.change}
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
          <TrophyIcon size={16} className="text-primary" />
          <h3 className="text-sm font-medium text-foreground">Статистика и достижения</h3>
        </div>
      </div>

      {/* Табы */}
      <div className="grid grid-cols-3 gap-1 mb-4 p-1 bg-card/30 rounded-lg">
        <button
          onClick={() => setActiveTab('stats')}
          className={`py-2 px-3 text-xs font-medium rounded-md transition-colors duration-200 ${
            activeTab === 'stats'
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:text-foreground hover:bg-card/50'
          }`}
        >
          <BarChartIcon size={12} className="inline mr-1" />
          Статистика
        </button>
        <button
          onClick={() => setActiveTab('achievements')}
          className={`py-2 px-3 text-xs font-medium rounded-md transition-colors duration-200 ${
            activeTab === 'achievements'
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:text-foreground hover:bg-card/50'
          }`}
        >
          <TrophyIcon size={12} className="inline mr-1" />
          Достижения
        </button>
        <button
          onClick={() => setActiveTab('leaderboard')}
          className={`py-2 px-3 text-xs font-medium rounded-md transition-colors duration-200 ${
            activeTab === 'leaderboard'
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:text-foreground hover:bg-card/50'
          }`}
        >
          <SparklesIcon size={12} className="inline mr-1" />
          Рейтинги
        </button>
      </div>

      {/* Контент */}
      <div className="min-h-[300px]">
        {activeTab === 'stats' && renderStats()}
        {activeTab === 'achievements' && renderAchievements()}
        {activeTab === 'leaderboard' && renderLeaderboard()}
      </div>

      {/* Кнопки действий */}
      <div className="flex space-x-2 mt-4 pt-4 border-t border-border">
        <Button 
          variant="default" 
          className="flex-1 text-xs py-2"
          onClick={() => console.log('Детальная статистика')}
        >
          <BarChartIcon size={14} className="mr-1" />
          Подробнее
        </Button>
        <Button 
          variant="default" 
          className="flex-1 text-xs py-2"
          onClick={() => console.log('Поделиться достижениями')}
        >
          <GameControllerIcon size={14} className="mr-1" />
          Поделиться
        </Button>
      </div>
    </div>
  );
}; 