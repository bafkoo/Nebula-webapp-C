# ROADMAP: ГЛАВНАЯ СТРАНИЦА NEBULA CHAT

## СТЕК ТЕХНОЛОГИЙ
- React 19.1.0 + TypeScript + Vite
- Tailwind CSS 4.1.10 + CSS Variables
- React Router DOM 7.6.2
- Zustand + AuthContext
- Radix UI + Собственные компоненты
- React i18next

## ЦЕЛИ
Создать главную страницу `/app` после входа/регистрации.
Использовать только существующие цвета и иконки из проекта.

## СТРУКТУРА ФАЙЛОВ

### Новые директории:
```
src/frontend/src/
├── components/app/
│   ├── layout/
│   ├── sidebar/
│   ├── chat/
│   └── common/
├── pages/app/
├── hooks/app/
├── stores/
└── types/app.ts
```

### Правила именования:
- PascalCase: компоненты, типы
- camelCase: переменные, функции, хуки
- kebab-case: CSS файлы
- UPPER_CASE: константы

## ЭТАПЫ РАЗРАБОТКИ

### ЭТАП 1: ИНФРАСТРУКТУРА (2-3ч)

**1.1 Создать типы**
Файл: `src/frontend/src/types/app.ts`
```typescript
export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  status: UserStatus;
  isOnline: boolean;
  currentGame?: string;
}

export type UserStatus = 'online' | 'away' | 'busy' | 'offline';

export interface AppState {
  currentUser: User | null;
  isLoading: boolean;
  sidebarCollapsed: boolean;
}
```

**1.2 Создать Zustand стор**
Файл: `src/frontend/src/stores/appStore.ts`
```typescript
import { create } from 'zustand';
import type { AppState, User } from '../types/app';

interface AppStore extends AppState {
  setCurrentUser: (user: User | null) => void;
  toggleSidebar: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAppStore = create<AppStore>((set) => ({
  currentUser: null,
  isLoading: false,
  sidebarCollapsed: false,
  
  setCurrentUser: (user) => set({ currentUser: user }),
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setLoading: (loading) => set({ isLoading: loading }),
}));
```

**1.3 Обновить роутинг**
В `src/frontend/src/App.tsx` добавить:
```typescript
import MainPage from './pages/app/MainPage'

// В Routes:
<Route 
  path="/app" 
  element={
    <ProtectedRoute requireVerification={true}>
      <MainPage />
    </ProtectedRoute>
  } 
/>
```

### ЭТАП 2: UI КОМПОНЕНТЫ (4-5ч)

**2.1 Базовые UI компоненты**

Файл: `src/frontend/src/components/ui/Button.tsx`
```typescript
import React from 'react';
import { cn } from '../../lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({ 
  className, 
  variant = 'primary', 
  size = 'md',
  ...props 
}) => {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-md font-medium transition-colors',
        {
          'bg-primary text-primary-foreground hover:bg-primary/90': variant === 'primary',
          'bg-secondary text-secondary-foreground hover:bg-secondary/80': variant === 'secondary',
          'hover:bg-accent hover:text-accent-foreground': variant === 'ghost',
        },
        {
          'h-8 px-3 text-sm': size === 'sm',
          'h-10 px-4': size === 'md',
          'h-12 px-6 text-lg': size === 'lg',
        },
        className
      )}
      {...props}
    />
  );
};
```

Создать аналогично:
- `Card.tsx` - карточки контента
- `Avatar.tsx` - аватары пользователей
- `Badge.tsx` - статусные бейджи

**2.2 Layout компоненты**

Файл: `src/frontend/src/components/app/layout/MainLayout.tsx`
```typescript
import React from 'react';
import { Sidebar } from '../sidebar/Sidebar';
import { Header } from './Header';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="h-screen flex bg-background text-foreground">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-hidden">
          {children}
        </main>
      </div>
    </div>
  );
};
```

Файл: `src/frontend/src/components/app/layout/Header.tsx`
```typescript
import React from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useAppStore } from '../../../stores/appStore';
import { MenuIcon, SettingsIcon, NotificationIcon } from '../../icons/Icons';

export const Header: React.FC = () => {
  const { user } = useAuth();
  const { toggleSidebar } = useAppStore();

  return (
    <header className="h-16 border-b border-border bg-background px-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <button onClick={toggleSidebar}>
          <MenuIcon size={20} className="text-muted-foreground hover:text-foreground" />
        </button>
        <h1 className="text-xl font-semibold text-primary">Nebula Chat</h1>
      </div>
      
      <div className="flex items-center gap-3">
        <button>
          <NotificationIcon size={20} className="text-muted-foreground hover:text-foreground" />
        </button>
        <button>
          <SettingsIcon size={20} className="text-muted-foreground hover:text-foreground" />
        </button>
        <div className="text-sm text-muted-foreground">
          {user?.username}
        </div>
      </div>
    </header>
  );
};
```

### ЭТАП 3: САЙДБАР (3-4ч)

**3.1 Основной сайдбар**

Файл: `src/frontend/src/components/app/sidebar/Sidebar.tsx`
```typescript
import React from 'react';
import { useAppStore } from '../../../stores/appStore';
import { cn } from '../../../lib/utils';
import { HomeIcon, GroupUsersIcon, AddIcon } from '../../icons/Icons';
import { UserStatusSection } from './UserStatusSection';

export const Sidebar: React.FC = () => {
  const { sidebarCollapsed } = useAppStore();

  return (
    <aside className={cn(
      'bg-secondary border-r border-border transition-all duration-300',
      sidebarCollapsed ? 'w-16' : 'w-64'
    )}>
      <UserStatusSection collapsed={sidebarCollapsed} />
      
      <nav className="p-2 space-y-1">
        <SidebarItem icon={HomeIcon} label="Главная" collapsed={sidebarCollapsed} active />
        <SidebarItem icon={GroupUsersIcon} label="Друзья" collapsed={sidebarCollapsed} />
        <SidebarItem icon={AddIcon} label="Добавить сервер" collapsed={sidebarCollapsed} />
      </nav>
    </aside>
  );
};

interface SidebarItemProps {
  icon: React.ComponentType<any>;
  label: string;
  collapsed: boolean;
  active?: boolean;
  onClick?: () => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ 
  icon: Icon, 
  label, 
  collapsed, 
  active = false,
  onClick 
}) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors',
        'hover:bg-accent hover:text-accent-foreground',
        active && 'bg-primary text-primary-foreground',
        collapsed && 'justify-center'
      )}
    >
      <Icon size={20} />
      {!collapsed && <span className="text-sm font-medium">{label}</span>}
    </button>
  );
};
```

**3.2 Секция пользователя**

Файл: `src/frontend/src/components/app/sidebar/UserStatusSection.tsx`
```typescript
import React from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { Avatar } from '../../ui/Avatar';
import { OnlineStatusIcon } from '../../icons/Icons';

interface UserStatusSectionProps {
  collapsed: boolean;
}

export const UserStatusSection: React.FC<UserStatusSectionProps> = ({ collapsed }) => {
  const { user } = useAuth();

  if (collapsed) {
    return (
      <div className="p-3 border-b border-border">
        <Avatar size="sm" />
      </div>
    );
  }

  return (
    <div className="p-4 border-b border-border">
      <div className="flex items-center gap-3">
        <Avatar size="md" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{user?.username}</p>
          <div className="flex items-center gap-1">
            <OnlineStatusIcon size={12} className="text-green-500" />
            <span className="text-xs text-muted-foreground">Онлайн</span>
          </div>
        </div>
      </div>
    </div>
  );
};
```

### ЭТАП 4: ГЛАВНАЯ ОБЛАСТЬ (3-4ч)

**4.1 Главная страница**

Файл: `src/frontend/src/pages/app/MainPage.tsx`
```typescript
import React from 'react';
import { MainLayout } from '../../components/app/layout/MainLayout';
import { WelcomeSection } from '../../components/app/common/WelcomeSection';
import { QuickActions } from '../../components/app/common/QuickActions';

const MainPage: React.FC = () => {
  return (
    <MainLayout>
      <div className="h-full overflow-y-auto">
        <div className="max-w-4xl mx-auto p-6 space-y-6">
          <WelcomeSection />
          <QuickActions />
        </div>
      </div>
    </MainLayout>
  );
};

export default MainPage;
```

**4.2 Секция приветствия**

Файл: `src/frontend/src/components/app/common/WelcomeSection.tsx`
```typescript
import React from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { Card } from '../../ui/Card';
import { SparklesIcon } from '../../icons/Icons';

export const WelcomeSection: React.FC = () => {
  const { user } = useAuth();

  return (
    <Card className="p-6">
      <div className="flex items-center gap-3 mb-4">
        <SparklesIcon size={24} className="text-primary" />
        <h2 className="text-2xl font-bold">
          Добро пожаловать, {user?.username}!
        </h2>
      </div>
      <p className="text-muted-foreground">
        Это ваша главная страница Nebula Chat. Здесь вы можете общаться с друзьями, 
        присоединяться к игровым серверам и управлять своим профилем.
      </p>
    </Card>
  );
};
```

**4.3 Быстрые действия**

Файл: `src/frontend/src/components/app/common/QuickActions.tsx`
```typescript
import React from 'react';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { AddFriendIcon, GroupUsersIcon, CallIcon, SettingsIcon } from '../../icons/Icons';

export const QuickActions: React.FC = () => {
  const actions = [
    { icon: AddFriendIcon, label: 'Добавить друга', action: () => {} },
    { icon: GroupUsersIcon, label: 'Создать группу', action: () => {} },
    { icon: CallIcon, label: 'Быстрый звонок', action: () => {} },
    { icon: SettingsIcon, label: 'Настройки', action: () => {} },
  ];

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Быстрые действия</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {actions.map((action, index) => (
          <Button
            key={index}
            variant="secondary"
            className="flex flex-col gap-2 h-auto py-4"
            onClick={action.action}
          >
            <action.icon size={24} />
            <span className="text-sm">{action.label}</span>
          </Button>
        ))}
      </div>
    </Card>
  );
};
```

### ЭТАП 5: ИНТЕГРАЦИЯ (2-3ч)

**5.1 Подключение к AuthContext**
В MainPage.tsx добавить проверки:
```typescript
const { user, isAuthenticated, isLoading } = useAuth();

if (isLoading) return <div>Загрузка...</div>;
if (!isAuthenticated || !user) return <Navigate to="/login" replace />;
```

**5.2 Тестирование**
- [ ] Переход после логина работает
- [ ] Сайдбар сворачивается/разворачивается
- [ ] Отображается информация о пользователе
- [ ] Кнопки кликабельны
- [ ] Мобильная версия работает

**5.3 Финальная проверка**
- [ ] Нет TypeScript ошибок
- [ ] Нет console.error
- [ ] Все файлы созданы по правилам
- [ ] Цветовая схема применена
- [ ] Используются только наши иконки

## КРИТЕРИИ ГОТОВНОСТИ

### После каждой задачи:
```
✅ Задача [номер]: [название]
📁 Созданные файлы: [список]
🔧 Изменения: [список]
⚠️ Проблемы: [если есть]
```

### После каждого этапа:
```
🎯 Этап [номер] завершен
✅ Выполнено: [X/X]
⏱️ Время: [X часов]
🐛 Проблемы: [список]
```

## ПРОГРЕСС

| Этап | Задач | Выполнено | Статус | Время |
|------|-------|-----------|---------|-------|
| 1. Инфраструктура | 3 | 3/3 | ✅ | 2-3ч |
| 2. UI Компоненты | 2 | 2/2 | ✅ | 4-5ч |
| 3. Сайдбар | 2 | 0/2 | ⏳ | 3-4ч |
| 4. Главная область | 3 | 0/3 | ⏳ | 3-4ч |
| 5. Интеграция | 3 | 0/3 | ⏳ | 2-3ч |
| **ИТОГО** | **13** | **5/13** | **🔄 В работе** | **14-19ч** |

## УСПЕХ ЭТАПА

1. ✅ Все задачи выполнены
2. ✅ Нет TypeScript ошибок
3. ✅ Страница `/app` загружается
4. ✅ Навигация работает
5. ✅ Мобильная версия корректна
6. ✅ Цветовая схема применена
7. ✅ Используются только наши иконки 