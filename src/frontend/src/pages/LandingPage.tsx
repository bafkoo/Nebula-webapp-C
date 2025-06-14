import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logoImage from '../assets/auth/login/logos/logo (2).png';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    
    // Автоматическая смена активной фичи
    const interval = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % 3);
    }, 3000);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      clearInterval(interval);
    };
  }, []);

  const handleLogin = () => {
    navigate('/login');
  };

  const handleTryFree = () => {
    navigate('/register');
  };

  const handleLearnMore = () => {
    const element = document.getElementById('features');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  // Компонент частиц
  const Particles = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[...Array(50)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-gradient-to-r from-[#7177FF] to-[#F6B8FD] rounded-full opacity-30 animate-pulse"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${2 + Math.random() * 3}s`
          }}
        />
      ))}
    </div>
  );

  // Компонент плавающих элементов
  const FloatingElements = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-[#7177FF]/20 to-[#F6B8FD]/20 rounded-full blur-xl animate-bounce" style={{ animationDuration: '6s' }} />
      <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-[#F6B8FD]/20 to-[#9B87F5]/20 rounded-full blur-xl animate-bounce" style={{ animationDuration: '8s', animationDelay: '2s' }} />
      <div className="absolute bottom-40 left-1/4 w-40 h-40 bg-gradient-to-r from-[#9B87F5]/20 to-[#7177FF]/20 rounded-full blur-xl animate-bounce" style={{ animationDuration: '10s', animationDelay: '4s' }} />
    </div>
  );

  const features = [
    {
      title: "Мгновенные сообщения",
      description: "Отправляйте сообщения со скоростью света",
      icon: "💬",
      gradient: "from-[#7177FF] to-[#F6B8FD]"
    },
    {
      title: "HD видеозвонки",
      description: "Кристально чистое качество связи",
      icon: "📹",
      gradient: "from-[#F6B8FD] to-[#9B87F5]"
    },
    {
      title: "Безопасный обмен файлами",
      description: "Делитесь файлами без ограничений",
      icon: "🔒",
      gradient: "from-[#9B87F5] to-[#7177FF]"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#181818] to-[#0f0f0f] text-white overflow-x-hidden relative">
      {/* Курсор-следящий градиент */}
      <div 
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(113, 119, 255, 0.1), transparent 40%)`
        }}
      />

      <Particles />
      <FloatingElements />

      {/* Навигационная панель */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-8 py-6 flex justify-between items-center">
          {/* Логотип с анимацией */}
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="relative">
              <img 
                src={logoImage} 
                alt="Nebula Logo" 
                className="h-12 w-auto transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#7177FF] to-[#F6B8FD] rounded-full blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
            </div>
            <span className="text-3xl font-bold bg-gradient-to-r from-[#7177FF] to-[#F6B8FD] bg-clip-text text-transparent font-['gg_sans']">
              Nebula
            </span>
          </div>

          {/* Меню навигации с анимацией */}
          <div className="hidden md:flex items-center gap-12">
            {['Главная', 'Возможности', 'О нас', 'Контакты'].map((item, index) => (
              <a 
                key={item}
                href={`#${item.toLowerCase()}`} 
                className="relative text-white hover:text-[#7177FF] transition-all duration-300 font-medium text-lg group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-[#7177FF] to-[#F6B8FD] transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </div>

          {/* Кнопка входа с эффектом */}
          <button 
            onClick={handleLogin}
            className="relative border-2 border-transparent bg-gradient-to-r from-[#7177FF] to-[#F6B8FD] text-white px-8 py-3 rounded-xl font-semibold text-lg overflow-hidden group transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-[#7177FF]/50"
          >
            <span className="relative z-10">Войти</span>
            <div className="absolute inset-0 bg-gradient-to-r from-[#F6B8FD] to-[#7177FF] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </button>
        </div>
      </nav>

      {/* Hero секция с улучшенными анимациями */}
      <section id="home" className="pt-32 pb-20 px-8 text-center min-h-screen flex items-center relative">
        <div className="max-w-6xl mx-auto w-full relative z-10">
          {/* Анимированный заголовок */}
          <div className={`transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <h1 className="text-7xl md:text-8xl font-bold mb-8 leading-tight">
              <span className="bg-gradient-to-r from-[#7177FF] via-[#F6B8FD] to-[#9B87F5] bg-clip-text text-transparent animate-pulse">
                Общайтесь
              </span>
              <br />
              <span className="text-white">со скоростью</span>
              <br />
              <span className="bg-gradient-to-r from-[#F6B8FD] to-[#7177FF] bg-clip-text text-transparent">
                мысли
              </span>
            </h1>
          </div>

          {/* Подзаголовок с задержкой анимации */}
          <div className={`transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <p className="text-2xl text-[#ABABAB] mb-12 max-w-3xl mx-auto leading-relaxed">
              Революционная платформа для общения нового поколения. 
              <span className="text-[#7177FF]"> Быстро</span>, 
              <span className="text-[#F6B8FD]"> безопасно</span>, 
              <span className="text-[#9B87F5]"> удобно</span>.
            </p>
          </div>

          {/* Кнопки действий с анимацией */}
          <div className={`flex flex-col sm:flex-row gap-8 justify-center items-center transform transition-all duration-1000 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <button 
              onClick={handleTryFree}
              className="relative bg-gradient-to-r from-[#7177FF] to-[#9B87F5] text-white px-12 py-5 rounded-2xl font-bold text-xl hover:transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-[#7177FF]/60 transition-all duration-300 min-w-[250px] group overflow-hidden"
            >
              <span className="relative z-10">🚀 Попробовать бесплатно</span>
              <div className="absolute inset-0 bg-gradient-to-r from-[#9B87F5] to-[#F6B8FD] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>
            <button 
              onClick={handleLearnMore}
              className="relative border-2 border-white/30 text-white px-12 py-5 rounded-2xl font-bold text-xl hover:bg-white/10 hover:transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-white/30 transition-all duration-300 min-w-[250px] backdrop-blur-sm"
            >
              ✨ Узнать больше
            </button>
          </div>

          {/* Статистика с анимацией */}
          <div className={`mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 transform transition-all duration-1000 delay-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            {[
              { number: '10K+', label: 'Активных пользователей' },
              { number: '99.9%', label: 'Время работы' },
              { number: '24/7', label: 'Поддержка' }
            ].map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="text-4xl font-bold bg-gradient-to-r from-[#7177FF] to-[#F6B8FD] bg-clip-text text-transparent group-hover:scale-110 transition-transform duration-300">
                  {stat.number}
                </div>
                <div className="text-[#ABABAB] mt-2">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Интерактивная секция возможностей */}
      <section id="features" className="py-32 px-8 relative min-h-screen">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-6xl font-bold text-center mb-20 bg-gradient-to-r from-[#7177FF] to-[#F6B8FD] bg-clip-text text-transparent">
            Возможности Nebula
          </h2>
          
          {/* Интерактивные карточки возможностей */}
          <div className="grid md:grid-cols-3 gap-12 mb-20">
            {features.map((feature, index) => (
              <div 
                key={index}
                className={`relative p-8 rounded-3xl border transition-all duration-500 cursor-pointer group ${
                  activeFeature === index 
                    ? 'bg-gradient-to-br from-white/10 to-white/5 border-white/30 scale-105' 
                    : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                }`}
                onMouseEnter={() => setActiveFeature(index)}
              >
                <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4 text-white">{feature.title}</h3>
                <p className="text-[#ABABAB] text-lg leading-relaxed">{feature.description}</p>
                
                {/* Анимированная граница */}
                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-xl`} />
              </div>
            ))}
          </div>

          {/* Демо-интерфейс */}
          <div className="relative bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] rounded-3xl p-8 border border-white/10 overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#7177FF] via-[#F6B8FD] to-[#9B87F5]" />
            
            <div className="flex items-center gap-4 mb-8">
              <div className="flex gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full" />
                <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                <div className="w-3 h-3 bg-green-500 rounded-full" />
              </div>
              <span className="text-[#ABABAB] text-sm">Nebula Chat Interface</span>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="bg-[#7177FF]/20 p-4 rounded-2xl border-l-4 border-[#7177FF]">
                  <div className="text-sm text-[#7177FF] mb-1">Вы</div>
                  <div className="text-white">Привет! Как дела? 👋</div>
                </div>
                <div className="bg-[#F6B8FD]/20 p-4 rounded-2xl border-l-4 border-[#F6B8FD] ml-8">
                  <div className="text-sm text-[#F6B8FD] mb-1">Команда</div>
                  <div className="text-white">Отлично! Работаем над новым проектом 🚀</div>
                </div>
                <div className="bg-[#9B87F5]/20 p-4 rounded-2xl border-l-4 border-[#9B87F5]">
                  <div className="text-sm text-[#9B87F5] mb-1">Вы</div>
                  <div className="text-white">Звучит интересно! Расскажите подробнее</div>
                </div>
              </div>
              
              <div className="flex items-center justify-center">
                <div className="text-center">
                  <div className="w-32 h-32 bg-gradient-to-r from-[#7177FF] to-[#F6B8FD] rounded-full flex items-center justify-center mb-4 animate-pulse">
                    <span className="text-4xl">🎯</span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Интуитивный интерфейс</h3>
                  <p className="text-[#ABABAB]">Простой и понятный дизайн</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Секция "О нас" с улучшенным дизайном */}
      <section id="about-section" className="py-32 px-8 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-6xl font-bold mb-8 bg-gradient-to-r from-[#F6B8FD] to-[#7177FF] bg-clip-text text-transparent">
              Почему выбирают Nebula?
            </h2>
            <p className="text-2xl text-[#ABABAB] max-w-3xl mx-auto">
              Мы создали платформу, которая объединяет лучшие технологии для идеального общения
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-20">
            {[
              {
                icon: '🛡️',
                title: 'Максимальная безопасность',
                description: 'Сквозное шифрование E2E и защита данных на уровне банков. Ваши разговоры остаются приватными.',
                gradient: 'from-[#7177FF] to-[#F6B8FD]'
              },
              {
                icon: '⚡',
                title: 'Невероятная скорость',
                description: 'Мгновенная доставка сообщений и файлов любого размера. Никаких задержек и ограничений.',
                gradient: 'from-[#F6B8FD] to-[#9B87F5]'
              },
              {
                icon: '👥',
                title: 'Идеально для команд',
                description: 'Каналы, роли, интеграции и все необходимое для эффективной работы в команде.',
                gradient: 'from-[#9B87F5] to-[#7177FF]'
              }
            ].map((item, index) => (
              <div key={index} className="group">
                <div className="relative p-8 bg-gradient-to-br from-white/5 to-white/10 rounded-3xl border border-white/10 hover:border-white/30 transition-all duration-500 hover:transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-white/10">
                  <div className="text-6xl mb-6 group-hover:scale-110 transition-transform duration-300">
                    {item.icon}
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-white">{item.title}</h3>
                  <p className="text-[#ABABAB] leading-relaxed">{item.description}</p>
                  
                  {/* Градиентная подсветка */}
                  <div className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${item.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300 blur-xl`} />
                </div>
              </div>
            ))}
          </div>

          {/* CTA секция */}
          <div className="relative bg-gradient-to-r from-[#7177FF]/20 via-[#F6B8FD]/20 to-[#9B87F5]/20 rounded-3xl p-12 text-center border border-white/20 backdrop-blur-sm overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-[#7177FF]/10 to-[#F6B8FD]/10 animate-pulse" />
            
            <div className="relative z-10">
              <h3 className="text-4xl font-bold mb-6 bg-gradient-to-r from-[#7177FF] to-[#F6B8FD] bg-clip-text text-transparent">
                Готовы присоединиться к будущему общения?
              </h3>
              <p className="text-xl text-[#ABABAB] mb-8 max-w-2xl mx-auto">
                Более 10,000 команд уже используют Nebula для эффективного общения. 
                Присоединяйтесь к ним сегодня!
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <button 
                  onClick={handleTryFree}
                  className="bg-gradient-to-r from-[#7177FF] to-[#9B87F5] text-white px-10 py-4 rounded-2xl font-bold text-lg hover:transform hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#7177FF]/50 transition-all duration-300 min-w-[200px]"
                >
                  🚀 Начать бесплатно
                </button>
                <button className="border-2 border-white/30 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-white/10 hover:transform hover:-translate-y-1 transition-all duration-300 min-w-[200px]">
                  📞 Связаться с нами
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Футер */}
      <footer className="py-16 px-8 border-t border-white/10 bg-black/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 mb-8">
            <img src={logoImage} alt="Nebula Logo" className="h-10 w-auto" />
            <span className="text-2xl font-bold bg-gradient-to-r from-[#7177FF] to-[#F6B8FD] bg-clip-text text-transparent">
              Nebula
            </span>
          </div>
          
          <p className="text-[#ABABAB] mb-8">
            © 2024 Nebula. Все права защищены. Создано с ❤️ для лучшего общения.
          </p>
          
          <div className="flex justify-center gap-8">
            {['Политика конфиденциальности', 'Условия использования', 'Поддержка'].map((link) => (
              <a key={link} href="#" className="text-[#ABABAB] hover:text-white transition-colors duration-300">
                {link}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage; 