import { CheckIcon, EyeIcon, EyeOffIcon } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from '@react-oauth/google';
import { useTranslation } from 'react-i18next';
import { useAuth } from "../../contexts/AuthContext";
import FullScreenPremiumLoader from "../../components/ui/FullScreenPremiumLoader";
import gradientMainBg from "../../assets/auth/login/backgrounds/gradient-main.webp";
import logoImage from "../../assets/auth/login/logos/logo (2).png";

export default function LoginPage(): React.JSX.Element {
  const { t } = useTranslation();
  // Состояние формы
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: true
  });
  
  // Состояние для показа/скрытия пароля
  const [showPassword, setShowPassword] = useState(false);
  
  // Состояние загрузки
  const [isLoading, setIsLoading] = useState(false);
  const [isGitHubLoading, setIsGitHubLoading] = useState(false);
  const [showFullScreenLoader, setShowFullScreenLoader] = useState(false);
  const [loaderMessage, setLoaderMessage] = useState('');

  // Состояния фокуса для полей
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // Состояние для анимаций
  const [isVisible, setIsVisible] = useState(false);

  // Навигация и Auth
  const navigate = useNavigate();
  const { login, googleAuth, gitHubAuth } = useAuth();

  // Google OAuth login
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setShowFullScreenLoader(true);
        setLoaderMessage(t('auth.login.googleAuth'));
        
        // Получаем информацию о пользователе через Google API
        const userInfoResponse = await fetch(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${tokenResponse.access_token}`);
        const userInfo = await userInfoResponse.json();
        
        setLoaderMessage(t('auth.login.processingAuth'));
        
        // Создаем простой ID токен из полученных данных
        const tokenData = {
          sub: userInfo.id,
          email: userInfo.email,
          name: userInfo.name,
          picture: userInfo.picture,
          email_verified: userInfo.verified_email
        };
        
        // Безопасное кодирование в base64 с поддержкой UTF-8
        const idToken = btoa(unescape(encodeURIComponent(JSON.stringify(tokenData))));
        
        await googleAuth(idToken);
        
        setLoaderMessage(t('auth.login.redirecting'));
        setTimeout(() => {
          navigate('/app');
        }, 500);
      } catch (error) {
        console.error('Google OAuth error:', error);
        setShowFullScreenLoader(false);
      }
    },
    onError: (error) => {
      console.error('Google OAuth error:', error);
      setShowFullScreenLoader(false);
    },
  });

  // GitHub OAuth login
  const gitHubLogin = async () => {
    setIsGitHubLoading(true);
    
    const clientId = 'Ov23limLdWeZyzmGnsbm';
    const redirectUri = `${window.location.origin}/auth/github/callback`;
    const scope = 'user:email';
    
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${scope}`;
    
    // Открываем GitHub OAuth в новом окне
    const popup = window.open(githubAuthUrl, 'github-oauth', 'width=600,height=700');
    
    // Слушаем сообщения от popup окна
    const handleMessage = async (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      
      if (event.data.type === 'GITHUB_OAUTH_SUCCESS') {
        const { code } = event.data;
        
        try {
          setShowFullScreenLoader(true);
          setLoaderMessage(t('auth.login.githubAuth'));
          
          // Обмениваем код на access token через наш backend
          const response = await fetch('http://localhost:5000/api/auth/github/exchange', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code }),
          });
          
          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
          }
          
          setLoaderMessage(t('auth.login.processingAuth'));
          
          const { access_token } = await response.json();
          
          // Используем access token для аутентификации
          await gitHubAuth(access_token);
          
          setLoaderMessage(t('auth.login.redirecting'));
          setTimeout(() => {
            navigate('/app');
            popup?.close();
          }, 500);
        } catch (error) {
          console.error('GitHub OAuth error:', error);
          setShowFullScreenLoader(false);
        } finally {
          setIsGitHubLoading(false);
        }
      } else if (event.data.type === 'GITHUB_OAUTH_ERROR') {
        console.error('GitHub OAuth error:', event.data.error);
        setIsLoading(false);
        setIsGitHubLoading(false);
        popup?.close();
      }
    };
    
    window.addEventListener('message', handleMessage);
    
    // Очищаем слушатель при закрытии popup
    const checkClosed = setInterval(() => {
      if (popup?.closed) {
        window.removeEventListener('message', handleMessage);
        clearInterval(checkClosed);
        setIsLoading(false); // Сбрасываем состояние загрузки если popup закрыт
        setIsGitHubLoading(false);
      }
    }, 1000);
    
    // Принудительно закрываем popup через 2 минуты (безопасность)
    const forceCloseTimeout = setTimeout(() => {
      if (popup && !popup.closed) {
        popup.close();
        window.removeEventListener('message', handleMessage);
        clearInterval(checkClosed);
        setIsLoading(false);
        setIsGitHubLoading(false);
      }
    }, 120000); // 2 минуты
    
    // Очистка при размонтировании компонента
    return () => {
      window.removeEventListener('message', handleMessage);
      clearInterval(checkClosed);
      clearTimeout(forceCloseTimeout);
    };
  };

  // Анимация появления
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  // CSS стили для автозаполнения
  const autofillStyles = `
    input:-webkit-autofill,
    input:-webkit-autofill:hover,
    input:-webkit-autofill:focus,
    input:-webkit-autofill:active,
    input[autocomplete="email"]:-webkit-autofill,
    input[type="email"]:-webkit-autofill {
      -webkit-box-shadow: 0 0 0 1000px transparent inset !important;
      -webkit-text-fill-color: #ffffff !important;
      background-color: transparent !important;
      background-image: none !important;
      color: #ffffff !important;
      font-family: 'Helvetica', sans-serif !important;
      font-weight: 700 !important;
      font-size: 22px !important;
      padding: 6px 0 !important;
      margin: 0 !important;
      left: 18px !important;
      top: 22px !important;
      right: 18px !important;
      bottom: 18px !important;
      line-height: normal !important;
      vertical-align: middle !important;
      transition: background-color 5000s ease-in-out 0s !important;
      -webkit-transition: background-color 5000s ease-in-out 0s !important;
    }
    
    input[type="password"]:-webkit-autofill,
    input[type="password"]:-webkit-autofill:hover,
    input[type="password"]:-webkit-autofill:focus,
    input[type="password"]:-webkit-autofill:active,
    input[autocomplete="current-password"]:-webkit-autofill {
      -webkit-box-shadow: 0 0 0 1000px transparent inset !important;
      -webkit-text-fill-color: #ABABAB !important;
      background-color: transparent !important;
      background-image: none !important;
      color: #ABABAB !important;
      font-family: 'Helvetica', sans-serif !important;
      font-weight: 400 !important;
      font-size: 18px !important;
      padding: 0px 0 !important;
      margin: 0 !important;
      left: 18px !important;
      top: 15px !important;
      width: calc(100% - 78px) !important;
      height: 28px !important;
      line-height: normal !important;
      vertical-align: middle !important;
      transition: background-color 5000s ease-in-out 0s !important;
      -webkit-transition: background-color 5000s ease-in-out 0s !important;
    }

    /* Анимации для кнопок */
    .social-button {
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      transform: translateY(0);
    }
    
    .social-button:hover {
      transform: translateY(-2px) scale(1.02);
      box-shadow: 0 8px 25px rgba(113, 119, 255, 0.3);
      border-color: #7177FF;
    }
    
    .social-button:active {
      transform: translateY(0) scale(0.98);
    }

    /* Анимация загрузки */
    .loading-dots {
      display: inline-flex;
      gap: 4px;
    }
    
    .loading-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background-color: white;
      animation: loadingBounce 1.4s infinite both;
    }
    
    .loading-dot:nth-child(1) { animation-delay: -0.32s; }
    .loading-dot:nth-child(2) { animation-delay: -0.16s; }
    .loading-dot:nth-child(3) { animation-delay: 0s; }
    
    @keyframes loadingBounce {
      0%, 80%, 100% {
        transform: scale(0.7);
        opacity: 0.7;
      }
      40% {
        transform: scale(1);
        opacity: 1;
      }
    }

    /* Плавающие частицы */
    .floating-particle {
      position: absolute;
      border-radius: 50%;
      pointer-events: none;
      opacity: 0.1;
      animation: float linear infinite;
    }
    
    @keyframes float {
      0% {
        transform: translateY(100vh) rotate(0deg);
        opacity: 0;
      }
      10% {
        opacity: 0.1;
      }
      90% {
        opacity: 0.1;
      }
      100% {
        transform: translateY(-100px) rotate(360deg);
        opacity: 0;
      }
    }

    /* Анимация появления формы */
    .form-container {
      opacity: ${isVisible ? 1 : 0};
      transform: ${isVisible ? 'translateY(0)' : 'translateY(40px)'};
      transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .logo-container {
      opacity: ${isVisible ? 1 : 0};
      transform: ${isVisible ? 'translateY(0)' : 'translateY(-20px)'};
      transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.2s;
    }

    /* Простой hover эффект для кнопки глаза */
    .eye-hover {
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .eye-hover:hover {
      background: rgba(113, 119, 255, 0.1);
      border-radius: 6px;
      padding: 4px;
    }
    
    .eye-hover:hover .eye-icon {
      color: #7177FF !important;
    }

    /* Hover эффект для кнопки логина */
    .login-button {
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;
    }
    
    .login-button::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(90deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.1) 100%);
      opacity: 0;
      transition: opacity 0.3s ease;
      pointer-events: none;
    }
    
    .login-button:hover::before {
      opacity: 1;
    }
    
    .login-button:hover {
      transform: translateY(-1px);
      box-shadow: 0 8px 25px rgba(246, 184, 253, 0.4), 0 4px 12px rgba(49, 106, 215, 0.3);
    }
    
    .login-button:active {
      transform: translateY(0);
      box-shadow: 0 4px 15px rgba(246, 184, 253, 0.3), 0 2px 8px rgba(49, 106, 215, 0.2);
    }
  `;

  // Обработчики событий
  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowFullScreenLoader(true);
    setLoaderMessage(t('auth.login.loggingIn'));
    
    try {
      console.log('🔐 Начинаем вход...');
      // Используем функцию login из AuthContext
      await login(formData.email, formData.password);
      
      setLoaderMessage(t('auth.login.redirecting'));
      console.log('✅ Перенаправляем в приложение');
      // После успешного входа перенаправляем в приложение
      setTimeout(() => {
        navigate('/app');
      }, 500);
    } catch (error) {
      console.error('❌ Ошибка входа:', error);
      setShowFullScreenLoader(false);
      // В будущем здесь можно добавить отображение ошибок пользователю
    }
  };

  const handleSocialLogin = (provider: string) => {
    if (provider === 'Google') {
      googleLogin();
    } else if (provider === 'GitHub') {
      gitHubLogin();
    } else {
      console.log(`Вход через ${provider}`);
      // Здесь будет логика для других провайдеров
    }
  };

  const handleForgotPassword = () => {
    navigate('/reset-password');
  };

  return (
    <div className="relative min-h-screen w-full bg-[#252525] overflow-hidden">
      {/* CSS стили для автозаполнения */}
      <style dangerouslySetInnerHTML={{ __html: autofillStyles }} />
      
      {/* Плавающие частицы */}
      {Array.from({ length: 8 }, (_, i) => (
        <div
          key={i}
          className="floating-particle"
          style={{
            left: `${Math.random() * 100}%`,
            width: `${Math.random() * 6 + 4}px`,
            height: `${Math.random() * 6 + 4}px`,
            background: `linear-gradient(45deg, #7177FF, #F6B8FD)`,
            animationDuration: `${Math.random() * 10 + 15}s`,
            animationDelay: `${Math.random() * 5}s`
          }}
        />
      ))}
      
      {/* Background with texture overlay */}
      <div 
        className="absolute inset-0 w-full h-full"
        style={{ 
          background: `linear-gradient(0deg, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)), url(${gradientMainBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          zIndex: 1
        }}
      />

      {/* Logo - с анимацией появления */}
      <div 
        className="absolute left-20 top-10 z-50 logo-container"
        style={{
          transform: 'scale(0.8)',
          transformOrigin: 'left top'
        }}
      >
        <div className="flex items-center gap-4">
          <img 
            src={logoImage}
            alt="Logo"
            className="h-12 sm:h-16 lg:h-20 w-auto object-contain"
          />
          <span 
            className="text-white text-2xl sm:text-3xl lg:text-4xl font-bold"
            style={{
              fontFamily: "'gg sans', 'Whitney', 'Helvetica Neue', Helvetica, Arial, sans-serif",
              fontWeight: 600,
              letterSpacing: '-0.02em'
            }}
          >
            Nebula
          </span>
        </div>
      </div>

      {/* Main Form Container - с анимацией появления */}
      <div className="min-h-screen flex items-center justify-center px-4 py-8 lg:px-8 relative z-40 form-container">
        <div className="w-full max-w-[320px] sm:max-w-[400px] md:max-w-[480px] lg:max-w-[548px] mx-auto">
          
          {/* Header Section */}
          <div className="text-center mb-14 w-full max-w-[548px] mx-auto">
            <h1 className="text-white text-4xl font-bold mb-6 relative z-50">
              {t('auth.login.title')}
            </h1>
            <p className="text-[#ABABAB] text-xl relative z-50">
              {t('auth.login.subtitle')}
            </p>
          </div>

          {/* Form Container */}
          <form onSubmit={handleSubmit} className="space-y-8 sm:space-y-12 lg:space-y-[60px]">
            
            {/* Input Fields */}
            <div className="space-y-6 lg:space-y-[56px]">
              <div className="space-y-4 lg:space-y-[24px]">
                
                {/* Email Input - точный Subtract эффект */}
                <div className="relative h-14 sm:h-16 lg:h-[66px]">
                  {/* Main Border Container */}
                  <div 
                    className="absolute inset-0 top-1.5 lg:top-[6px] border rounded bg-transparent transition-colors duration-200"
                    style={{
                      borderWidth: '1px',
                      borderColor: focusedField === 'email' ? '#7177FF' : '#ABABAB'
                    }}
                  />
                  
                  {/* Subtract Effect - Label Background Cut */}
                  <div 
                    className="absolute flex items-center justify-center"
                    style={{
                      width: '60px',
                      height: '22px',
                      left: '12px',
                      top: '-5px',
                      background: '#252525',
                      borderRadius: '4px',
                      zIndex: 1
                    }}
                  >
                    {/* Label */}
                    <label 
                      className="text-[14px] font-normal transition-colors duration-200"
                      style={{ 
                        fontFamily: 'Helvetica, sans-serif',
                        fontWeight: 400,
                        color: focusedField === 'email' ? '#7177FF' : '#ABABAB'
                      }}>
                      {t('auth.login.emailLabel')}
                    </label>
                  </div>
                  
                  {/* Email Value */}
                  {/* <div 
                    className="absolute left-4 sm:left-4 lg:left-[18px] top-5 sm:top-6 lg:top-[28px] text-white text-base sm:text-lg md:text-xl lg:text-[22px] font-bold z-10"
                    style={{ 
                      fontFamily: 'Helvetica, sans-serif',
                      fontWeight: 700
                    }}>
                    muffinworks@gmail.com
                  </div> */}

                  {/* Интерактивное поле email */}
                  <input
                    type="email"
                    className="absolute bg-transparent text-white font-bold border-none outline-none text-left z-20"
                    style={{ 
                      fontFamily: 'Helvetica, sans-serif',
                      fontWeight: 700,
                      fontSize: '22px',
                      left: '18px',
                      top: '22px',
                      right: '18px',
                      bottom: '18px',
                      background: 'transparent !important',
                      WebkitBoxShadow: '0 0 0 1000px transparent inset !important',
                      WebkitTextFillColor: '#ffffff !important',
                      caretColor: '#ffffff',
                      boxShadow: '0 0 0 1000px transparent inset !important'
                    }}
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    autoComplete="email"
                  />
                </div>

                {/* Password Section */}
                <div className="relative h-20 sm:h-24 lg:h-[108px]">
                  {/* Password Input Border */}
                  <div 
                    className="absolute w-full h-12 sm:h-14 lg:h-[60px] left-0 top-0 border rounded bg-transparent transition-colors duration-200"
                    style={{
                      borderWidth: '1px',
                      borderColor: focusedField === 'password' ? '#7177FF' : '#ABABAB'
                    }}
                  />
                  
                  {/* Password Input */}
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder={t('auth.login.passwordLabel')}
                    className="absolute bg-transparent font-normal border-none outline-none text-left z-20 transition-colors duration-200"
                    style={{ 
                      fontFamily: 'Helvetica, sans-serif',
                      fontWeight: 400,
                      fontSize: '18px',
                      left: '18px',
                      top: '18px',
                      width: 'calc(100% - 78px)',
                      height: '24px',
                      background: 'transparent !important',
                      WebkitBoxShadow: '0 0 0 1000px transparent inset !important',
                      WebkitTextFillColor: focusedField === 'password' ? '#FFFFFF !important' : '#ABABAB !important',
                      caretColor: focusedField === 'password' ? '#7177FF' : '#ABABAB',
                      color: focusedField === 'password' ? '#FFFFFF !important' : '#ABABAB !important',
                      boxShadow: '0 0 0 1000px transparent inset !important'
                    }}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    autoComplete="current-password"
                  />
                  
                  {/* Eye Icon */}
                  <button 
                    className="absolute w-6 h-6 sm:w-7 sm:h-7 lg:w-[28px] lg:h-[28px] right-3 sm:right-4 lg:right-[16px] top-3 sm:top-4 lg:top-[16px] rounded eye-hover"
                    onClick={() => setShowPassword(!showPassword)}
                    type="button"
                  >
                    {showPassword ? <EyeIcon className="eye-icon w-4 h-4 sm:w-5 sm:h-5 lg:w-[21px] lg:h-[18px] text-[#ABABAB]" /> : <EyeOffIcon className="eye-icon w-4 h-4 sm:w-5 sm:h-5 lg:w-[21px] lg:h-[18px] text-[#ABABAB]" />}
                  </button>

                  {/* Remember me section */}
                  <div className="absolute w-full left-0 bottom-0 lg:top-[84px] flex items-center justify-between text-xs sm:text-sm lg:text-[18px]">
                    <div className="flex items-center gap-2 sm:gap-3">
                      {/* Custom Checkbox */}
                      <div 
                        className="flex items-center justify-center rounded border-0 cursor-pointer"
                        style={{
                          width: '24px',
                          height: '24px',
                          background: formData.rememberMe ? '#7177FF' : 'transparent',
                          border: formData.rememberMe ? 'none' : '2px solid #4D4D4D',
                          borderRadius: '4px'
                        }}
                        onClick={() => handleInputChange('rememberMe', !formData.rememberMe)}
                      >
                        {formData.rememberMe && (
                          <CheckIcon 
                            className="text-white"
                            style={{
                              width: '18px',
                              height: '18px'
                            }}
                          />
                        )}
                      </div>
                      <label 
                        className="text-[#ABABAB] font-normal cursor-pointer" 
                        style={{ 
                          fontFamily: 'Helvetica, sans-serif',
                          fontWeight: 400,
                          fontSize: '18px'
                        }}
                        onClick={() => handleInputChange('rememberMe', !formData.rememberMe)}
                      >
                        {t('auth.login.rememberMe')}
                      </label>
                    </div>
                    <button 
                      type="button"
                      className="text-[#ABABAB] font-normal hover:text-gray-300 transition-colors text-right"
                      style={{ 
                        fontFamily: 'Helvetica, sans-serif',
                        fontWeight: 400,
                        fontSize: '18px',
                        textDecoration: 'underline'
                      }}
                      onClick={handleForgotPassword}
                    >
                      {t('auth.login.forgotPassword')}
                    </button>
                  </div>
                </div>
              </div>

              {/* Login Button - точный градиент */}
              <button 
                type="submit"
                className="w-full h-12 sm:h-14 lg:h-[60px] text-white font-bold text-base sm:text-lg md:text-xl lg:text-[24px] rounded transition-all duration-300 hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed login-button"
                style={{
                  background: isLoading 
                    ? 'linear-gradient(90.67deg, #A8A8A8 -7.12%, #6B6B6B 114.37%)'
                    : 'linear-gradient(90.67deg, #F6B8FD -7.12%, #316AD7 114.37%)',
                  fontFamily: 'Helvetica, sans-serif',
                  fontWeight: 700,
                  fontSize: '24px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: isLoading ? 'not-allowed' : 'pointer'
                }}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <span>{t('auth.login.loggingIn')}</span>
                    <div className="loading-dots">
                      <div className="loading-dot"></div>
                      <div className="loading-dot"></div>
                      <div className="loading-dot"></div>
                    </div>
                  </div>
                ) : (
                  t('auth.login.loginButton')
                )}
              </button>
            </div>

            {/* Separator - точный дизайн */}
            <div className="relative py-4">
              <hr 
                className="border-0 h-px w-full"
                style={{
                  backgroundColor: '#4D4D4D',
                  height: '1px'
                }}
              />
              <div 
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 px-2 sm:px-3 py-1 rounded"
                style={{
                  backgroundColor: '#252525'
                }}
              >
                <span 
                  className="text-[#ABABAB] text-sm sm:text-base lg:text-[18px] font-normal"
                  style={{ 
                    fontFamily: 'Helvetica, sans-serif',
                    fontWeight: 400
                  }}>
                  {t('common.or')}
                </span>
              </div>
            </div>

            {/* Social Buttons - точные размеры */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 lg:gap-[12px] w-full">
              {/* Google Button */}
              <button
                type="button"
                className="social-button flex flex-row justify-center items-center h-12 sm:h-14 lg:h-[60px] border bg-transparent rounded p-2 sm:p-3"
                style={{ 
                  borderWidth: '1px',
                  borderColor: '#4D4D4D',
                  filter: 'drop-shadow(0px 1px 2px rgba(16, 24, 40, 0.05))',
                  borderRadius: '8px',
                  width: '174.67px',
                  cursor: 'pointer'
                }}
                onClick={() => handleSocialLogin('Google')}
              >
                <GoogleIcon className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" />
              </button>
              
              {/* GitHub Button */}
              <button
                type="button"
                className="social-button flex flex-row justify-center items-center h-12 sm:h-14 lg:h-[60px] border bg-transparent rounded p-2 sm:p-3"
                style={{ 
                  borderWidth: '1px',
                  borderColor: isGitHubLoading ? '#7177FF' : '#4D4D4D',
                  filter: 'drop-shadow(0px 1px 2px rgba(16, 24, 40, 0.05))',
                  borderRadius: '8px',
                  width: '174.67px',
                  cursor: isGitHubLoading ? 'not-allowed' : 'pointer',
                  opacity: isGitHubLoading ? 0.7 : 1
                }}
                onClick={() => !isGitHubLoading && handleSocialLogin('GitHub')}
                disabled={isGitHubLoading}
              >
                {isGitHubLoading ? (
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                ) : (
                  <GitHubIcon className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" />
                )}
              </button>
              
              {/* Apple Button */}
              <button
                type="button"
                className="social-button flex flex-row justify-center items-center h-12 sm:h-14 lg:h-[60px] border bg-transparent rounded p-2 sm:p-3"
                style={{ 
                  borderWidth: '1px',
                  borderColor: '#4D4D4D',
                  filter: 'drop-shadow(0px 1px 2px rgba(16, 24, 40, 0.05))',
                  borderRadius: '8px',
                  width: '174.67px',
                  cursor: 'pointer'
                }}
                onClick={() => handleSocialLogin('Apple')}
              >
                <AppleIcon className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" />
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Bottom Links - отступ 80px от края */}
      <div 
        className="absolute z-50"
        style={{
          left: '80px',
          right: '80px',
          bottom: '40px'
        }}
      >
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
          <div className="text-center sm:text-left">
            <span 
              className="text-white" 
              style={{ 
                fontFamily: 'Helvetica, sans-serif',
                fontWeight: 400,
                fontSize: '16px'
              }}>
              {t('auth.login.noAccount')} 
            </span>
            <button 
              className="font-bold text-white hover:text-gray-300 transition-colors ml-1"
              style={{ 
                fontFamily: 'Helvetica, sans-serif',
                fontWeight: 700,
                fontSize: '16px'
              }}
              onClick={() => navigate('/register')}
            >
              {t('auth.login.registerLink')}
            </button>
          </div>
          <button 
            className="text-[#ABABAB] hover:text-gray-300 transition-colors"
            style={{ 
              fontFamily: 'Helvetica, sans-serif',
              fontWeight: 400,
              fontSize: '16px',
              textDecoration: 'underline'
            }}>
            {t('auth.login.contactSupport')}
          </button>
        </div>
      </div>

      {/* Decorative gradient elements - только на больших экранах */}
      <div 
        className="hidden xl:block absolute opacity-30 z-0"
        style={{
          width: '195.04px',
          height: '123.36px',
          left: 'calc(50% - 195.04px/2 - 646.51px)',
          top: '1053.93px',
          transform: 'rotate(-169.81deg)',
          background: 'radial-gradient(50.11% 50.11% at 53.42% 52.28%, #72F4FA 0%, #FBFBFB 14%, #F0F0F0 27%, #DDDDDD 39%, #C3C3C3 51%, #A1A1A1 63%, #787878 74%, #474747 86%, #101010 97%, #000000 100%)',
          backgroundBlendMode: 'color-dodge',
          mixBlendMode: 'color-dodge'
        }}
      />

      <div 
        className="hidden xl:block absolute opacity-30 z-0"
        style={{
          width: '13.2vw',
          height: '14.6vh',
          right: '2.9vw',
          top: '1.4vh',
          transform: 'rotate(60.61deg)',
          background: 'radial-gradient(circle, #72F4FA 0%, transparent 70%)',
          filter: 'blur(40px)'
        }}
      />

      {/* Полноэкранный премиум лоадер */}
      {showFullScreenLoader && (
        <FullScreenPremiumLoader 
          message={loaderMessage} 
          size={200}
        />
      )}
    </div>
  );
}
// Google Icon component - оригинальный дизайн
function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

// GitHub Icon component - оригинальный дизайн
function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="#FFFFFF">
      <path d="M12 0.297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/>
    </svg>
  );
}

// Apple Icon component - адаптивный для темной темы
function AppleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="#FFFFFF">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
    </svg>
  );
}
