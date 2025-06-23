import React, { useState, useEffect } from 'react';
import { Button } from '../../../ui/Button';
import { Badge } from '../../../ui/Badge';
import { 
  TrophyIcon, 
  CalendarIcon, 
  SparklesIcon
} from '../../../icons';

// Локальные типы для полной независимости виджета
interface Tournament {
  id: string;
  name: string;
  game: string;
  status: 'live' | 'upcoming' | 'registration' | 'ended';
  participants: number;
  maxParticipants: number;
  prizePool: number;
  startTime: Date;
  endTime: Date;
  description: string;
  organizer: string;
  format: string;
  isRegistered: boolean;
  viewerCount?: number;
  registrationDeadline?: Date;
  difficulty: 'casual' | 'competitive' | 'pro';
  isHot?: boolean;
  liveScore?: string;
}

interface Notification {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'live';
  duration?: number;
}

interface CountdownTimer {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isNow?: boolean;
  isEnded?: boolean;
}

interface EventsTournamentsWidgetProps {
  animationDelay?: number;
}

export const EventsTournamentsWidget: React.FC<EventsTournamentsWidgetProps> = ({
  animationDelay = 0
}) => {
  const [activeTab, setActiveTab] = useState<'live' | 'upcoming' | 'my'>('live');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [tournaments, setTournaments] = useState<Tournament[]>([
    {
      id: "1",
      name: "CS2 Major Finals",
      game: "CS2",
      status: "live",
      participants: 16,
      maxParticipants: 16,
      prizePool: 1000000,
      startTime: new Date(Date.now() - 45 * 60 * 1000), // 45 мин назад
      endTime: new Date(Date.now() + 75 * 60 * 1000), // 75 мин
      description: "Финал крупнейшего турнира года",
      organizer: "ESL",
      format: "BO5",
      isRegistered: false,
      viewerCount: 125000,
      difficulty: 'pro',
      isHot: true,
      liveScore: "NaVi 2:1 G2"
    },
    {
      id: "2", 
      name: "Valorant Night Cup",
      game: "Valorant",
      status: "live",
      participants: 8,
      maxParticipants: 16,
      prizePool: 25000,
      startTime: new Date(Date.now() - 20 * 60 * 1000),
      endTime: new Date(Date.now() + 100 * 60 * 1000),
      description: "Вечерний турнир для профи",
      organizer: "Riot Games",
      format: "Single Elim",
      isRegistered: false,
      viewerCount: 15000,
      difficulty: 'competitive',
      liveScore: "Team Liquid vs FNC"
    },
    {
      id: "3",
      name: "Dota 2 International",
      game: "Dota 2", 
      status: "upcoming",
      participants: 0,
      maxParticipants: 18,
      prizePool: 15000000,
      startTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      endTime: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      description: "Крупнейший турнир по Dota 2",
      organizer: "Valve",
      format: "Groups + Playoffs",
      isRegistered: false,
      registrationDeadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      difficulty: 'pro',
      isHot: true
    },
    {
      id: "4",
      name: "Community CS2 5v5",
      game: "CS2",
      status: "registration",
      participants: 12,
      maxParticipants: 32,
      prizePool: 5000,
      startTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // через 2 часа
      endTime: new Date(Date.now() + 5 * 60 * 60 * 1000),
      description: "Открытый турнир для всех",
      organizer: "Nebula Community",
      format: "Swiss System",
      isRegistered: true,
      registrationDeadline: new Date(Date.now() + 90 * 60 * 1000), // 1.5 часа
      difficulty: 'casual'
    },
    {
      id: "5",
      name: "Apex Legends ALGS",
      game: "Apex Legends",
      status: "upcoming",
      participants: 45,
      maxParticipants: 60,
      prizePool: 500000,
      startTime: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      endTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      description: "Apex Legends Global Series",
      organizer: "EA Sports",
      format: "Battle Royale",
      isRegistered: false,
      registrationDeadline: new Date(Date.now() + 18 * 60 * 60 * 1000),
      difficulty: 'competitive',
      isHot: true
    }
  ]);

  // Live countdown для каждого турнира
  const [countdowns, setCountdowns] = useState<Record<string, CountdownTimer>>({});

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

  // Обновление countdown таймеров каждую секунду
  useEffect(() => {
    const updateCountdowns = () => {
      const newCountdowns: Record<string, CountdownTimer> = {};
      
      tournaments.forEach(tournament => {
        const now = new Date().getTime();
        const targetTime = tournament.status === 'live' 
          ? tournament.endTime.getTime() 
          : tournament.startTime.getTime();
        
        const diff = targetTime - now;
        
        if (diff <= 0) {
          if (tournament.status === 'live') {
            newCountdowns[tournament.id] = {
              days: 0, hours: 0, minutes: 0, seconds: 0, isEnded: true
            };
          } else {
            newCountdowns[tournament.id] = {
              days: 0, hours: 0, minutes: 0, seconds: 0, isNow: true
            };
          }
        } else {
          const days = Math.floor(diff / (1000 * 60 * 60 * 24));
          const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((diff % (1000 * 60)) / 1000);
          
          newCountdowns[tournament.id] = { days, hours, minutes, seconds };
        }
      });
      
      setCountdowns(newCountdowns);
    };

    updateCountdowns();
    const interval = setInterval(updateCountdowns, 1000);
    return () => clearInterval(interval);
  }, [tournaments]);

  // Симуляция live событий
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() < 0.4) {
        const liveEvents = [
          '🏆 CS2 Major: NaVi побеждает в раунде!',
          '🔥 Valorant: Team Liquid делает Ace!',
          '⚡ Новый турнир открыт для регистрации!',
          '🎯 Apex ALGS: Triple kill от TSM!'
        ];
        
        const randomEvent = liveEvents[Math.floor(Math.random() * liveEvents.length)];
        showNotification(randomEvent, 'live', 4000);
      }
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  // Симуляция изменений viewers
  useEffect(() => {
    const interval = setInterval(() => {
      setTournaments(prev => prev.map(tournament => {
        if (tournament.status === 'live' && tournament.viewerCount) {
          const change = Math.floor(Math.random() * 2000) - 1000; // ±1000
          const newViewers = Math.max(1000, tournament.viewerCount + change);
          return { ...tournament, viewerCount: newViewers };
        }
        return tournament;
      }));
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const formatPrizePool = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    }
    if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`;
    }
    return `$${amount}`;
  };

  const formatViewers = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(0)}K`;
    }
    return count.toString();
  };

  const getGameColor = (game: string) => {
    switch (game) {
      case 'CS2': return 'text-orange-400';
      case 'Valorant': return 'text-red-400';
      case 'Dota 2': return 'text-blue-400';
      case 'Apex Legends': return 'text-purple-400';
      default: return 'text-gray-400';
    }
  };

  const getDifficultyBadge = (difficulty: Tournament['difficulty']) => {
    switch (difficulty) {
      case 'casual':
        return <Badge variant="default" className="text-xs bg-green-500/20 text-green-400">Casual</Badge>;
      case 'competitive':
        return <Badge variant="default" className="text-xs bg-yellow-500/20 text-yellow-400">Competitive</Badge>;
      case 'pro':
        return <Badge variant="default" className="text-xs bg-red-500/20 text-red-400">Pro</Badge>;
    }
  };

  const handleRegister = (tournament: Tournament) => {
    if (tournament.isRegistered) {
      showNotification(`Вы отменили регистрацию на ${tournament.name}`, 'info');
      setTournaments(prev => prev.map(t => 
        t.id === tournament.id ? { ...t, isRegistered: false, participants: t.participants - 1 } : t
      ));
    } else {
      showNotification(`🎮 Регистрация на ${tournament.name} успешна!`, 'success');
      setTournaments(prev => prev.map(t => 
        t.id === tournament.id ? { ...t, isRegistered: true, participants: t.participants + 1 } : t
      ));
    }
  };

  const handleWatch = (tournament: Tournament) => {
    showNotification(`📺 Открываю трансляцию ${tournament.name}...`, 'info');
    // Симуляция увеличения viewers
    setTimeout(() => {
      setTournaments(prev => prev.map(t => 
        t.id === tournament.id && t.viewerCount ? { ...t, viewerCount: t.viewerCount + 1 } : t
      ));
    }, 1000);
  };

  const renderCountdown = (tournament: Tournament) => {
    const countdown = countdowns[tournament.id];
    if (!countdown) return null;

    if (countdown.isEnded) {
      return <span className="text-xs text-red-400 font-mono">ЗАВЕРШЕН</span>;
    }
    
    if (countdown.isNow && tournament.status !== 'live') {
      return <span className="text-xs text-green-400 font-mono animate-pulse">НАЧАЛСЯ!</span>;
    }

    const { days, hours, minutes, seconds } = countdown;
    
    if (tournament.status === 'live') {
      return (
        <span className="text-xs text-red-400 font-mono">
          Осталось: {hours.toString().padStart(2, '0')}:{minutes.toString().padStart(2, '0')}:{seconds.toString().padStart(2, '0')}
        </span>
      );
    }

    if (days > 0) {
      return <span className="text-xs text-blue-400 font-mono">{days}д {hours}ч {minutes}м</span>;
    }
    
    if (hours > 0) {
      return <span className="text-xs text-yellow-400 font-mono">{hours}ч {minutes}м {seconds}с</span>;
    }
    
    return <span className="text-xs text-red-400 font-mono animate-pulse">{minutes}м {seconds}с</span>;
  };

  const liveTournaments = tournaments.filter(t => t.status === 'live');
  const upcomingTournaments = tournaments.filter(t => t.status === 'upcoming' || t.status === 'registration');
  const myTournaments = tournaments.filter(t => t.isRegistered);

  const getCurrentTournaments = () => {
    switch (activeTab) {
      case 'live': return liveTournaments;
      case 'upcoming': return upcomingTournaments;
      case 'my': return myTournaments;
      default: return [];
    }
  };

  return (
    <div 
      className="bg-card/95 backdrop-blur-sm border border-border rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300"
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      {/* Заголовок */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-primary/20 rounded-lg">
            <TrophyIcon size={20} className="text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">Турниры и события</h3>
            <p className="text-xs text-muted-foreground">
              {liveTournaments.length} турниров live
            </p>
          </div>
        </div>
        
        {/* Live индикатор */}
        {liveTournaments.length > 0 && (
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span className="text-xs text-red-400 font-medium">LIVE</span>
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
                notification.type === 'live' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                'bg-blue-500/20 text-blue-400 border border-blue-500/30'
              }`}
            >
              {notification.message}
            </div>
          ))}
        </div>
      )}

      {/* Табы */}
      <div className="flex space-x-1 bg-muted/50 rounded-lg p-1 mb-4">
        <button
          onClick={() => setActiveTab('live')}
          className={`flex-1 py-2 px-3 rounded-md text-xs font-medium transition-all duration-200 ${
            activeTab === 'live'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <div className="flex items-center justify-center gap-1">
            Live ({liveTournaments.length})
            {liveTournaments.length > 0 && <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />}
          </div>
        </button>
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`flex-1 py-2 px-3 rounded-md text-xs font-medium transition-all duration-200 ${
            activeTab === 'upcoming'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Скоро ({upcomingTournaments.length})
        </button>
        <button
          onClick={() => setActiveTab('my')}
          className={`flex-1 py-2 px-3 rounded-md text-xs font-medium transition-all duration-200 ${
            activeTab === 'my'
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Мои ({myTournaments.length})
        </button>
      </div>

      {/* Контент */}
      <div className="space-y-2 min-h-[120px]">
        {getCurrentTournaments().slice(0, 3).map((tournament) => (
          <div 
            key={tournament.id}
            className="p-3 bg-accent/30 rounded-lg border border-border/50 hover:bg-accent/50 transition-all duration-200 group"
          >
            {/* Заголовок турнира */}
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-sm font-medium text-foreground">{tournament.name}</h4>
                  {tournament.isHot && <SparklesIcon size={12} className="text-yellow-400" />}
                  {tournament.status === 'live' && (
                    <Badge variant="default" className="text-xs bg-red-500/20 text-red-400">LIVE</Badge>
                  )}
                  {tournament.status === 'registration' && (
                    <Badge variant="default" className="text-xs bg-green-500/20 text-green-400">РЕГИСТРАЦИЯ</Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className={getGameColor(tournament.game)}>{tournament.game}</span>
                  <span>•</span>
                  <span>{formatPrizePool(tournament.prizePool)}</span>
                  <span>•</span>
                  <span>{tournament.participants}/{tournament.maxParticipants}</span>
                  {getDifficultyBadge(tournament.difficulty)}
                </div>
              </div>
            </div>

            {/* Live score для live турниров */}
            {tournament.status === 'live' && tournament.liveScore && (
              <div className="mb-2 p-2 bg-red-500/10 border border-red-500/20 rounded text-xs">
                <span className="text-red-400 font-medium">🔴 {tournament.liveScore}</span>
                {tournament.viewerCount && (
                  <span className="text-muted-foreground ml-2">
                    👥 {formatViewers(tournament.viewerCount)} viewers
                  </span>
                )}
              </div>
            )}

            {/* Countdown */}
            <div className="mb-2">
              {renderCountdown(tournament)}
            </div>

            {/* Действия */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {tournament.status === 'live' ? (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="h-6 px-2 text-xs text-red-400 hover:bg-red-500/20"
                    onClick={() => handleWatch(tournament)}
                  >
                    📺 Смотреть
                  </Button>
                ) : (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className={`h-6 px-2 text-xs ${
                      tournament.isRegistered 
                        ? 'text-green-400 hover:bg-green-500/20' 
                        : 'text-blue-400 hover:bg-blue-500/20'
                    }`}
                    onClick={() => handleRegister(tournament)}
                  >
                    {tournament.isRegistered ? '✓ Зарегистрирован' : '🎮 Участвовать'}
                  </Button>
                )}
              </div>
              
              <div className="text-xs text-muted-foreground">
                {tournament.organizer}
              </div>
            </div>
          </div>
        ))}

        {getCurrentTournaments().length === 0 && (
          <div className="text-center py-6">
            <div className="text-3xl mb-2">🏆</div>
            <p className="text-sm text-muted-foreground">
              {activeTab === 'live' && 'Нет активных турниров'}
              {activeTab === 'upcoming' && 'Нет предстоящих турниров'}
              {activeTab === 'my' && 'Вы не участвуете в турнирах'}
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
            onClick={() => showNotification('Открываю браузер турниров...', 'info')}
          >
            <CalendarIcon size={12} />
            Все турниры
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex-1 text-xs flex items-center gap-1 hover:bg-primary/20"
            onClick={() => showNotification('Создаю новый турнир...', 'info')}
          >
            <TrophyIcon size={12} />
            Создать
          </Button>
        </div>
      </div>
    </div>
  );
}; 