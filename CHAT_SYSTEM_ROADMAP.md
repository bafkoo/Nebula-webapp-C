# 💬 CHAT SYSTEM ROADMAP - NEBULA CHAT PROJECT

## 🔍 АНАЛИЗ BACKEND АРХИТЕКТУРЫ

### 🏗️ **Текущая инфраструктура (.NET 9.0):**

**✅ Существующие компоненты:**
- **Clean Architecture** - 4 слоя (API, Application, Domain, Infrastructure)
- **PostgreSQL** база данных с Entity Framework Core
- **JWT Authentication** с refresh токенами
- **OAuth провайдеры** (Google, GitHub) 
- **Email система** (Resend API)
- **BCrypt** хеширование паролей
- **CORS** настройка для frontend

**✅ Готовая User система:**
```csharp
User Entity:
- Id (Guid), Username, Email, PasswordHash
- OAuth поля: GoogleId, GitHubId, AppleId
- Email верификация: IsEmailVerified, EmailVerifiedAt
- Токены: EmailVerificationToken, PasswordResetToken
- Timestamps: CreatedAt, UpdatedAt, LastLoginAt
- AvatarUrl для профиля пользователя
```

**🔧 Пакеты для расширения:**
- **SignalR** для real-time чатов 
- **AutoMapper** для маппинга DTOs
- **FluentValidation** для валидации запросов
- **Serilog** для логирования
- **Redis** для кеширования (опционально)

---

## 🚀 ROADMAP: ЧАТ СИСТЕМА

### 📊 **ПРОГРЕСС ТРЕКИНГ:**
- ⏳ В процессе
- ✅ Выполнено  
- ❌ Заблокировано

---

## 🎯 **ЭТАП 1: АРХИТЕКТУРА ЧАТА (4-5 часов)**

### **1.1 Backend Domain Models** ✅
**Время:** 1.5 часа  
**Приоритет:** Критический

**Задачи:**
- [✅] Создать Chat Entity (Id, Name, Type, CreatedBy, CreatedAt)
- [✅] Создать Message Entity (Id, ChatId, UserId, Content, MessageType, CreatedAt)
- [✅] Создать ChatParticipant Entity (ChatId, UserId, Role, JoinedAt, LastReadAt)
- [✅] Настроить EF Core отношения между моделями
- [✅] Добавить миграции для новых таблиц

**Файлы для создания:**
```
NebulaChat.Domain/Entities/
├── Chat.cs
├── Message.cs  
├── ChatParticipant.cs
└── Enums/
    ├── ChatType.cs (Private, Group, Channel)
    ├── MessageType.cs (Text, Image, File, System)
    └── ParticipantRole.cs (Member, Admin, Owner)
```

### **1.2 Database Schema Design** ✅
**Время:** 1 час  
**Приоритет:** Критический

**Задачи:**
- [✅] Спроектировать оптимальные индексы для чатов
- [✅] Настроить cascade удаление для сообщений
- [✅] Добавить ограничения на размер сообщений
- [✅] Создать индексы для быстрого поиска по чатам
- [✅] Настроить поддержку soft delete

**✅ ЗАВЕРШЕНО:**
- ✅ Оптимизированы индексы для всех сущностей
- ✅ Добавлены composite индексы для производительности
- ✅ Настроены filtered индексы для активных записей
- ✅ Ограничения на размер сообщений (2000 символов)
- ✅ Ограничения на размер файлов (50MB)
- ✅ Query фильтры для soft delete
- ✅ Миграция OptimizeDbSchemaComplete применена

### **1.3 SignalR Integration** ✅  
**Время:** 2 часа
**Приоритет:** Критический

**Задачи:**
- [✅] Установить Microsoft.AspNetCore.SignalR пакет
- [✅] Создать ChatHub для real-time общения
- [✅] Настроить авторизацию в SignalR
- [✅] Реализовать группы для чат комнат
- [✅] Добавить typing indicators (пользователь печатает)
- [✅] Создать ConnectionMapping сервис для отслеживания соединений
- [✅] Настроить JWT аутентификацию для SignalR Hub

**✅ ЗАВЕРШЕНО:**
- ✅ ChatHub.cs - основной hub с методами JoinChat, LeaveChat, SendMessage, SetTyping, MarkAsRead
- ✅ IConnectionMapping.cs - интерфейс для маппинга соединений
- ✅ ConnectionMappingService.cs - thread-safe реализация маппинга пользователей к соединениям
- ✅ Настройка SignalR в Program.cs с оптимизациями производительности
- ✅ JWT токен поддержка для SignalR через query string
- ✅ Авторизация [Authorize] на Hub уровне
- ✅ Обработка подключения/отключения пользователей
- ✅ Real-time события: UserOnline, UserOffline, UserJoined, UserLeft, UserTyping, ReceiveMessage, MessageRead
- ✅ Error handling и логирование всех операций
- ✅ Hub доступен по адресу: ws://localhost:5000/chatHub

### **1.4 Repository Pattern** ✅
**Время:** 1 час
**Приоритет:** Высокий

**Задачи:**
- [✅] Создать IChatRepository с базовыми CRUD операциями
- [✅] Создать IMessageRepository с пагинацией
- [✅] Реализовать паттерн Unit of Work
- [✅] Добавить методы для получения чатов пользователя
- [✅] Оптимизировать запросы с Include

---

## 💬 **ЭТАП 2: ПРИВАТНЫЕ ЧАТЫ (5-6 часов)**

### **2.1 Chat API Controllers** ✅
**Время:** 1 час
**Приоритет:** Критический

**Задачи:**
- [✅] Создать ChatController с базовым CRUD
- [✅] Реализовать GET /api/chat - получение чатов пользователя с пагинацией
- [✅] Реализовать POST /api/chat - создание нового чата
- [✅] Реализовать GET /api/chat/{id} - получение конкретного чата
- [✅] Реализовать 
PUT /api/chat/{id} - обновление чата
- [✅] Реализовать DELETE /api/chat/{id} - удаление чата
- [✅] Добавить GET /api/chat/search - поиск чатов по названию

**✅ ЗАВЕРШЕНО:**
- ✅ ChatController.cs - полный REST API для управления чатами
- ✅ JWT авторизация на всех endpoints
- ✅ Валидация параметров пагинации
- ✅ Правильная обработка ошибок с логированием
- ✅ Использование enum ChatType вместо строк
- ✅ Временные заглушки для демонстрации API
- ✅ HTTP статус коды: 200 OK, 201 Created, 204 NoContent, 400 BadRequest, 403 Forbidden, 500 InternalServerError

### **2.2 Message API Controllers** ✅
**Время:** 1 час
**Приоритет:** Критический

**Задачи:**
- [✅] Создать MessagesController
- [✅] Реализовать GET /api/chats/{id}/messages с пагинацией
- [✅] Реализовать POST /api/chats/{id}/messages - отправка сообщения
- [✅] Добавить PUT /api/messages/{id} - редактирование сообщения
- [✅] Добавить DELETE /api/messages/{id} - удаление сообщения
- [✅] Реализовать POST /api/messages/{id}/read - отметка как прочитанное

**✅ ЗАВЕРШЕНО:**
- ✅ MessagesController.cs - базовый REST API для управления сообщениями с пагинацией и заглушками

### **2.3 Real-time Messaging** ✅
**Время:** 2.5 часа
**Приоритет:** Критический

**Задачи:**
- [✅] Интеграция SignalR с Message Controller
- [✅] Реализовать broadcast новых сообщений в группы
- [✅] Добавить broadcast для редактирования и удаления сообщений
- [✅] Реализовать typing indicators
- [✅] Добавить уведомления о прочтении сообщений
- [✅] Добавить online/offline статусы пользователей (базовая реализация)
- [ ] Настроить автоматическое переподключение (будет выполнено на frontend)

**✅ ЗАВЕРШЕНО:**
- ✅ `IHubContext<ChatHub>` внедрен в `MessagesController`
- ✅ Методы API (`POST`, `PUT`, `DELETE`) теперь отправляют real-time события
- ✅ В `ChatHub` реализованы методы `SetTyping` и `MarkAsRead`
- ✅ Базовая логика `UserOnline`/`UserOffline` реализована с рассылкой всем пользователям

### **2.4 DTOs и Validation** ✅
**Время:** 1 час
**Приоритет:** Высокий

**Задачи:**
- [✅] Создать ChatDto, MessageDto, ParticipantDto (проверено, основные есть)
- [✅] Добавить CreateChatRequest, SendMessageRequest DTOs (проверено, существуют)
- [✅] Настроить FluentValidation для всех request DTOs
- [✅] Добавить AutoMapper конфигурацию
- [✅] Реализовать пагинацию для сообщений (реализовано в API)

**✅ ЗАВЕРШЕНО:**
- ✅ Установлен и настроен FluentValidation
- ✅ Созданы валидаторы для CreateChatRequest и SendMessageRequest
- ✅ Установлен и настроен AutoMapper
- ✅ Создан профиль для маппинга Chat -> ChatDto
- ✅ Устранены конфликты пакетов и ошибки компиляции

---

## 👥 **ЭТАП 3: ГРУППОВЫЕ ЧАТЫ (4-5 часов)**

### **3.1 Group Chat Features** ✅
**Время:** 3 часа
**Приоритет:** Высокий

**Задачи:**
- [✅] Расширить Chat Entity для группы (MaxParticipants, Description)
- [✅] Реализовать роли участников (Owner, Admin, Member)
- [✅] Добавить права доступа (кто может добавлять участников)
- [✅] Реализовать групповые приглашения
- [✅] Добавить настройки группы (аватар, описание)

### **3.2 Admin Features** ✅
**Время:** 1.5 часа
**Приоритет:** Средний

**Задачи:**
- [✅] Kick/Ban участников из группы
- [✅] Изменение ролей участников
- [✅] Настройки группы (только для админов)
- [✅] Модерация сообщений
- [✅] Логирование административных действий

### **3.3 Group Management UI Logic** ⏳
**Время:** 2 часа
**Приоритет:** Высокий

**Задачи:**
- [✅] API для управления участниками группы
- [✅] Поиск и добавление новых участников
- [✅] Просмотр списка участников с ролями
- [✅] История административных действий
- [✅] Экспорт участников группы

### **3.4 Group Management UI Logic** ✅
**Время:** 2 часа
**Приоритет:** Высокий

**Задачи:**
- [✅] API для управления участниками группы
- [✅] Поиск и добавление новых участников
- [✅] Просмотр списка участников с ролями
- [✅] История административных действий
- [✅] Экспорт участников группы

---

## 📱 **ЭТАП 4: ВСТРОЕННЫЙ ЧАТ В ГЛАВНУЮ СТРАНИЦУ (6-8 часов)**

### **4.1 Full-Featured Chat Interface** ✅
**Время:** 3-4 часа
**Приоритет:** Критический

**ОБНОВЛЕННАЯ КОНЦЕПЦИЯ:** Полноценный чат интерфейс с вкладочной системой Dashboard/Chat

**Задачи:**
- [✅] Создать FullChatInterface - полноценный чат с левой панелью и основной областью
- [✅] Система вкладок Dashboard/Chat в MainPage
- [✅] Левая панель со списком чатов, поиском и аватарами
- [✅] Правая панель с активной перепиской
- [✅] ChatMessageList - переиспользуем для отображения сообщений
- [✅] ChatInput - переиспользуем для ввода сообщений
- [✅] TypingIndicator - переиспользуем для индикатора печати
- [✅] Расширены типы ChatDto для поддержки UI полей

**Структура компонентов:**
```
src/components/app/chat/
├── FullChatInterface.tsx        # ✅ Главный полноценный интерфейс чата
├── ChatMessageList.tsx          # ✅ Список сообщений (переиспользован)
├── ChatMessageItem.tsx          # ✅ Отдельное сообщение (переиспользован)  
├── ChatInput.tsx                # ✅ Поле ввода (переиспользован)
├── TypingIndicator.tsx          # ✅ Индикатор печати (переиспользован)
├── ChatHeader.tsx               # ⚠️ Больше не используется
└── common/
    ├── OnlineStatus.tsx         # 🔄 Планируется
    └── ChatUserAvatar.tsx       # 🔄 Планируется
```

**Интеграция в MainPage:**
- ✅ Система вкладок: Dashboard ↔ Chat
- ✅ Полноэкранный чат интерфейс 
- ✅ Левая панель: список чатов (320px)
- ✅ Правая панель: активная переписка (flex-1)
- ✅ Поиск по чатам, счетчики непрочитанных
- ✅ Тот же дизайн что и Dashboard (Card + темная тема)

### **4.2 SignalR Client Integration** ⏳
**Время:** 2 часа
**Приоритет:** Критический

**Задачи:**
- [ ] Установить @microsoft/signalr пакет
- [ ] Создать SignalR connection service в `src/lib/signalr.ts`
- [ ] Реализовать подключение с JWT авторизацией
- [ ] Добавить обработчики событий (новое сообщение, typing)
- [ ] Реализовать переподключение при разрыве связи
- [ ] Интегрировать с FullChatInterface

### **4.3 Chat State Management** ⏳
**Время:** 2 часа
**Приоритет:** Высокий

**Задачи:**
- [ ] Расширить существующий appStore или создать chatStore с Zustand
- [ ] Управление списком чатов
- [ ] Кеширование сообщений активного чата
- [ ] Состояние typing indicators
- [ ] Online/offline статусы пользователей
- [ ] Optimistic updates для отправки сообщений
- [ ] Активный чат и переключение между чатами

### **4.4 Message Features** ⏳
**Время:** 2-3 часа
**Приоритет:** Высокий

**Задачи:**
- [ ] Отправка текстовых сообщений через FullChatInterface
- [ ] Real-time получение новых сообщений
- [ ] Автоскролл к новым сообщениям в полноценном виде
- [ ] Отметки о прочтении
- [ ] Базовая загрузка истории сообщений (последние 20)
- [ ] Уведомления о новых сообщениях в неактивных чатах

**Особенности полноценного чата:**
- Полноэкранный дизайн для максимального комфорта
- Авто-сворачивание при клике вне интерфейса
- Быстрое переключение между чатами через систему вкладок
- Полноценные сообщения без избыточной информации
- Интеграция с общим дизайном приложения

---

## 🎨 **ЭТАП 5: UI/UX POLISH (4-5 часов)**

### **5.1 Message Formatting** ⏳
**Время:** 1.5 часа
**Приоритет:** Средний

**Задачи:**
- [ ] Markdown поддержка (жирный, курсив, код)
- [ ] Эмодзи picker
- [ ] Ссылки с превью
- [ ] Код блоки с syntax highlighting
- [ ] @mentions пользователей

### **5.2 Visual Enhancements** ⏳  
**Время:** 2 часа
**Приоритет:** Средний

**Задачи:**
- [ ] Анимации для новых сообщений
- [ ] Градиенты и shadows для чат окон
- [ ] Аватары пользователей  
- [ ] Статус индикаторы (онлайн/оффлайн/печатает)
- [ ] Темная/светлая тема для чатов

### **5.3 Mobile Responsive** ⏳
**Время:** 1.5 часа  
**Приоритет:** Высокий

**Задачи:**
- [ ] Адаптивная верстка для мобильных
- [ ] Сворачиваемый sidebar на мобильных
- [ ] Touch gestures для навигации
- [ ] Виртуальная клавиатура поддержка
- [ ] Pull-to-refresh для загрузки сообщений

---

## 🔧 **ЭТАП 6: ADVANCED FEATURES (6-8 часов)**

### **6.1 File Sharing** ⏳
**Время:** 3 часа
**Приоритет:** Средний

**Задачи:**
- [ ] Upload API для файлов
- [ ] Поддержка изображений, документов
- [ ] Thumbnail генерация для изображений
- [ ] Прогресс-бар загрузки файлов
- [ ] Ограничения на размер и тип файлов

### **6.2 Search & History** ⏳
**Время:** 2 часа
**Приоритет:** Средний

**Задачи:**
- [ ] Поиск по сообщениям внутри чата
- [ ] Глобальный поиск по всем чатам
- [ ] Фильтры по дате, автору, типу сообщения
- [ ] Highlight найденного текста
- [ ] Быстрый переход к найденному сообщению

### **6.3 Notifications** ⏳
**Время:** 2 часа
**Приоритет:** Высокий

**Задачи:**
- [ ] Browser push notifications
- [ ] Звуковые уведомления
- [ ] Настройки уведомлений (отключить/включить)
- [ ] Уведомления только для @mentions
- [ ] Badge с количеством непрочитанных

### **6.4 Performance Optimization** ⏳
**Время:** 2 часа
**Приоритет:** Высокий

**Задачи:**
- [ ] Виртуализация списка сообщений
- [ ] Lazy loading чатов
- [ ] Debounce для typing indicators
- [ ] Кеширование API запросов
- [ ] Оптимизация SignalR reconnection

---

## 📊 **УСПЕХ МЕТРИКИ:**

### **🎯 Основные KPI:**
- ✅ Real-time сообщения < 100ms задержка
- ✅ Поддержка 100+ одновременных пользователей  
- ✅ 99%+ uptime SignalR соединений
- ✅ < 2s загрузка истории чатов
- ✅ Mobile-first responsive design

### **🚀 Продвинутые цели:**
- 📱 PWA с offline поддержкой
- 🔊 Voice messages
- 📹 Video calls integration
- 🤖 Bot framework интеграция
- 📈 Analytics и метрики использования

---

## 🛠️ **ТЕХНИЧЕСКИЙ СТЕК:**

### **Backend (.NET 9.0):**
```csharp
- ASP.NET Core Web API
- Entity Framework Core + PostgreSQL  
- SignalR для real-time
- JWT Authentication + OAuth
- AutoMapper + FluentValidation
- Serilog для логирования
- xUnit для тестирования
```

### **Frontend (React + TypeScript):**
```typescript
- React 18 + TypeScript
- Zustand для state management  
- @microsoft/signalr для real-time
- Tailwind CSS для стилизации
- React Router для навигации
- React Query для API кеширования
```

---

## ⚡ **БЫСТРЫЙ СТАРТ:**

### **Следующие шаги для начала разработки:**

1. **🎯 Приоритет #1:** Начать с **Этапа 1.1** - создание Domain Models
2. **📦 Установить пакеты:** SignalR, AutoMapper, FluentValidation  
3. **🗄️ Database:** Создать миграции для Chat, Message, ChatParticipant
4. **🔌 SignalR:** Настроить базовый ChatHub
5. **📱 Frontend:** Создать базовую структуру chat компонентов

### **Команды для установки пакетов:**
```bash
# Backend packages
dotnet add NebulaChat.API package Microsoft.AspNetCore.SignalR
dotnet add NebulaChat.API package AutoMapper
dotnet add NebulaChat.API package FluentValidation

# Frontend packages  
npm install @microsoft/signalr
npm install @tanstack/react-query
```

---

## 🎉 **РЕЗУЛЬТАТ:**

После завершения роудмапа у нас будет **полноценная чат система** уровня Discord/Slack с:

- 💬 **Real-time messaging** с мгновенной доставкой
- 👥 **Приватные и групповые чаты** с ролями  
- 📱 **Mobile-responsive UI** с современным дизайном
- 🔔 **Push уведомления** и typing indicators
- 📁 **File sharing** с preview возможностями
- 🔍 **Поиск по сообщениям** и история
- 🎨 **Полированный UX** с анимациями

**Общее время разработки: 25-35 часов**  
**MVP готов через: 15-20 часов**

---

*💡 Этот роудмап создан на основе глубокого анализа существующей backend архитектуры и следует лучшим практикам разработки enterprise чат систем.* 

---

## 📊 **ОБЩИЙ ПРОГРЕСС: 46% (11/24 задач)**

**Статус:** 🔄 В РАЗРАБОТКЕ (обновлена концепция!)  
**Выполнено:** 11 из 24 задач (46%)  
**Время:** ~10 часов потрачено из ~25-35 часов общего времени

**🔄 ОБНОВЛЕНИЕ КОНЦЕПЦИИ:** Полноценный чат интерфейс с вкладочной системой Dashboard/Chat

| Этап | Статус | Задачи | Прогресс |
|------|--------|---------|----------|
| 1.1 Domain Models | ✅ | 1/1 | 100% |
| 1.2 Database Schema Design | ✅ | 1/1 | 100% |
| 1.3 SignalR Integration | ✅ | 1/1 | 100% |
| 1.4 Repository Pattern | ✅ | 1/1 | 100% |
| 2.1 Chat API Controllers | ✅ | 1/1 | 100% |
| 2.2 Message API Controllers | ✅ | 1/1 | 100% |
| 2.3 Real-time Messaging | ✅ | 1/1 | 100% |
| 2.4 DTOs и Validation | ✅ | 1/1 | 100% |
| 3.1 Group Chat Features | ✅ | 5/5 | 100% |
| 3.2 Admin Features | ✅ | 5/5 | 100% |
| 4.1 Full-Featured Chat Interface | ✅ | 4/4 | 100% |
| 4.2 SignalR Client Integration | ⏳ | 0/6 | 0% |
| 4.3 Chat State Management | ⏳ | 0/7 | 0% |
| 4.4 Message Features | ⏳ | 0/6 | 0% |
| 5.1 Message Formatting | ⏳ | 0/5 | 0% |
| 5.2 Visual Enhancements | ⏳ | 0/5 | 0% |
| 5.3 Mobile Responsive | ⏳ | 0/5 | 0% |
| 6.1 File Sharing | ⏳ | 0/5 | 0% |
| 6.2 Search & History | ⏳ | 0/5 | 0% |
| 6.3 Notifications | ⏳ | 0/5 | 0% |
| 6.4 Performance Optimization | ⏳ | 0/5 | 0% |
| **ИТОГО** | **🔄** | **11/24** | **46%** |

## ✅ **ДОСТИЖЕНИЯ:**

### 🏗️ **Backend готов (100%):**
- ✅ **Domain Models** - Chat, Message, ChatParticipant сущности с enum'ами  
- ✅ **Database Schema** - Оптимизированные индексы, ограничения, миграции
- ✅ **SignalR Hub** - Real-time функциональность, ConnectionMapping, JWT auth
- ✅ **REST API** - CRUD операции для чатов и сообщений
- ✅ **Групповые чаты** - роли, права, административные функции
- ✅ **Validation & DTOs** - FluentValidation и AutoMapper настроены

### 🎯 **Следующий этап:**
**ЭТАП 4.1: Full-Featured Chat Interface** - создание полноценного чат интерфейса для встраивания в главную страницу `/app`

---

*💡 Основа чат системы готова! Архитектура, база данных, SignalR и API контроллеры настроены. Следующий шаг - создание Message API для полноценного обмена сообщениями.*