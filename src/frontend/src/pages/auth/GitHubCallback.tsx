import React, { useEffect } from 'react';

export default function GitHubCallback(): React.JSX.Element {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const error = urlParams.get('error');

    if (error) {
      console.error('GitHub OAuth error:', error);
      // Отправляем ошибку в родительское окно
      if (window.opener) {
        window.opener.postMessage({
          type: 'GITHUB_OAUTH_ERROR',
          error: error
        }, window.location.origin);
      }
      // Закрываем окно через небольшую задержку
      setTimeout(() => {
        window.close();
      }, 1000);
      return;
    }

    if (code) {
      // Отправляем код обратно в родительское окно
      if (window.opener) {
        window.opener.postMessage({
          type: 'GITHUB_OAUTH_SUCCESS',
          code: code
        }, window.location.origin);
        
        // Принудительно закрываем окно
        setTimeout(() => {
          window.close();
        }, 500);
      } else {
        // Если нет родительского окна, пытаемся закрыть через небольшую задержку
        setTimeout(() => {
          window.close();
        }, 1000);
      }
    }

    // Безопасность: закрываем окно через 5 секунд в любом случае
    const safetyTimeout = setTimeout(() => {
      window.close();
    }, 5000);

    return () => {
      clearTimeout(safetyTimeout);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#252525] flex items-center justify-center">
      <div className="text-white text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
        <p>Обработка GitHub авторизации...</p>
        <p className="text-sm text-gray-400 mt-2">Окно закроется автоматически</p>
      </div>
    </div>
  );
} 