// Типы для Dashboard Nebula Chat

// === БАЗОВЫЕ ТИПЫ ===

export interface Widget {
  id: string;
  title: string;
  type: WidgetType;
  priority: number;
  isLoading: boolean;
  error: string | null;
  data: object;
  lastUpdated?: Date;
}

export type WidgetType = 
  | 'game-activity'
  | 'quick-connections' 
  | 'friends-teams'
  | 'events'
  | 'stats'
  | 'lobbies'
  | 'news'
  | 'recommendations'
  | 'quick-settings';

export interface DashboardState {
  widgets: Widget[];
  layout: WidgetLayout;
  isLoading: boolean;
  error: string | null;
  lastRefresh: Date | null;
}

export interface WidgetLayout {
  columns: number;
  gap: number;
  breakpoints: {
    mobile: number;
    tablet: number;
    desktop: number;
  };
}

// === WIDGET DATA TYPES ===

// 🎮 Game Activity Widget
export interface GameActivityData {
  currentGame: string | null;
  isPlaying: boolean;
  sessionStartTime?: Date;
  friendsPlaying: GameFriend[];
  popularGames: PopularGame[];
  recentActivity: GameActivity[];
}

export interface GameFriend {
  id: string;
  name: string;
  avatar?: string;
  game: string;
  status: GameStatus;
  joinable: boolean;
}

export interface PopularGame {
  id: string;
  name: string;
  icon?: string;
  playersCount: number;
  trending: boolean;
}

export interface GameActivity {
  id: string;
  game: string;
  action: string;
  timestamp: Date;
  duration?: number;
}

export type GameStatus = 'В матче' | 'В лобби' | 'В меню' | 'Стримит' | 'Отошел' | 'AFK';

// ⚡ Quick Connections Widget
export interface QuickConnectionsData {
  favoriteServers: FavoriteServer[];
  recentServers: RecentServer[];
  quickJoinEnabled: boolean;
}

export interface FavoriteServer {
  id: string;
  name: string;
  game: string;
  playerCount: {
    online: number;
    total: number;
  };
  ping: number;
  favorite: boolean;
  hasPassword: boolean;
}

export interface RecentServer {
  id: string;
  name: string;
  game: string;
  lastJoined: Date;
  duration: number;
}

// 👥 Friends & Teams Widget
export interface FriendsTeamsData {
  onlineFriends: Friend[];
  offlineFriends: Friend[];
  teams: Team[];
  pendingRequests: FriendRequest[];
}

export interface Friend {
  id: string;
  name: string;
  avatar?: string;
  status: FriendStatus;
  isOnline: boolean;
  lastSeen?: Date;
  currentGame?: string;
  mutual: boolean;
}

export interface Team {
  id: string;
  name: string;
  avatar?: string;
  memberCount: {
    total: number;
    online: number;
  };
  role: TeamRole;
  isActive: boolean;
}

export interface FriendRequest {
  id: string;
  from: string;
  timestamp: Date;
  mutual: number;
}

export type FriendStatus = 'играет в CS:GO' | 'стримит' | 'отошел' | 'в чате' | 'офлайн';
export type TeamRole = 'owner' | 'admin' | 'member';

// 🏆 Events & Tournaments Widget
export interface EventsData {
  todayEvents: Event[];
  upcomingEvents: Event[];
  myEvents: Event[];
  popularTournaments: Tournament[];
}

export interface Event {
  id: string;
  name: string;
  type: EventType;
  game: string;
  startTime: Date;
  endTime?: Date;
  participants: {
    current: number;
    max: number;
  };
  prize?: string;
  status: EventStatus;
  canJoin: boolean;
}

export interface Tournament {
  id: string;
  name: string;
  game: string;
  format: TournamentFormat;
  startDate: Date;
  prize: string;
  teams: number;
  registrationOpen: boolean;
}

export type EventType = 'tournament' | 'match' | 'practice' | 'meeting';
export type EventStatus = 'upcoming' | 'live' | 'finished' | 'cancelled';
export type TournamentFormat = 'single-elimination' | 'double-elimination' | 'round-robin' | 'swiss';

// 📊 Stats & Achievements Widget
export interface StatsData {
  dailyStats: DailyStats;
  weeklyStats: WeeklyStats;
  achievements: Achievement[];
  levelProgress: LevelProgress;
  rankings: Ranking[];
}

export interface DailyStats {
  gamesPlayed: number;
  voiceTime: string;
  chatMessages: number;
  winRate: number;
  rating: number;
  ratingChange: number;
}

export interface WeeklyStats {
  totalGames: number;
  totalTime: string;
  avgRating: number;
  bestWinStreak: number;
  friendsAdded: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  xp: number;
  unlockedAt?: Date;
  isNew: boolean;
  rarity: AchievementRarity;
}

export interface LevelProgress {
  currentLevel: number;
  currentXP: number;
  nextLevelXP: number;
  totalXP: number;
}

export interface Ranking {
  game: string;
  rank: string;
  mmr: number;
  position: number;
  change: number;
}

export type AchievementRarity = 'common' | 'rare' | 'epic' | 'legendary';

// 🎯 Gaming Lobbies Widget
export interface LobbiesData {
  activeLobbies: Lobby[];
  myLobbies: Lobby[];
  invitations: LobbyInvitation[];
  quickMatch: QuickMatchSettings;
}

export interface Lobby {
  id: string;
  name: string;
  game: string;
  mode: string;
  players: {
    current: number;
    max: number;
  };
  skillLevel: string;
  isPrivate: boolean;
  hasPassword: boolean;
  host: string;
  createdAt: Date;
  canJoin: boolean;
}

export interface LobbyInvitation {
  id: string;
  lobbyId: string;
  from: string;
  timestamp: Date;
  expiresAt: Date;
}

export interface QuickMatchSettings {
  enabled: boolean;
  preferredGames: string[];
  skillRange: SkillRange;
  serverRegion: string;
}

export type SkillRange = 'any' | 'similar' | 'higher' | 'lower';

// 📰 News & Updates Widget
export interface NewsData {
  news: NewsItem[];
  announcements: Announcement[];
  friendActivity: FriendActivity[];
  unreadCount: number;
}

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  type: NewsType;
  game?: string;
  timestamp: Date;
  readAt?: Date;
  importance: NewsPriority;
  image?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  type: AnnouncementType;
  timestamp: Date;
  expiresAt?: Date;
  dismissedAt?: Date;
}

export interface FriendActivity {
  id: string;
  friendName: string;
  action: string;
  details: string;
  timestamp: Date;
  game?: string;
}

export type NewsType = 'game' | 'community' | 'achievement' | 'system' | 'tournament';
export type NewsPriority = 'low' | 'normal' | 'high' | 'urgent';
export type AnnouncementType = 'maintenance' | 'feature' | 'event' | 'warning';

// 💡 Recommendations Widget
export interface RecommendationsData {
  recommendedServers: RecommendedServer[];
  recommendedGames: RecommendedGame[];
  recommendedFriends: RecommendedFriend[];
  trendingContent: TrendingContent[];
}

export interface RecommendedServer {
  id: string;
  name: string;
  game: string;
  description: string;
  memberCount: number;
  tags: string[];
  rating: number;
  reason: string;
}

export interface RecommendedGame {
  id: string;
  name: string;
  genre: string;
  rating: number;
  friendsCount: number;
  reason: string;
  onSale: boolean;
}

export interface RecommendedFriend {
  id: string;
  name: string;
  avatar?: string;
  mutualFriends: number;
  commonGames: string[];
  reason: string;
}

export interface TrendingContent {
  id: string;
  title: string;
  type: TrendingType;
  category: string;
  engagement: number;
  timeframe: string;
}

export type TrendingType = 'server' | 'game' | 'tournament' | 'stream' | 'guide';

// ⚙️ Quick Settings Widget
export interface QuickSettingsData {
  audioSettings: AudioSettings;
  videoSettings: VideoSettings;
  gameSettings: GameSettings;
  privacySettings: PrivacySettings;
  status: UserStatus;
}

export interface AudioSettings {
  microphone: {
    enabled: boolean;
    level: number;
    device?: string;
  };
  speakers: {
    enabled: boolean;
    level: number;
    device?: string;
  };
  pushToTalk: boolean;
  noiseSuppression: boolean;
}

export interface VideoSettings {
  camera: {
    enabled: boolean;
    device?: string;
    resolution: string;
  };
  screenShare: {
    enabled: boolean;
    quality: string;
  };
}

export interface GameSettings {
  gameDetection: boolean;
  showGameActivity: boolean;
  richPresence: boolean;
  gameOverlay: boolean;
}

export interface PrivacySettings {
  onlineStatus: PrivacyLevel;
  gameActivity: PrivacyLevel;
  friendRequests: PrivacyLevel;
  directMessages: PrivacyLevel;
}

export type UserStatus = 'online' | 'away' | 'busy' | 'invisible';
export type PrivacyLevel = 'everyone' | 'friends' | 'none';

// === ДЕЙСТВИЯ И СОБЫТИЯ ===

export interface WidgetAction {
  type: WidgetActionType;
  widgetId: string;
  payload?: object;
  timestamp: Date;
}

export type WidgetActionType = 
  | 'REFRESH'
  | 'RETRY'
  | 'TOGGLE_SETTING'
  | 'JOIN_LOBBY'
  | 'ADD_FRIEND'
  | 'JOIN_SERVER'
  | 'QUICK_ACTION';

// === КОНФИГУРАЦИЯ ===

export interface DashboardConfig {
  refreshInterval: number;
  enableAnimations: boolean;
  compactMode: boolean;
  enableNotifications: boolean;
  theme: 'auto' | 'light' | 'dark';
} 