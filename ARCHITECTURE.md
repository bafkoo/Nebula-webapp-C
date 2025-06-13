# 🏗️ Архитектура NebulaChat (Discord Clone)

## 🎯 Обзор проекта

NebulaChat - это полнофункциональный клон Discord с поддержкой серверов, каналов, голосовых чатов, ролей и модерации.

## 📋 Основные домены (Bounded Contexts)

### 1. 👤 **User Management** 
- Регистрация/аутентификация
- Профили пользователей
- Статусы (онлайн/офлайн/отошёл)
- Настройки пользователя

### 2. 🏰 **Servers (Guilds)**
- Создание/управление серверами
- Настройки сервера
- Приглашения на сервер
- Участники сервера

### 3. 📝 **Channels**
- Текстовые каналы
- Голосовые каналы
- Категории каналов
- Права доступа к каналам

### 4. 💬 **Messaging**
- Отправка сообщений
- Редактирование/удаление
- Реакции и эмодзи
- Упоминания (@user, @role, @everyone)
- Нити (Threads)

### 5. 🎭 **Roles & Permissions**
- Создание ролей
- Система прав доступа
- Иерархия ролей
- Назначение ролей пользователям

### 6. 👥 **Social Features**
- Список друзей
- Прямые сообщения (DM)
- Групповые чаты
- Блокировка пользователей

### 7. 📁 **File Management**
- Загрузка файлов/изображений
- Аватары пользователей
- Иконки серверов
- CDN для медиафайлов

### 8. 🔊 **Voice & Video**
- Голосовые каналы
- WebRTC соединения
- Видеозвонки
- Демонстрация экрана

### 9. 🛡️ **Moderation**
- Бан/кик пользователей
- Временные ограничения (mute/timeout)
- Журналы модерации
- Автомодерация

### 10. 🤖 **Bots & Integrations**
- Bot API
- Webhooks
- Slash команды
- OAuth2 приложения

## 🏗️ Clean Architecture Layers

### 📦 **Domain Layer** (`NebulaChat.Domain`)
```
Domain/
├── Entities/
│   ├── User/
│   │   ├── User.cs
│   │   ├── UserProfile.cs
│   │   └── UserStatus.cs
│   ├── Server/
│   │   ├── Server.cs
│   │   ├── ServerMember.cs
│   │   └── ServerInvite.cs
│   ├── Channel/
│   │   ├── Channel.cs
│   │   ├── TextChannel.cs
│   │   ├── VoiceChannel.cs
│   │   └── ChannelCategory.cs
│   ├── Message/
│   │   ├── Message.cs
│   │   ├── MessageAttachment.cs
│   │   ├── MessageReaction.cs
│   │   └── MessageThread.cs
│   ├── Role/
│   │   ├── Role.cs
│   │   ├── Permission.cs
│   │   └── RolePermission.cs
│   └── Social/
│       ├── Friendship.cs
│       ├── DirectMessage.cs
│       └── BlockedUser.cs
├── ValueObjects/
│   ├── ServerId.cs
│   ├── ChannelId.cs
│   ├── UserId.cs
│   └── MessageId.cs
├── Enums/
│   ├── ChannelType.cs
│   ├── MessageType.cs
│   ├── UserStatus.cs
│   └── PermissionType.cs
├── Events/
│   ├── UserEvents/
│   ├── ServerEvents/
│   ├── ChannelEvents/
│   └── MessageEvents/
└── Interfaces/
    ├── IRepository.cs
    ├── IUnitOfWork.cs
    └── IDomainEventHandler.cs
```

### 🔧 **Application Layer** (`NebulaChat.Application`)
```
Application/
├── Features/
│   ├── Users/
│   │   ├── Commands/
│   │   │   ├── RegisterUser/
│   │   │   ├── UpdateProfile/
│   │   │   └── ChangeStatus/
│   │   └── Queries/
│   │       ├── GetUser/
│   │       ├── GetUserProfile/
│   │       └── GetUserServers/
│   ├── Servers/
│   │   ├── Commands/
│   │   │   ├── CreateServer/
│   │   │   ├── JoinServer/
│   │   │   └── LeaveServer/
│   │   └── Queries/
│   │       ├── GetServer/
│   │       ├── GetServerMembers/
│   │       └── GetServerChannels/
│   ├── Channels/
│   │   ├── Commands/
│   │   │   ├── CreateChannel/
│   │   │   ├── UpdateChannel/
│   │   │   └── DeleteChannel/
│   │   └── Queries/
│   │       ├── GetChannel/
│   │       ├── GetChannelMessages/
│   │       └── GetChannelPermissions/
│   ├── Messages/
│   │   ├── Commands/
│   │   │   ├── SendMessage/
│   │   │   ├── EditMessage/
│   │   │   ├── DeleteMessage/
│   │   │   └── AddReaction/
│   │   └── Queries/
│   │       ├── GetMessages/
│   │       ├── SearchMessages/
│   │       └── GetMessageThread/
│   ├── Roles/
│   │   ├── Commands/
│   │   │   ├── CreateRole/
│   │   │   ├── AssignRole/
│   │   │   └── UpdatePermissions/
│   │   └── Queries/
│   │       ├── GetRoles/
│   │       └── GetUserRoles/
│   └── Social/
│       ├── Commands/
│       │   ├── SendFriendRequest/
│       │   ├── AcceptFriendRequest/
│       │   └── BlockUser/
│       └── Queries/
│           ├── GetFriends/
│           ├── GetDirectMessages/
│           └── GetBlockedUsers/
├── Common/
│   ├── Behaviors/
│   │   ├── ValidationBehavior.cs
│   │   ├── LoggingBehavior.cs
│   │   └── PerformanceBehavior.cs
│   ├── DTOs/
│   ├── Mappings/
│   ├── Validators/
│   └── Exceptions/
└── Interfaces/
    ├── Services/
    ├── Repositories/
    └── Infrastructure/
```

### 🗄️ **Infrastructure Layer** (`NebulaChat.Infrastructure`)
```
Infrastructure/
├── Persistence/
│   ├── Context/
│   │   └── NebulaDbContext.cs
│   ├── Configurations/
│   │   ├── UserConfiguration.cs
│   │   ├── ServerConfiguration.cs
│   │   ├── ChannelConfiguration.cs
│   │   ├── MessageConfiguration.cs
│   │   └── RoleConfiguration.cs
│   ├── Repositories/
│   │   ├── UserRepository.cs
│   │   ├── ServerRepository.cs
│   │   ├── ChannelRepository.cs
│   │   ├── MessageRepository.cs
│   │   └── RoleRepository.cs
│   └── Migrations/
├── Services/
│   ├── Authentication/
│   │   ├── JwtTokenService.cs
│   │   └── AuthenticationService.cs
│   ├── SignalR/
│   │   ├── ChatHub.cs
│   │   ├── VoiceHub.cs
│   │   └── PresenceHub.cs
│   ├── FileStorage/
│   │   ├── LocalFileService.cs
│   │   └── CloudFileService.cs
│   ├── Caching/
│   │   └── RedisCacheService.cs
│   ├── Notifications/
│   │   └── PushNotificationService.cs
│   └── Voice/
│       └── WebRTCService.cs
├── External/
│   ├── Email/
│   ├── SMS/
│   └── CDN/
└── Configuration/
    ├── DependencyInjection.cs
    └── DatabaseConfiguration.cs
```

### 🌐 **API Layer** (`NebulaChat.Api`)
```
Api/
├── Controllers/
│   ├── v1/
│   │   ├── AuthController.cs
│   │   ├── UsersController.cs
│   │   ├── ServersController.cs
│   │   ├── ChannelsController.cs
│   │   ├── MessagesController.cs
│   │   ├── RolesController.cs
│   │   ├── SocialController.cs
│   │   └── FilesController.cs
│   └── v2/ (будущие версии)
├── Hubs/
│   ├── ChatHub.cs
│   ├── VoiceHub.cs
│   ├── PresenceHub.cs
│   └── NotificationHub.cs
├── Middleware/
│   ├── ErrorHandlingMiddleware.cs
│   ├── RequestLoggingMiddleware.cs
│   └── RateLimitingMiddleware.cs
├── Filters/
│   ├── ValidationFilter.cs
│   └── AuthorizationFilter.cs
├── Configuration/
│   ├── SwaggerConfiguration.cs
│   ├── CorsConfiguration.cs
│   └── SignalRConfiguration.cs
└── Extensions/
    ├── ServiceCollectionExtensions.cs
    └── ApplicationBuilderExtensions.cs
```

### 🎨 **Web Layer** (`NebulaChat.Web`)
```
Web/src/
├── components/
│   ├── layout/
│   │   ├── Sidebar/
│   │   ├── Header/
│   │   └── MainContent/
│   ├── server/
│   │   ├── ServerList/
│   │   ├── ServerSettings/
│   │   └── MemberList/
│   ├── channel/
│   │   ├── ChannelList/
│   │   ├── ChannelHeader/
│   │   └── VoiceChannel/
│   ├── chat/
│   │   ├── MessageList/
│   │   ├── MessageInput/
│   │   ├── MessageItem/
│   │   └── EmojiPicker/
│   ├── user/
│   │   ├── UserProfile/
│   │   ├── UserSettings/
│   │   └── StatusIndicator/
│   ├── modals/
│   │   ├── CreateServer/
│   │   ├── JoinServer/
│   │   ├── UserSettings/
│   │   └── ChannelSettings/
│   └── common/
│       ├── Button/
│       ├── Input/
│       ├── Modal/
│       └── Loading/
├── pages/
│   ├── auth/
│   │   ├── Login.tsx
│   │   └── Register.tsx
│   ├── app/
│   │   ├── Dashboard.tsx
│   │   ├── Server.tsx
│   │   └── DirectMessages.tsx
│   └── settings/
│       └── UserSettings.tsx
├── hooks/
│   ├── useAuth.ts
│   ├── useSignalR.ts
│   ├── useVoice.ts
│   └── usePermissions.ts
├── services/
│   ├── api/
│   │   ├── authApi.ts
│   │   ├── userApi.ts
│   │   ├── serverApi.ts
│   │   ├── channelApi.ts
│   │   └── messageApi.ts
│   ├── signalr/
│   │   ├── chatConnection.ts
│   │   ├── voiceConnection.ts
│   │   └── presenceConnection.ts
│   └── voice/
│       └── webrtcService.ts
├── store/
│   ├── slices/
│   │   ├── authSlice.ts
│   │   ├── userSlice.ts
│   │   ├── serverSlice.ts
│   │   ├── channelSlice.ts
│   │   └── messageSlice.ts
│   └── index.ts
├── types/
│   ├── api.ts
│   ├── user.ts
│   ├── server.ts
│   ├── channel.ts
│   ├── message.ts
│   └── common.ts
└── utils/
    ├── constants.ts
    ├── helpers.ts
    └── validation.ts
```

## 🔄 Real-time Architecture

### SignalR Hubs:
- **ChatHub**: Сообщения, реакции, typing indicators
- **VoiceHub**: Голосовые соединения, mute/unmute
- **PresenceHub**: Статусы пользователей, активность
- **NotificationHub**: Системные уведомления

### WebRTC:
- Peer-to-peer голосовые соединения
- Видеозвонки
- Демонстрация экрана

## 📊 База данных

### Основные таблицы:
- **Users**: Пользователи
- **Servers**: Серверы (гильдии)
- **Channels**: Каналы
- **Messages**: Сообщения
- **Roles**: Роли
- **Permissions**: Права доступа
- **ServerMembers**: Участники серверов
- **Friendships**: Дружба между пользователями
- **UserRoles**: Роли пользователей

## 🔐 Система прав доступа

### Иерархия прав:
1. **Server Owner** - полные права
2. **Administrator** - почти все права
3. **Moderator** - модерация
4. **Custom Roles** - настраиваемые роли
5. **Everyone** - базовые права

### Типы прав:
- View channels
- Send messages
- Manage messages
- Connect to voice
- Speak in voice
- Manage channels
- Manage roles
- Ban members
- Kick members

## 🚀 Масштабирование

### Horizontal Scaling:
- Multiple API instances
- Redis для SignalR backplane
- CDN для статических файлов
- Database sharding по серверам

### Performance:
- Message pagination
- Lazy loading каналов
- Voice optimization
- Image compression

Эта структура обеспечит четкую организацию кода для всех функций Discord-клона! 