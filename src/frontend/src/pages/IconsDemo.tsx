import React, { useState } from 'react';
import { 
  MenuDotsIcon, 
  SecurityLockIcon, 
  EditIcon,
  BanIcon,
  LockKeyIcon,
  KeyboardIcon,
  ToolIcon,
  SettingsIcon,
  AnnouncementIcon,
  HomeIcon,
  CalendarIcon,
  SearchHashtagIcon,
  ChecklistIcon,
  FlagIcon,
  FlagChatIcon,
  OnlineStatusIcon,
  AwayStatusIcon,
  BusyStatusIcon,
  OfflineStatusIcon,
  FavoritesIcon,
  NotificationIcon,
  CallIcon,
  AttachmentIcon,
  RoleBadgeIcon,
  LockTierIcon,
  PhoneIcon,
  MailIcon,
  AnonymousIcon,
  WebhookIcon,
  TimeoutIcon,
  ExternalLinkIcon,
  BlockMessageIcon,
  StarOutlineIcon,
  SparklesIcon,
  NotificationOffIcon,
  OutgoingCallIcon,
  VideoCallIcon,
  PinIcon,
  AddFriendIcon,
  GroupUsersIcon,
  DocumentIcon,
  ThumbsUpIcon,
  ThumbsDownIcon,
  SearchMagnifyIcon,
  CloseIcon,
  WalletIcon,
  HelpIcon,
  BugIcon,
  ToolsIcon,
  AddIcon,
  ImageAddIcon,
  TranslateIcon,
  UploadIcon,
  DownloadIcon,
  EffectsIcon,
  MenuIcon,
  ListIcon,
  UserPlayIcon,
  MicrophoneIcon,
  GiftIcon
} from '../components/icons/Icons';

interface IconData {
  name: string;
  component: React.FC<{ size?: number; className?: string }>;
  description: string;
}

const IconsDemo: React.FC = () => {
  const [copiedIcon, setCopiedIcon] = useState<string | null>(null);

  const copyToClipboard = (iconName: string) => {
    navigator.clipboard.writeText(`<${iconName} />`);
    setCopiedIcon(iconName);
    setTimeout(() => setCopiedIcon(null), 2000);
  };

  // Категории иконок
  const profiles: IconData[] = [
    { name: 'MenuDotsIcon', component: MenuDotsIcon, description: 'Меню с тремя точками' },
    { name: 'SecurityLockIcon', component: SecurityLockIcon, description: 'Замок безопасности (зеленый)' },
    { name: 'EditIcon', component: EditIcon, description: 'Редактирование/Карандаш' },
    { name: 'BanIcon', component: BanIcon, description: 'Запрет/Блокировка' },
    { name: 'LockKeyIcon', component: LockKeyIcon, description: 'Замок' },
    { name: 'KeyboardIcon', component: KeyboardIcon, description: 'Клавиатура' },
    { name: 'ToolIcon', component: ToolIcon, description: 'Инструмент/Ключ' },
    { name: 'SettingsIcon', component: SettingsIcon, description: 'Настройки/Шестеренка' }
  ];

  const serverChannelTabIcons: IconData[] = [
    { name: 'AnnouncementIcon', component: AnnouncementIcon, description: 'Объявления/Анонсы' },
    { name: 'HomeIcon', component: HomeIcon, description: 'Главная/Дом' },
    { name: 'CalendarIcon', component: CalendarIcon, description: 'Календарь' },
    { name: 'SearchHashtagIcon', component: SearchHashtagIcon, description: 'Поиск с хэштегом' },
    { name: 'ChecklistIcon', component: ChecklistIcon, description: 'Чеклист/Задачи' },
    { name: 'FlagIcon', component: FlagIcon, description: 'Флаг/Отчеты' },
    { name: 'FlagChatIcon', component: FlagChatIcon, description: 'Флаг с чатом (комбинированная)' }
  ];

  const statusIcons: IconData[] = [
    { name: 'OnlineStatusIcon', component: OnlineStatusIcon, description: 'Статус "Онлайн"' },
    { name: 'AwayStatusIcon', component: AwayStatusIcon, description: 'Статус "Отошел/Неактивен"' },
    { name: 'BusyStatusIcon', component: BusyStatusIcon, description: 'Статус "Не беспокоить/Занят"' },
    { name: 'OfflineStatusIcon', component: OfflineStatusIcon, description: 'Статус "Оффлайн/Невидимый"' }
  ];

  const figmaIcons: IconData[] = [
    { name: 'FavoritesIcon', component: FavoritesIcon, description: 'Избранное (звезда)' },
    { name: 'NotificationIcon', component: NotificationIcon, description: 'Уведомления (колокольчик)' },
    { name: 'CallIcon', component: CallIcon, description: 'Голосовой звонок (трубка)' },
    { name: 'AttachmentIcon', component: AttachmentIcon, description: 'Вложения (плюс в кружке)' },
    { name: 'RoleBadgeIcon', component: RoleBadgeIcon, description: 'Роль/Пользователь (значок)' },
    { name: 'LockTierIcon', component: LockTierIcon, description: 'Замок (приватный контент)' },
    { name: 'PhoneIcon', component: PhoneIcon, description: 'Телефон (мобильное устройство)' },
    { name: 'MailIcon', component: MailIcon, description: 'Почта (email конверт)' },
    { name: 'AnonymousIcon', component: AnonymousIcon, description: 'Анонимность/Маска (приватность)' },
    { name: 'WebhookIcon', component: WebhookIcon, description: 'Вебхук (интеграции)' },
    { name: 'TimeoutIcon', component: TimeoutIcon, description: 'Таймаут (временная блокировка)' },
    { name: 'ExternalLinkIcon', component: ExternalLinkIcon, description: 'Внешняя ссылка (переход)' },
    { name: 'BlockMessageIcon', component: BlockMessageIcon, description: 'Блокировка сообщений (крестик)' },
    { name: 'StarOutlineIcon', component: StarOutlineIcon, description: 'Звезда контур (рейтинг)' },
    { name: 'SparklesIcon', component: SparklesIcon, description: 'Искры/Магия (спецэффекты)' },
    { name: 'NotificationOffIcon', component: NotificationOffIcon, description: 'Уведомления отключены (перечеркнуто)' },
    { name: 'OutgoingCallIcon', component: OutgoingCallIcon, description: 'Исходящий звонок (с волнами сигнала)' },
    { name: 'VideoCallIcon', component: VideoCallIcon, description: 'Видеозвонок/Видеокамера' },
    { name: 'PinIcon', component: PinIcon, description: 'Кнопка/Булавка (закрепление контента)' },
    { name: 'AddFriendIcon', component: AddFriendIcon, description: 'Добавить друга/пользователя (плюс)' },
    { name: 'GroupUsersIcon', component: GroupUsersIcon, description: 'Группа пользователей (несколько участников)' },
    { name: 'DocumentIcon', component: DocumentIcon, description: 'Документ/Файл (текстовый документ)' },
    { name: 'ThumbsUpIcon', component: ThumbsUpIcon, description: 'Лайк' },
    { name: 'ThumbsDownIcon', component: ThumbsDownIcon, description: 'Дизлайк' },
    { name: 'SearchMagnifyIcon', component: SearchMagnifyIcon, description: 'Поиск' },
    { name: 'CloseIcon', component: CloseIcon, description: 'Закрыть' },
    { name: 'WalletIcon', component: WalletIcon, description: 'Кошелек' },
    { name: 'HelpIcon', component: HelpIcon, description: 'Помощь' },
    { name: 'BugIcon', component: BugIcon, description: 'Баг' },
    { name: 'ToolsIcon', component: ToolsIcon, description: 'Инструменты/Настройки' },
    { name: 'AddIcon', component: AddIcon, description: 'Добавить (плюс в кружке)' },
    { name: 'ImageAddIcon', component: ImageAddIcon, description: 'Добавить изображение (фото с плюсом)' },
    { name: 'TranslateIcon', component: TranslateIcon, description: 'Перевод' },
    { name: 'UploadIcon', component: UploadIcon, description: 'Загрузка' },
    { name: 'DownloadIcon', component: DownloadIcon, description: 'Скачивание' },
    { name: 'EffectsIcon', component: EffectsIcon, description: 'Спецэффекты (звезды)' },
    { name: 'MenuIcon', component: MenuIcon, description: 'Меню (гамбургер)' },
    { name: 'ListIcon', component: ListIcon, description: 'Список (маркеры)' },
    { name: 'UserPlayIcon', component: UserPlayIcon, description: 'Пользователь с воспроизведением' },
    { name: 'MicrophoneIcon', component: MicrophoneIcon, description: 'Микрофон' },
    { name: 'GiftIcon', component: GiftIcon, description: 'Подарок' }
  ];

  const IconCard = ({ 
    name, 
    description, 
    IconComponent 
  }: { 
    name: string; 
    description: string; 
    IconComponent: React.FC<{ size?: number; className?: string }>; 
  }) => (
    <div 
      className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-blue-500 transition-colors cursor-pointer group"
      onClick={() => copyToClipboard(name)}
    >
      <div className="flex flex-col items-center space-y-3">
        <div className="text-gray-300 group-hover:text-white transition-colors">
          <IconComponent size={48} />
        </div>
        <div className="text-center">
          <p className="text-white font-medium">{name}</p>
          <p className="text-gray-400 text-sm">{description}</p>
        </div>
        {copiedIcon === name && (
          <p className="text-green-400 text-sm">Скопировано!</p>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">
          Коллекция Иконок Nebula Chat
        </h1>
        
        <div className="text-center mb-8">
          <p className="text-gray-300">
            Кликните на иконку, чтобы скопировать код компонента
          </p>
        </div>

        <div className="space-y-12">
          {/* Profiles Section */}
          <section>
            <h2 className="text-2xl font-bold mb-6 text-blue-400">
              📋 Profiles / Профили ({profiles.length} иконок)
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
              {profiles.map((icon, index) => (
                <IconCard 
                  key={index} 
                  name={icon.name} 
                  description={icon.description} 
                  IconComponent={icon.component} 
                />
              ))}
            </div>
          </section>

          {/* Server Channel and Tab Icons Section */}
          <section>
            <h2 className="text-2xl font-bold mb-6 text-purple-400">
              🖥️ Server Channel and Tab Icons / Иконки Серверных Каналов и Вкладок ({serverChannelTabIcons.length} иконок)
            </h2>
            {serverChannelTabIcons.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
                {serverChannelTabIcons.map((icon, index) => (
                  <IconCard 
                    key={index} 
                    name={icon.name} 
                    description={icon.description} 
                    IconComponent={icon.component} 
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <p>🚧 Иконки для этой секции будут добавлены позже</p>
              </div>
            )}
          </section>

          {/* Status Icons Section */}
          <section>
            <h2 className="text-2xl font-bold mb-6 text-green-400">
              🟢 Status Icons / Иконки Статуса ({statusIcons.length} иконок)
            </h2>
            {statusIcons.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
                {statusIcons.map((icon, index) => (
                  <IconCard 
                    key={index} 
                    name={icon.name} 
                    description={icon.description} 
                    IconComponent={icon.component} 
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400">
                <p>🚧 Иконки для этой секции будут добавлены позже</p>
              </div>
            )}
          </section>

          {/* Figma Icons Section */}
          <section>
            <h2 className="text-2xl font-bold mb-6 text-orange-400">
              ⭐ Figma Icons / Иконки из Figma ({figmaIcons.length} иконки)
            </h2>
            <div className="mb-4 p-4 bg-orange-900/20 border border-orange-500/30 rounded-lg">
              <p className="text-orange-300 text-sm">
                🎯 <strong>Точный перенос</strong> - Одна иконка "Favorites" с правильными цветами из Figma
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6">
              {figmaIcons.map((icon, index) => (
                <IconCard 
                  key={index} 
                  name={icon.name} 
                  description={icon.description} 
                  IconComponent={icon.component} 
                />
              ))}
            </div>
          </section>
        </div>

        {/* Сообщение о копировании */}
        {copiedIcon && (
          <div className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg">
            Скопировано: {copiedIcon}
          </div>
        )}
      </div>
    </div>
  );
};

export default IconsDemo; 