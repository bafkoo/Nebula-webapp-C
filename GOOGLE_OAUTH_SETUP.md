# Настройка Google OAuth для Nebula

## Обзор

Google OAuth интегрирован в ваши существующие кнопки Google на страницах входа и регистрации. При нажатии на кнопку Google пользователи могут войти или зарегистрироваться через свой Google аккаунт.

## Настройка Google Cloud Console

1. Перейдите в [Google Cloud Console](https://console.cloud.google.com/)
2. Создайте новый проект или выберите существующий
3. Включите Google+ API:
   - Перейдите в "APIs & Services" > "Library"
   - Найдите "Google+ API" и включите его
4. Создайте OAuth 2.0 credentials:
   - Перейдите в "APIs & Services" > "Credentials"
   - Нажмите "Create Credentials" > "OAuth 2.0 Client IDs"
   - Выберите "Web application"
   - Добавьте authorized origins:
     - `http://localhost:3000` (для разработки)
     - `https://yourdomain.com` (для продакшена)
   - Добавьте authorized redirect URIs:
     - `http://localhost:3000` (для разработки)
     - `https://yourdomain.com` (для продакшена)

## Конфигурация Backend

Обновите `src/backend/NebulaChat.API/appsettings.json`:

```json
{
  "Google": {
    "ClientId": "your-actual-google-client-id.apps.googleusercontent.com",
    "ClientSecret": "your-actual-google-client-secret"
  }
}
```

## Конфигурация Frontend

Создайте файл `src/frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:5000
VITE_GOOGLE_CLIENT_ID=your-actual-google-client-id.apps.googleusercontent.com
```

## Как это работает

1. **Пользователь нажимает кнопку Google** на странице входа или регистрации
2. **Открывается Google OAuth popup** для аутентификации
3. **Google возвращает access token** с информацией о пользователе
4. **Frontend отправляет данные на backend** в виде base64-кодированного JSON
5. **Backend проверяет данные** и создает/обновляет пользователя
6. **Возвращается JWT токен** для дальнейшей аутентификации

## Функции

- ✅ **Автоматическая регистрация**: Новые пользователи создаются автоматически
- ✅ **Связывание аккаунтов**: Существующие пользователи связываются с Google ID
- ✅ **Верификация email**: Email автоматически верифицируется если он верифицирован в Google
- ✅ **Обновление аватара**: Аватар пользователя обновляется из Google профиля
- ✅ **Генерация username**: Username генерируется из email если пользователь новый

## Безопасность

- Используется официальная библиотека `@react-oauth/google`
- Токены проверяются на backend
- JWT токены используются для сессий
- Google Client Secret хранится только на backend

## Тестирование

1. Запустите backend: `dotnet run` в `src/backend/NebulaChat.API`
2. Запустите frontend: `npm run dev` в `src/frontend`
3. Откройте `http://localhost:3000/login`
4. Нажмите на кнопку Google
5. Войдите через Google аккаунт
6. Проверьте что вы перенаправлены в приложение

## Troubleshooting

### "Google Client ID не настроен"
- Проверьте что `VITE_GOOGLE_CLIENT_ID` установлен в `.env`
- Проверьте что `Google:ClientId` установлен в `appsettings.json`

### "Неверный Google токен"
- Проверьте что домен добавлен в authorized origins в Google Console
- Проверьте что Client ID корректный

### Пользователь не создается
- Проверьте логи backend в консоли
- Убедитесь что база данных доступна
- Проверьте что миграции применены: `dotnet ef database update` 