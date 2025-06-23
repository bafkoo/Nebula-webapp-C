import React, { useState } from 'react';
import { Button } from '../../../ui/Button';
import { Badge } from '../../../ui/Badge';
import { 
  SettingsIcon, 
  GameControllerIcon, 
  MicrophoneIcon,
  KeyboardIcon
} from '../../../icons';

// Типы для Quick Settings Widget
interface GameProfile {
  name: string;
  game: string;
  settings: {
    sensitivity: number;
    crosshair: string;
    fov: number;
  };
}

interface QuickSettingsData {
  gameSettings: {
    gameDetection: boolean;
    showGameActivity: boolean;
    richPresence: boolean;
    gameOverlay: boolean;
    currentProfile?: string;
    profiles?: GameProfile[];
  };
  audioSettings: {
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
  };
  videoSettings: {
    camera: {
      enabled: boolean;
      device?: string;
      resolution: string;
    };
    screenShare: {
      enabled: boolean;
      quality: string;
    };
  };
  privacySettings: {
    onlineStatus: 'everyone' | 'friends' | 'none';
    gameActivity: 'everyone' | 'friends' | 'none';
    friendRequests: 'everyone' | 'friends' | 'none';
    directMessages: 'everyone' | 'friends' | 'none';
  };
  status: 'online' | 'away' | 'busy' | 'invisible';
}

// Mockup данные
const mockQuickSettingsData: QuickSettingsData = {
  gameSettings: {
    gameDetection: true,
    showGameActivity: true,
    richPresence: true,
    gameOverlay: true,
    currentProfile: "Competitive",
    profiles: [
      { name: "Competitive", game: "CS2", settings: { sensitivity: 2.5, crosshair: "Classic", fov: 90 } },
      { name: "Casual", game: "CS2", settings: { sensitivity: 3.0, crosshair: "Dot", fov: 90 } },
      { name: "Valorant Pro", game: "Valorant", settings: { sensitivity: 1.8, crosshair: "Small", fov: 103 } }
    ]
  },
  audioSettings: {
    microphone: {
      enabled: true,
      level: 80,
      device: "Blue Yeti"
    },
    speakers: {
      enabled: true,
      level: 85,
      device: "HyperX Cloud II"
    },
    pushToTalk: false,
    noiseSuppression: true
  },
  videoSettings: {
    camera: {
      enabled: false,
      device: "Logitech C920",
      resolution: "1920x1080"
    },
    screenShare: {
      enabled: true,
      quality: "High"
    }
  },
  privacySettings: {
    onlineStatus: 'everyone',
    gameActivity: 'friends',
    friendRequests: 'friends',
    directMessages: 'friends'
  },
  status: 'online'
};

export const QuickSettingsWidget: React.FC<object> = () => {
  const [activeTab, setActiveTab] = useState<'game' | 'audio' | 'video' | 'system'>('game');
  const [data, setData] = useState(mockQuickSettingsData);

  const handleVolumeChange = (section: 'microphone' | 'speakers', value: number) => {
    setData(prev => ({
      ...prev,
      audioSettings: {
        ...prev.audioSettings,
        [section]: {
          ...prev.audioSettings[section],
          level: value
        }
      }
    }));
  };

  const renderGameSettings = () => (
    <div className="space-y-4">
      {/* Текущий профиль */}
      <div className="p-3 rounded-lg bg-card/50 border border-border">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-foreground">Активный профиль</span>
          <Badge variant="default" className="text-xs">
            {data.gameSettings.currentProfile}
          </Badge>
        </div>
        <div className="text-xs text-muted-foreground">
          Настройки для соревновательной игры
        </div>
      </div>

      {/* Быстрые настройки */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <GameControllerIcon size={16} className="text-muted-foreground" />
            <span className="text-sm text-foreground">Чувствительность</span>
          </div>
          <div className="flex items-center space-x-2">
            <input 
              type="range" 
              min="0.5" 
              max="5" 
              step="0.1" 
              defaultValue="2.5"
              className="w-20 h-2 bg-card rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-xs text-muted-foreground min-w-[2rem]">2.5</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <KeyboardIcon size={16} className="text-muted-foreground" />
            <span className="text-sm text-foreground">Прицел</span>
          </div>
          <select className="bg-card border border-border rounded px-2 py-1 text-xs text-foreground">
            <option>Classic</option>
            <option>Dot</option>
            <option>Small Cross</option>
          </select>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <SettingsIcon size={16} className="text-muted-foreground" />
            <span className="text-sm text-foreground">FOV</span>
          </div>
          <div className="flex items-center space-x-2">
            <input 
              type="range" 
              min="75" 
              max="120" 
              step="5" 
              defaultValue="90"
              className="w-20 h-2 bg-card rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-xs text-muted-foreground min-w-[2rem]">90°</span>
          </div>
        </div>
      </div>

      {/* Профили */}
      <div className="space-y-2">
        <span className="text-xs font-medium text-muted-foreground">Профили</span>
        {data.gameSettings.profiles?.map((profile: GameProfile, index: number) => (
          <div 
            key={index}
            className="flex items-center justify-between p-2 rounded bg-card/30 hover:bg-card/50 transition-colors"
          >
            <div className="flex items-center space-x-2">
              <GameControllerIcon size={14} className="text-muted-foreground" />
              <span className="text-xs text-foreground">{profile.name}</span>
              <span className="text-xs text-blue-400">({profile.game})</span>
            </div>
            <Button 
              variant="primary" 
              className="text-xs py-1 px-2 h-auto"
              onClick={() => console.log('Загрузить профиль:', profile.name)}
            >
              Загрузить
            </Button>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAudioSettings = () => (
    <div className="space-y-4">
      {/* Устройства */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <SettingsIcon size={16} className="text-muted-foreground" />
            <span className="text-sm text-foreground">Вывод</span>
          </div>
          <select className="bg-card border border-border rounded px-2 py-1 text-xs text-foreground">
            <option>HyperX Cloud II</option>
            <option>System Default</option>
            <option>Speakers</option>
          </select>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MicrophoneIcon size={16} className="text-muted-foreground" />
            <span className="text-sm text-foreground">Микрофон</span>
          </div>
          <select className="bg-card border border-border rounded px-2 py-1 text-xs text-foreground">
            <option>Blue Yeti</option>
            <option>System Default</option>
            <option>Headset Mic</option>
          </select>
        </div>
      </div>

      {/* Громкость */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <SettingsIcon size={16} className="text-muted-foreground" />
            <span className="text-sm text-foreground">Основная</span>
          </div>
          <div className="flex items-center space-x-2">
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={data.audioSettings.speakers.level}
              onChange={(e) => handleVolumeChange('speakers', parseInt(e.target.value))}
              className="w-20 h-2 bg-card rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-xs text-muted-foreground min-w-[2rem]">
              {data.audioSettings.speakers.level}%
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <GameControllerIcon size={16} className="text-muted-foreground" />
            <span className="text-sm text-foreground">Игра</span>
          </div>
          <div className="flex items-center space-x-2">
            <input 
              type="range" 
              min="0" 
              max="100" 
              defaultValue="90"
              className="w-20 h-2 bg-card rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-xs text-muted-foreground min-w-[2rem]">90%</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MicrophoneIcon size={16} className="text-muted-foreground" />
            <span className="text-sm text-foreground">Голос</span>
          </div>
          <div className="flex items-center space-x-2">
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={data.audioSettings.microphone.level}
              onChange={(e) => handleVolumeChange('microphone', parseInt(e.target.value))}
              className="w-20 h-2 bg-card rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-xs text-muted-foreground min-w-[2rem]">
              {data.audioSettings.microphone.level}%
            </span>
          </div>
        </div>
      </div>

      {/* Переключатели */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-foreground">Push-to-Talk</span>
          <button className="w-10 h-6 bg-card border border-border rounded-full relative">
            <div className="w-4 h-4 bg-muted-foreground rounded-full absolute top-1 left-1 transition-transform" />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-foreground">Шумоподавление</span>
          <button className="w-10 h-6 bg-primary border border-border rounded-full relative">
            <div className="w-4 h-4 bg-white rounded-full absolute top-1 right-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );

  const renderVideoSettings = () => (
    <div className="space-y-4">
      {/* Камера */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <SettingsIcon size={16} className="text-muted-foreground" />
            <span className="text-sm text-foreground">Камера</span>
          </div>
          <button className="w-10 h-6 bg-card border border-border rounded-full relative">
            <div className="w-4 h-4 bg-muted-foreground rounded-full absolute top-1 left-1 transition-transform" />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-foreground">Разрешение</span>
          <select className="bg-card border border-border rounded px-2 py-1 text-xs text-foreground">
            <option>1920x1080</option>
            <option>1280x720</option>
            <option>640x480</option>
          </select>
        </div>
      </div>

      {/* Видео настройки */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-foreground">V-Sync</span>
          <button className="w-10 h-6 bg-card border border-border rounded-full relative">
            <div className="w-4 h-4 bg-muted-foreground rounded-full absolute top-1 left-1 transition-transform" />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-foreground">Качество</span>
          <select className="bg-card border border-border rounded px-2 py-1 text-xs text-foreground">
            <option>Высокое</option>
            <option>Среднее</option>
            <option>Низкое</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderSystemSettings = () => (
    <div className="space-y-4">
      {/* Системные настройки */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-foreground">Игровой режим</span>
          <button className="w-10 h-6 bg-primary border border-border rounded-full relative">
            <div className="w-4 h-4 bg-white rounded-full absolute top-1 right-1 transition-transform" />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-foreground">Уведомления</span>
          <button className="w-10 h-6 bg-card border border-border rounded-full relative">
            <div className="w-4 h-4 bg-muted-foreground rounded-full absolute top-1 left-1 transition-transform" />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-foreground">Оверлей</span>
          <button className="w-10 h-6 bg-primary border border-border rounded-full relative">
            <div className="w-4 h-4 bg-white rounded-full absolute top-1 right-1 transition-transform" />
          </button>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-sm text-foreground">Автозапуск</span>
          <button className="w-10 h-6 bg-primary border border-border rounded-full relative">
            <div className="w-4 h-4 bg-white rounded-full absolute top-1 right-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Обновления */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-foreground">Обновления</span>
          <select className="bg-card border border-border rounded px-2 py-1 text-xs text-foreground">
            <option>Автоматически</option>
            <option>Спрашивать</option>
            <option>Вручную</option>
          </select>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-card rounded-lg border border-border p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <SettingsIcon size={16} className="text-primary" />
          <h3 className="text-sm font-medium text-foreground">Быстрые настройки</h3>
        </div>
      </div>

      {/* Табы */}
      <div className="grid grid-cols-4 gap-1 mb-4 p-1 bg-card/30 rounded-lg">
        <button
          onClick={() => setActiveTab('game')}
          className={`py-2 px-2 text-xs font-medium rounded-md transition-colors duration-200 ${
            activeTab === 'game'
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:text-foreground hover:bg-card/50'
          }`}
        >
          <GameControllerIcon size={12} className="inline mr-1" />
          Игра
        </button>
        <button
          onClick={() => setActiveTab('audio')}
          className={`py-2 px-2 text-xs font-medium rounded-md transition-colors duration-200 ${
            activeTab === 'audio'
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:text-foreground hover:bg-card/50'
          }`}
        >
          <MicrophoneIcon size={12} className="inline mr-1" />
          Звук
        </button>
        <button
          onClick={() => setActiveTab('video')}
          className={`py-2 px-2 text-xs font-medium rounded-md transition-colors duration-200 ${
            activeTab === 'video'
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:text-foreground hover:bg-card/50'
          }`}
        >
          <SettingsIcon size={12} className="inline mr-1" />
          Видео
        </button>
        <button
          onClick={() => setActiveTab('system')}
          className={`py-2 px-2 text-xs font-medium rounded-md transition-colors duration-200 ${
            activeTab === 'system'
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:text-foreground hover:bg-card/50'
          }`}
        >
          <KeyboardIcon size={12} className="inline mr-1" />
          Система
        </button>
      </div>

      {/* Контент */}
      <div className="min-h-[300px]">
        {activeTab === 'game' && renderGameSettings()}
        {activeTab === 'audio' && renderAudioSettings()}
        {activeTab === 'video' && renderVideoSettings()}
        {activeTab === 'system' && renderSystemSettings()}
      </div>

      {/* Кнопки действий */}
      <div className="flex space-x-2 mt-4 pt-4 border-t border-border">
        <Button
          variant="primary"
          className="w-full"
          onClick={() => console.log('Расширенные настройки')}
        >
          Расширенные
        </Button>
        <Button
          variant="secondary"
          className="w-full"
          onClick={() => console.log('Сбросить настройки')}
        >
          Сбросить
        </Button>
      </div>
    </div>
  );
}; 