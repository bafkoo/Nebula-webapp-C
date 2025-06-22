import React from 'react';
import { 
  GameControllerIcon,
  RocketIcon,
  GroupUsersIcon,
  LightningIcon,
  TrophyIcon,
  ChartIcon,
  TargetIcon,
  SettingsIcon,
  SearchMagnifyIcon,
  DiscordCounterIcon,
  CS2Icon,
  ValorantIcon,
  LeagueOfLegendsIcon,
  Dota2Icon,
  FortniteIcon,
  ApexLegendsIcon,
  MinecraftIcon,
  OverwatchIcon,
  GTA5Icon,
  RainbowSixSiegeIcon,
  SteamIcon,
  PlayStationIcon,
  XboxIcon,
  EpicGamesIcon,
} from '../components/icons';

const DashboardIconsDemo: React.FC = () => {
  const dashboardIcons = [
    { name: "Game Activity", icon: GameControllerIcon, desc: "🎮 Игровая активность" },
    { name: "Quick Connections", icon: LightningIcon, desc: "⚡ Быстрые подключения" },
    { name: "Friends & Teams", icon: GroupUsersIcon, desc: "👥 Друзья и команды" },
    { name: "Events & Tournaments", icon: TrophyIcon, desc: "🏆 События и турниры" },
    { name: "Stats & Achievements", icon: ChartIcon, desc: "📊 Статистика и достижения" },
    { name: "Gaming Lobbies", icon: TargetIcon, desc: "🎯 Игровые лобби" },
    { name: "Quick Settings", icon: SettingsIcon, desc: "⚙️ Быстрые настройки" },
    { name: "Search", icon: SearchMagnifyIcon, desc: "🔍 Поиск" },
  ];

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-8 text-center">
          🎮 Dashboard Icons Demo
        </h1>
        
        {/* Основные Dashboard иконки */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-foreground mb-6">
            Основные Dashboard иконки
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {dashboardIcons.map((item, index) => {
              const IconComponent = item.icon;
              return (
                <div key={index} className="p-6 bg-surface rounded-lg border border-border hover:border-primary transition-colors">
                  <div className="flex flex-col items-center space-y-3">
                    <IconComponent size={48} className="text-primary" />
                    <div className="text-center">
                      <h3 className="font-medium text-foreground">{item.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{item.desc}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Discord Counter Demo */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-foreground mb-6">
            🔢 Discord Counter Icon
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 bg-surface rounded-lg border border-border">
              <div className="flex flex-col items-center space-y-3">
                <DiscordCounterIcon count={0} size={80} className="text-primary" />
                <div className="text-center">
                  <h3 className="font-medium text-foreground">Без ограничений</h3>
                  <p className="text-sm text-muted-foreground">count={0}, без maxLimit</p>
                </div>
              </div>
            </div>
            
            <div className="p-6 bg-surface rounded-lg border border-border">
              <div className="flex flex-col items-center space-y-3">
                <DiscordCounterIcon count={5} maxLimit={10} size={80} className="text-accent" />
                <div className="text-center">
                  <h3 className="font-medium text-foreground">С ограничением</h3>
                  <p className="text-sm text-muted-foreground">count={5}, maxLimit={10}</p>
                </div>
              </div>
            </div>
            
            <div className="p-6 bg-surface rounded-lg border border-border">
              <div className="flex flex-col items-center space-y-3">
                <DiscordCounterIcon count={16} maxLimit={16} size={80} className="text-destructive" />
                <div className="text-center">
                  <h3 className="font-medium text-foreground">Полное лобби</h3>
                  <p className="text-sm text-muted-foreground">count={16}, maxLimit={16}</p>
                </div>
              </div>
            </div>
            
            <div className="p-6 bg-surface rounded-lg border border-border">
              <div className="flex flex-col items-center space-y-3">
                <DiscordCounterIcon count={150} maxLimit={200} size={80} className="text-warning" />
                <div className="text-center">
                  <h3 className="font-medium text-foreground">Большое лобби</h3>
                  <p className="text-sm text-muted-foreground">count={150}, maxLimit={200}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Gaming Icons Demo */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-foreground mb-6">
            🎮 Gaming Icons Collection
          </h2>
          
          {/* Популярные игры */}
          <div className="mb-8">
            <h3 className="text-xl font-medium text-foreground mb-4">Популярные игры</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              <div className="p-4 bg-surface rounded-lg border border-border hover:bg-surface-hover transition-colors">
                <div className="flex flex-col items-center space-y-2">
                  <CS2Icon size={48} className="text-orange-500" />
                  <span className="text-sm font-medium text-foreground">CS2</span>
                </div>
              </div>
              
              <div className="p-4 bg-surface rounded-lg border border-border hover:bg-surface-hover transition-colors">
                <div className="flex flex-col items-center space-y-2">
                  <ValorantIcon size={48} className="text-red-500" />
                  <span className="text-sm font-medium text-foreground">Valorant</span>
                </div>
              </div>
              
              <div className="p-4 bg-surface rounded-lg border border-border hover:bg-surface-hover transition-colors">
                <div className="flex flex-col items-center space-y-2">
                  <LeagueOfLegendsIcon size={48} className="text-blue-500" />
                  <span className="text-sm font-medium text-foreground">League of Legends</span>
                </div>
              </div>
              
              <div className="p-4 bg-surface rounded-lg border border-border hover:bg-surface-hover transition-colors">
                <div className="flex flex-col items-center space-y-2">
                  <Dota2Icon size={48} className="text-red-600" />
                  <span className="text-sm font-medium text-foreground">Dota 2</span>
                </div>
              </div>
              
              <div className="p-4 bg-surface rounded-lg border border-border hover:bg-surface-hover transition-colors">
                <div className="flex flex-col items-center space-y-2">
                  <FortniteIcon size={48} className="text-purple-500" />
                  <span className="text-sm font-medium text-foreground">Fortnite</span>
                </div>
              </div>
              
              <div className="p-4 bg-surface rounded-lg border border-border hover:bg-surface-hover transition-colors">
                <div className="flex flex-col items-center space-y-2">
                  <ApexLegendsIcon size={48} className="text-orange-600" />
                  <span className="text-sm font-medium text-foreground">Apex Legends</span>
                </div>
              </div>
              
              <div className="p-4 bg-surface rounded-lg border border-border hover:bg-surface-hover transition-colors">
                <div className="flex flex-col items-center space-y-2">
                  <MinecraftIcon size={48} className="text-green-600" />
                  <span className="text-sm font-medium text-foreground">Minecraft</span>
                </div>
              </div>
              
              <div className="p-4 bg-surface rounded-lg border border-border hover:bg-surface-hover transition-colors">
                <div className="flex flex-col items-center space-y-2">
                  <OverwatchIcon size={48} className="text-orange-500" />
                  <span className="text-sm font-medium text-foreground">Overwatch</span>
                </div>
              </div>
              
              <div className="p-4 bg-surface rounded-lg border border-border hover:bg-surface-hover transition-colors">
                <div className="flex flex-col items-center space-y-2">
                  <GTA5Icon size={48} className="text-yellow-500" />
                  <span className="text-sm font-medium text-foreground">GTA 5</span>
                </div>
              </div>
              
              <div className="p-4 bg-surface rounded-lg border border-border hover:bg-surface-hover transition-colors">
                <div className="flex flex-col items-center space-y-2">
                  <RainbowSixSiegeIcon size={48} className="text-blue-600" />
                  <span className="text-sm font-medium text-foreground">Rainbow Six Siege</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Игровые платформы */}
          <div className="mb-8">
            <h3 className="text-xl font-medium text-foreground mb-4">Игровые платформы</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              <div className="p-4 bg-surface rounded-lg border border-border hover:bg-surface-hover transition-colors">
                <div className="flex flex-col items-center space-y-2">
                  <SteamIcon size={48} className="text-blue-500" />
                  <span className="text-sm font-medium text-foreground">Steam</span>
                </div>
              </div>
              
              <div className="p-4 bg-surface rounded-lg border border-border hover:bg-surface-hover transition-colors">
                <div className="flex flex-col items-center space-y-2">
                  <PlayStationIcon size={48} className="text-green-600" />
                  <span className="text-sm font-medium text-foreground">PlayStation</span>
                </div>
              </div>
              
              <div className="p-4 bg-surface rounded-lg border border-border hover:bg-surface-hover transition-colors">
                <div className="flex flex-col items-center space-y-2">
                  <XboxIcon size={48} className="text-green-500" />
                  <span className="text-sm font-medium text-foreground">Xbox</span>
                </div>
              </div>
              
              <div className="p-4 bg-surface rounded-lg border border-border hover:bg-surface-hover transition-colors">
                <div className="flex flex-col items-center space-y-2">
                  <EpicGamesIcon size={48} className="text-white" />
                  <span className="text-sm font-medium text-foreground">Epic Games</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Дополнительные игровые иконки */}
          <div className="mb-8">
            <h3 className="text-xl font-medium text-foreground mb-4">Дополнительные игровые иконки</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              <div className="p-4 bg-surface rounded-lg border border-border hover:bg-surface-hover transition-colors">
                <div className="flex flex-col items-center space-y-2">
                  <GameControllerIcon size={48} className="text-primary" />
                  <span className="text-sm font-medium text-foreground">Game Controller</span>
                </div>
              </div>
              
              <div className="p-4 bg-surface rounded-lg border border-border hover:bg-surface-hover transition-colors">
                <div className="flex flex-col items-center space-y-2">
                  <RocketIcon size={48} className="text-orange-500" />
                  <span className="text-sm font-medium text-foreground">Rocket</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Использование в коде */}
        <div className="bg-surface rounded-lg border border-border p-6">
          <h2 className="text-xl font-semibold text-foreground mb-4">
            💻 Использование в коде
          </h2>
          <div className="bg-background rounded-lg p-4 font-mono text-sm">
            <div className="text-muted-foreground mb-2">// Импорт</div>
            <div className="text-primary mb-4">import {'{ DiscordCounterIcon }'} from '../components/icons';</div>
            
            <div className="text-muted-foreground mb-2">// Канал без ограничений</div>
            <div className="text-foreground mb-4">{'<DiscordCounterIcon count={12} size={24} className="text-primary" />'}</div>
            
            <div className="text-muted-foreground mb-2">// Канал с ограничением участников</div>
            <div className="text-foreground mb-4">{'<DiscordCounterIcon count={8} maxLimit={16} size={24} className="text-primary" />'}</div>
            
            <div className="text-muted-foreground mb-2">// Заполненный канал (красный цвет)</div>
            <div className="text-foreground">{'<DiscordCounterIcon count={5} maxLimit={5} size={24} className="text-red-500" />'}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardIconsDemo; 