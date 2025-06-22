import React, { useState } from 'react';
import { Button } from '../../../ui/Button';
import { Badge } from '../../../ui/Badge';
import { 
  TrophyIcon, 
  CalendarIcon, 
  GroupUsersIcon,
  GameControllerIcon,
  SparklesIcon
} from '../../../icons';

// Типы для Events & Tournaments Widget
interface EventsTournament {
  id: string;
  name: string;
  game: string;
  status: 'live' | 'upcoming' | 'registration';
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
}

interface EventsTournamentsData {
  liveTournaments: EventsTournament[];
  upcomingEvents: EventsTournament[];
  communityEvents: EventsTournament[];
}

// Mockup данные
const mockEventsTournamentsData: EventsTournamentsData = {
  liveTournaments: [
    {
      id: "1",
      name: "CS2 Major Championship",
      game: "CS2",
      status: "live",
      participants: 16,
      maxParticipants: 16,
      prizePool: 1000000,
      startTime: new Date(),
      endTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 часа
      description: "Финал чемпионата мира по CS2",
      organizer: "ESL",
      format: "Single Elimination",
      isRegistered: false,
      viewerCount: 125000
    },
    {
      id: "2", 
      name: "Valorant Pro Series",
      game: "Valorant",
      status: "live",
      participants: 8,
      maxParticipants: 16,
      prizePool: 250000,
      startTime: new Date(Date.now() - 30 * 60 * 1000), // 30 мин назад
      endTime: new Date(Date.now() + 3 * 60 * 60 * 1000), // 3 часа
      description: "Профессиональная серия турниров",
      organizer: "Riot Games",
      format: "Double Elimination",
      isRegistered: false,
      viewerCount: 45000
    }
  ],
  upcomingEvents: [
    {
      id: "3",
      name: "Dota 2 International",
      game: "Dota 2", 
      status: "upcoming",
      participants: 0,
      maxParticipants: 18,
      prizePool: 15000000,
      startTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 дней
      endTime: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 дней
      description: "Крупнейший турнир по Dota 2",
      organizer: "Valve",
      format: "Group Stage + Playoffs",
      isRegistered: false,
      registrationDeadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
    },
    {
      id: "4",
      name: "Apex Legends ALGS",
      game: "Apex Legends",
      status: "upcoming",
      participants: 12,
      maxParticipants: 20,
      prizePool: 500000,
      startTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 дня
      endTime: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // 4 дня
      description: "Apex Legends Global Series",
      organizer: "EA Sports",
      format: "Battle Royale",
      isRegistered: true,
      registrationDeadline: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000)
    }
  ],
  communityEvents: [
    {
      id: "5",
      name: "CS2 Community Cup",
      game: "CS2",
      status: "upcoming",
      participants: 24,
      maxParticipants: 32,
      prizePool: 5000,
      startTime: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // завтра
      endTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // послезавтра
      description: "Любительский турнир сообщества",
      organizer: "Gaming Community",
      format: "Swiss System",
      isRegistered: false,
      registrationDeadline: new Date(Date.now() + 12 * 60 * 60 * 1000)
    },
    {
      id: "6",
      name: "Valorant Friday Night",
      game: "Valorant",
      status: "registration",
      participants: 8,
      maxParticipants: 16,
      prizePool: 1000,
      startTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // неделя
      endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000),
      description: "Еженедельный турнир по пятницам",
      organizer: "Nebula Community",
      format: "Single Elimination",
      isRegistered: true,
      registrationDeadline: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000)
    }
  ]
};

export const EventsTournamentsWidget: React.FC<object> = () => {
  const [activeTab, setActiveTab] = useState<'live' | 'upcoming' | 'community'>('live');
  const [data] = useState(mockEventsTournamentsData);

  const formatTimeRemaining = (endTime: Date) => {
    const now = new Date();
    const diff = endTime.getTime() - now.getTime();
    
    if (diff <= 0) return "Завершен";
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days}д`;
    }
    if (hours > 0) {
      return `${hours}ч ${minutes}м`;
    }
    return `${minutes}м`;
  };

  const formatStartTime = (startTime: Date) => {
    const now = new Date();
    const diff = startTime.getTime() - now.getTime();
    
    if (diff <= 0) return "Идет сейчас";
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) {
      return `Через ${days}д ${hours}ч`;
    }
    if (hours > 0) {
      return `Через ${hours}ч`;
    }
    return "Скоро";
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

  const getStatusBadge = (status: string, isRegistered?: boolean) => {
    switch (status) {
      case 'live':
        return <Badge variant="success" className="text-xs">LIVE</Badge>;
      case 'upcoming':
        return <Badge variant="warning" className="text-xs">СКОРО</Badge>;
      case 'registration':
        return isRegistered 
          ? <Badge variant="default" className="text-xs">ЗАРЕГИСТРИРОВАН</Badge>
          : <Badge variant="default" className="text-xs">РЕГИСТРАЦИЯ</Badge>;
      default:
        return null;
    }
  };

  const renderLiveTournaments = () => (
    <div className="space-y-3">
      {data.liveTournaments.map((tournament: EventsTournament) => (
        <div 
          key={tournament.id}
          className="p-3 rounded-lg bg-card/50 border border-border hover:border-primary/30 transition-colors duration-200"
        >
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-sm font-medium text-foreground">{tournament.name}</span>
                <span className={`text-xs font-medium ${getGameColor(tournament.game)}`}>
                  {tournament.game}
                </span>
                {getStatusBadge(tournament.status)}
              </div>
              <div className="text-xs text-muted-foreground mb-2">
                {tournament.description}
              </div>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-3">
                  <span className="flex items-center space-x-1">
                    <GroupUsersIcon size={12} className="text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {tournament.participants}/{tournament.maxParticipants}
                    </span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <CalendarIcon size={12} className="text-muted-foreground" />
                    <span className="text-green-400">
                      {formatTimeRemaining(tournament.endTime)}
                    </span>
                  </span>
                  <span className="text-yellow-400">
                    ${tournament.prizePool.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <span className="text-red-400">👁</span>
                  <span className="text-xs text-muted-foreground">
                    {tournament.viewerCount?.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderUpcomingEvents = () => (
    <div className="space-y-3">
      {data.upcomingEvents.map((event: EventsTournament) => (
        <div 
          key={event.id}
          className="p-3 rounded-lg bg-card/50 border border-border hover:border-primary/30 transition-colors duration-200"
        >
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-sm font-medium text-foreground">{event.name}</span>
                <span className={`text-xs font-medium ${getGameColor(event.game)}`}>
                  {event.game}
                </span>
                {getStatusBadge(event.status, event.isRegistered)}
              </div>
              <div className="text-xs text-muted-foreground mb-2">
                {event.description}
              </div>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-3">
                  <span className="flex items-center space-x-1">
                    <CalendarIcon size={12} className="text-muted-foreground" />
                    <span className="text-blue-400">
                      {formatStartTime(event.startTime)}
                    </span>
                  </span>
                  <span className="text-yellow-400">
                    ${event.prizePool.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  {!event.isRegistered && event.registrationDeadline && (
                    <Button 
                      variant="default" 
                      className="text-xs py-1 px-2 h-auto"
                      onClick={() => console.log('Регистрация на турнир:', event.name)}
                    >
                      Регистрация
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderCommunityEvents = () => (
    <div className="space-y-3">
      {data.communityEvents.map((event: EventsTournament) => (
        <div 
          key={event.id}
          className="p-3 rounded-lg bg-card/50 border border-border hover:border-primary/30 transition-colors duration-200"
        >
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-sm font-medium text-foreground">{event.name}</span>
                <span className={`text-xs font-medium ${getGameColor(event.game)}`}>
                  {event.game}
                </span>
                {getStatusBadge(event.status, event.isRegistered)}
              </div>
              <div className="text-xs text-muted-foreground mb-2">
                {event.description} • {event.organizer}
              </div>
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-3">
                  <span className="flex items-center space-x-1">
                    <GroupUsersIcon size={12} className="text-muted-foreground" />
                    <span className="text-muted-foreground">
                      {event.participants}/{event.maxParticipants}
                    </span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <CalendarIcon size={12} className="text-muted-foreground" />
                    <span className="text-blue-400">
                      {formatStartTime(event.startTime)}
                    </span>
                  </span>
                  <span className="text-yellow-400">
                    ${event.prizePool.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  {!event.isRegistered && (
                    <Button 
                      variant="default" 
                      className="text-xs py-1 px-2 h-auto"
                      onClick={() => console.log('Участвовать в событии:', event.name)}
                    >
                      Участвовать
                    </Button>
                  )}
                </div>
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
          <h3 className="text-sm font-medium text-foreground">События и турниры</h3>
        </div>
      </div>

      {/* Табы */}
      <div className="grid grid-cols-3 gap-1 mb-4 p-1 bg-card/30 rounded-lg">
        <button
          onClick={() => setActiveTab('live')}
          className={`py-2 px-3 text-xs font-medium rounded-md transition-colors duration-200 ${
            activeTab === 'live'
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:text-foreground hover:bg-card/50'
          }`}
        >
          <span className="inline-block w-2 h-2 bg-red-400 rounded-full mr-1 animate-pulse"></span>
          Live
        </button>
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`py-2 px-3 text-xs font-medium rounded-md transition-colors duration-200 ${
            activeTab === 'upcoming'
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:text-foreground hover:bg-card/50'
          }`}
        >
          <CalendarIcon size={12} className="inline mr-1" />
          Скоро
        </button>
        <button
          onClick={() => setActiveTab('community')}
          className={`py-2 px-3 text-xs font-medium rounded-md transition-colors duration-200 ${
            activeTab === 'community'
              ? 'bg-primary text-primary-foreground'  
              : 'text-muted-foreground hover:text-foreground hover:bg-card/50'
          }`}
        >
          <SparklesIcon size={12} className="inline mr-1" />
          Сообщество
        </button>
      </div>

      {/* Контент */}
      <div className="min-h-[300px]">
        {activeTab === 'live' && renderLiveTournaments()}
        {activeTab === 'upcoming' && renderUpcomingEvents()}
        {activeTab === 'community' && renderCommunityEvents()}
      </div>

      {/* Кнопки действий */}
      <div className="flex space-x-2 mt-4 pt-4 border-t border-border">
        <Button 
          variant="default" 
          className="flex-1 text-xs py-2"
          onClick={() => console.log('Создать турнир')}
        >
          <GameControllerIcon size={14} className="mr-1" />
          Создать
        </Button>
        <Button 
          variant="default" 
          className="flex-1 text-xs py-2"
          onClick={() => console.log('Все турниры')}
        >
          <TrophyIcon size={14} className="mr-1" />
          Все турниры
        </Button>
      </div>
    </div>
  );
}; 