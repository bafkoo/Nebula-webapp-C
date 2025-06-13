# 🌌 NebulaChat - Discord Clone

Полнофункциональный клон Discord с поддержкой серверов, каналов, голосовых чатов, ролей и модерации.

## 🏗️ Архитектура

- **Backend**: .NET 8 + Clean Architecture + CQRS + SignalR
- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS
- **Database**: PostgreSQL + Entity Framework Core
- **Cache**: Redis
- **Real-time**: SignalR для WebSocket соединений

## 🚀 Быстрый старт

### Предварительные требования

- Docker & Docker Compose
- .NET 8 SDK (для разработки)
- Node.js 18+ (для разработки)

### Запуск с Docker

```bash
# Клонирование репозитория
git clone <repo-url>
cd NebulaChat

# Запуск всей системы
docker-compose up -d

# Приложение будет доступно:
# Frontend: http://localhost:3000
# Backend API: http://localhost:8080
# PostgreSQL: localhost:5432
# Redis: localhost:6379
```

### Разработка

#### Backend (.NET)

```bash
cd src/backend

# Восстановление зависимостей
dotnet restore

# Запуск миграций базы данных
dotnet ef database update --project NebulaChat.Infrastructure --startup-project NebulaChat.API

# Запуск API
dotnet run --project NebulaChat.API
```

#### Frontend (React)

```bash
cd src/frontend

# Установка зависимостей
npm install

# Запуск dev сервера
npm run dev

# Сборка для продакшна
npm run build
```

## 📋 Основные функции

### ✅ Реализовано
- [x] Базовая архитектура проекта
- [x] Docker инфраструктура
- [x] Clean Architecture структура
- [x] Frontend setup (React + TypeScript + Vite)
- [x] Tailwind CSS конфигурация

### 🚧 В разработке
- [ ] Аутентификация JWT
- [ ] Система пользователей
- [ ] Серверы (Guilds)
- [ ] Каналы (текстовые/голосовые)
- [ ] Real-time чат (SignalR)
- [ ] Система ролей и прав

### 📋 Планируется
- [ ] Загрузка файлов и изображений
- [ ] Голосовые каналы (WebRTC)
- [ ] Система друзей
- [ ] Прямые сообщения
- [ ] Модерация
- [ ] Bot API

## 🛠️ Технологический стек

### Backend
- **.NET 8** - Основной фреймворк
- **ASP.NET Core** - Web API
- **Entity Framework Core** - ORM для PostgreSQL
- **MediatR** - CQRS pattern
- **SignalR** - Real-time коммуникация
- **FluentValidation** - Валидация
- **JWT Bearer** - Аутентификация

### Frontend
- **React 18** - UI библиотека
- **TypeScript** - Типобезопасность
- **Vite** - Build tool и dev server
- **TanStack Query** - Server state management
- **Zustand** - Client state management
- **React Router** - Маршрутизация
- **Tailwind CSS** - Utility-first CSS
- **Styled Components** - CSS-in-JS
- **Radix UI** - Headless компоненты

### Инфраструктура
- **Docker** - Контейнеризация
- **PostgreSQL** - Основная база данных
- **Redis** - Кэширование и SignalR backplane
- **Nginx** - Reverse proxy для frontend

## 📁 Структура проекта

```
NebulaChat/
├── src/
│   ├── backend/                 # .NET Backend
│   │   ├── NebulaChat.Domain/   # Domain layer (entities, value objects)
│   │   ├── NebulaChat.Application/ # Application layer (CQRS, use cases)
│   │   ├── NebulaChat.Infrastructure/ # Infrastructure layer (DB, external services)
│   │   └── NebulaChat.API/      # Presentation layer (Controllers, SignalR hubs)
│   └── frontend/                # React Frontend
│       ├── src/
│       │   ├── components/      # Переиспользуемые компоненты
│       │   ├── pages/           # Страницы приложения
│       │   ├── hooks/           # Custom React hooks
│       │   ├── services/        # API сервисы
│       │   ├── stores/          # Zustand stores
│       │   ├── types/           # TypeScript типы
│       │   └── utils/           # Утилитарные функции
│       └── public/              # Статические файлы
├── docs/                        # Документация
├── tests/                       # Тесты
├── docker-compose.yml           # Docker Compose конфигурация
└── README.md                    # Этот файл
```

## 🔧 Переменные окружения

### Backend (.NET)
```bash
ASPNETCORE_ENVIRONMENT=Development
ConnectionStrings__DefaultConnection="Host=localhost;Database=nebulachat;Username=nebula;Password=nebula123"
ConnectionStrings__Redis="localhost:6379"
JWT__Secret="your-super-secret-jwt-key"
JWT__Issuer="NebulaChat"
JWT__Audience="NebulaChat"
```

### Frontend (React)
```bash
VITE_API_URL=http://localhost:8080
VITE_HUB_URL=http://localhost:8080/hubs
```

## 🤝 Вклад в проект

1. Fork репозитория
2. Создайте feature branch (`git checkout -b feature/amazing-feature`)
3. Commit изменения (`git commit -m 'Add amazing feature'`)
4. Push в branch (`git push origin feature/amazing-feature`)
5. Откройте Pull Request

## 📄 Лицензия

Этот проект распространяется под лицензией MIT. См. файл `LICENSE` для подробностей.

## 🎯 Дорожная карта

Подробную дорожную карту разработки смотрите в файле `DEVELOPMENT_ROADMAP.md`.

## 📖 Документация

- [Архитектура проекта](ARCHITECTURE.md)
- [Технические решения](TECHNICAL_DECISIONS.md)
- [План разработки](DEVELOPMENT_ROADMAP.md)

---

🌟 **Star этот репозиторий, если проект вам понравился!** 