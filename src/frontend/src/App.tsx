import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import './App.css'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'

function App() {
  const [isAuthenticated] = useState(false)

  // Если пользователь не авторизован, показываем auth роуты
  if (!isAuthenticated) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    )
  }

  // Если авторизован, показываем основное приложение
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/app" element={<MainApplication />} />
        <Route path="*" element={<Navigate to="/app" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

// Основное приложение (Discord-интерфейс)
function MainApplication() {
  return (
    <div className="h-screen w-screen bg-gray-800 flex overflow-hidden">
      {/* Server List */}
      <div className="w-16 bg-gray-900 flex flex-col items-center py-3 space-y-2">
        <div className="w-12 h-12 bg-discord-blurple rounded-2xl flex items-center justify-center hover:rounded-xl transition-all duration-200 cursor-pointer">
          <span className="text-white font-bold">🌌</span>
        </div>
        
        <div className="w-8 h-0.5 bg-gray-600 rounded"></div>
        
        {/* Mock servers */}
        {[1, 2, 3].map((i) => (
          <div key={i} className="w-12 h-12 bg-gray-700 rounded-full hover:rounded-xl transition-all duration-200 cursor-pointer flex items-center justify-center">
            <span className="text-gray-300 font-bold">{i}</span>
          </div>
        ))}
        
        <div className="w-12 h-12 bg-gray-700 rounded-full hover:rounded-xl hover:bg-discord-green transition-all duration-200 cursor-pointer flex items-center justify-center">
          <span className="text-gray-300 text-xl">+</span>
        </div>
      </div>

      {/* Channel List */}
      <div className="w-60 bg-gray-700 flex flex-col">
        <div className="h-12 bg-gray-800 flex items-center px-4 shadow-md">
          <h2 className="text-white font-semibold">Мой Сервер</h2>
        </div>
        
        <div className="flex-1 p-3">
          <div className="mb-4">
            <div className="flex items-center text-gray-400 text-xs uppercase tracking-wide font-semibold mb-2">
              <span>📝 Текстовые каналы</span>
            </div>
            
            {['общий', 'случайное', 'разработка'].map((channel) => (
              <div key={channel} className="flex items-center px-2 py-1 rounded hover:bg-gray-600 cursor-pointer group">
                <span className="text-gray-500 mr-2">#</span>
                <span className="text-gray-300 group-hover:text-white">{channel}</span>
              </div>
            ))}
          </div>
          
          <div className="mb-4">
            <div className="flex items-center text-gray-400 text-xs uppercase tracking-wide font-semibold mb-2">
              <span>🔊 Голосовые каналы</span>
            </div>
            
            {['Общий', 'Gaming'].map((channel) => (
              <div key={channel} className="flex items-center px-2 py-1 rounded hover:bg-gray-600 cursor-pointer group">
                <span className="text-gray-500 mr-2">🔊</span>
                <span className="text-gray-300 group-hover:text-white">{channel}</span>
              </div>
            ))}
          </div>
        </div>

        {/* User info */}
        <div className="h-14 bg-gray-800 flex items-center px-2">
          <div className="flex items-center flex-1">
            <div className="w-8 h-8 bg-discord-blurple rounded-full flex items-center justify-center mr-2">
              <span className="text-white text-sm font-bold">U</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-white text-sm font-medium truncate">Пользователь</div>
              <div className="text-gray-400 text-xs">В сети</div>
            </div>
          </div>
          <div className="flex space-x-1">
            <button className="w-8 h-8 text-gray-400 hover:text-white hover:bg-gray-600 rounded flex items-center justify-center">
              🎤
            </button>
            <button className="w-8 h-8 text-gray-400 hover:text-white hover:bg-gray-600 rounded flex items-center justify-center">
              🎧
            </button>
            <button className="w-8 h-8 text-gray-400 hover:text-white hover:bg-gray-600 rounded flex items-center justify-center">
              ⚙️
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Channel header */}
        <div className="h-12 bg-gray-600 flex items-center px-4 shadow-sm">
          <span className="text-gray-400 mr-2">#</span>
          <span className="text-white font-semibold">общий</span>
          <div className="ml-4 text-gray-400 text-sm">Общий канал для обсуждений</div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Mock messages */}
          {[
            { user: 'NebulaBot', content: '🌌 Добро пожаловать в NebulaChat! Это ваш первый канал.', time: '12:00' },
            { user: 'Разработчик', content: 'Привет! Проект выглядит отлично 🚀', time: '12:01' },
            { user: 'Тестер', content: 'Все работает как надо! Discord-like интерфейс получился очень крутым', time: '12:02' }
          ].map((msg, i) => (
            <div key={i} className="flex items-start space-x-3 group hover:bg-gray-700/30 p-2 rounded">
              <div className="w-10 h-10 bg-discord-blurple rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold">{msg.user[0]}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline space-x-2 mb-1">
                  <span className="text-white font-medium">{msg.user}</span>
                  <span className="text-gray-400 text-xs">{msg.time}</span>
                </div>
                <div className="text-gray-300">{msg.content}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="p-4">
          <div className="bg-gray-600 rounded-lg px-4 py-3">
            <input
              type="text"
              placeholder="Напишите сообщение в #общий"
              className="w-full bg-transparent text-white placeholder-gray-400 outline-none"
            />
          </div>
        </div>
      </div>

      {/* Member List */}
      <div className="w-60 bg-gray-700 p-3">
        <div className="mb-4">
          <div className="text-gray-400 text-xs uppercase tracking-wide font-semibold mb-2">
            В сети — 3
          </div>
          
          {['Разработчик', 'Тестер', 'Пользователь'].map((user) => (
            <div key={user} className="flex items-center p-2 rounded hover:bg-gray-600 cursor-pointer">
              <div className="w-8 h-8 bg-discord-green rounded-full flex items-center justify-center mr-3 relative">
                <span className="text-white text-sm font-bold">{user[0]}</span>
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-discord-green rounded-full border-2 border-gray-700"></div>
              </div>
              <span className="text-gray-300">{user}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default App
