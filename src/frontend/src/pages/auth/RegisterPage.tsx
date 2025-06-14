import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckIcon, EyeIcon, EyeOffIcon } from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';
import { useTranslation } from 'react-i18next';
import backGroundRegister from '../../assets/auth/register/backgrounds/backGroundRegister.png';
import logoImage from '../../assets/auth/login/logos/logo (2).png';
import { useAuth } from '../../contexts/AuthContext';

interface FormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

export default function RegisterPage(): React.JSX.Element {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Состояния фокуса для полей
  const [focusedField, setFocusedField] = useState<string | null>(null);
  
  // Состояние для анимации появления
  const [isVisible, setIsVisible] = useState(false);

  // Навигация и Auth
  const navigate = useNavigate();
  const { register, googleAuth } = useAuth();

  // Google OAuth login
  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        setIsLoading(true);
        
        // Получаем информацию о пользователе через Google API
        const userInfoResponse = await fetch(`https://www.googleapis.com/oauth2/v2/userinfo?access_token=${tokenResponse.access_token}`);
        const userInfo = await userInfoResponse.json();
        
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
        navigate('/app');
      } catch (error) {
        console.error('Google OAuth error:', error);
      } finally {
        setIsLoading(false);
      }
    },
    onError: (error) => {
      console.error('Google OAuth error:', error);
    },
  });

  // Анимация появления
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Используем функцию register из AuthContext
      await register({
        username: formData.username,
        email: formData.email,
        password: formData.password
      });
      
      // После успешной регистрации пользователь автоматически будет перенаправлен
      // на страницу верификации через ProtectedRoute логику
      navigate('/verification');
    } catch (error) {
      console.error('Registration error:', error);
      // Здесь можно добавить обработку ошибок регистрации
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    if (provider === 'Google') {
      googleLogin();
    } else {
      console.log(`${provider} registration clicked`);
    }
  };

  // Inline styles for animations and effects
  const styles = `
    /* Убираем все отступы у body и html */
    html, body, #root {
      margin: 0 !important;
      padding: 0 !important;
      width: 100vw !important;
      height: 100vh !important;
      overflow-x: hidden !important;
    }

    /* CSS стили для автозаполнения */
    input:-webkit-autofill,
    input:-webkit-autofill:hover,
    input:-webkit-autofill:focus,
    input:-webkit-autofill:active,
    input[type="text"]:-webkit-autofill,
    input[type="email"]:-webkit-autofill,
    input[type="password"]:-webkit-autofill {
      -webkit-box-shadow: 0 0 0 1000px transparent inset !important;
      -webkit-text-fill-color: #ffffff !important;
      background-color: transparent !important;
      background-image: none !important;
      color: #ffffff !important;
      font-family: 'Helvetica', sans-serif !important;
      font-weight: 400 !important;
      font-size: 18px !important;
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

    /* Hover эффект для кнопки регистрации */
    .register-button {
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;
    }
    
    .register-button::before {
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
    
    .register-button:hover::before {
      opacity: 1;
    }
    
    .register-button:hover {
      transform: translateY(-1px);
      box-shadow: 0 8px 25px rgba(246, 184, 253, 0.4), 0 4px 12px rgba(49, 106, 215, 0.3);
    }
    
    .register-button:active {
      transform: translateY(0);
      box-shadow: 0 4px 15px rgba(246, 184, 253, 0.3), 0 2px 8px rgba(49, 106, 215, 0.2);
    }

    /* Input focus effects */
    .form-input {
      transition: all 0.3s ease;
    }
    
    .form-input:focus {
      border-color: #7177FF !important;
      box-shadow: 0 0 0 3px rgba(113, 119, 255, 0.1) !important;
      outline: none;
    }

    /* Адаптивные стили для фонового изображения */
    .register-background {
      background-size: cover !important;
      background-position: center center !important;
      background-repeat: no-repeat !important;
      background-attachment: fixed;
      width: 100vw !important;
      height: 100vh !important;
      min-height: 100vh !important;
      min-width: 100vw !important;
      /* Кроп изображения - убираем черные края */
      background-size: 110% 110% !important;
      background-position: center center !important;
    }
    
    /* Mobile (до 640px) */
    @media (max-width: 640px) {
      .register-background {
        background-size: 115% 115% !important;
        background-position: center center !important;
        background-attachment: scroll;
      }
    }
    
    /* Tablet (641px - 1024px) */
    @media (min-width: 641px) and (max-width: 1024px) {
      .register-background {
        background-size: 110% 110% !important;
        background-position: center center !important;
        background-attachment: scroll;
      }
    }
    
    /* Desktop (1025px - 1440px) */
    @media (min-width: 1025px) and (max-width: 1440px) {
      .register-background {
        background-size: 108% 108% !important;
        background-position: center center !important;
        background-attachment: fixed;
      }
    }
    
    /* Large Desktop (1441px+) */
    @media (min-width: 1441px) {
      .register-background {
        background-size: 105% 105% !important;
        background-position: center center !important;
        background-attachment: fixed;
      }
    }
    
    /* Ultra-wide экраны */
    @media (min-width: 1920px) {
      .register-background {
        background-size: 102% 102% !important;
        background-position: center center !important;
      }
    }
    
    /* Портретная ориентация на планшетах */
    @media (orientation: portrait) and (min-width: 768px) and (max-width: 1024px) {
      .register-background {
        background-size: cover !important;
        background-position: center center !important;
      }
    }
    
    /* Альбомная ориентация на мобильных */
    @media (orientation: landscape) and (max-height: 480px) {
      .register-background {
        background-size: cover !important;
        background-position: center center !important;
        background-attachment: scroll;
      }
    }

    /* Очень маленькие экраны (до 375px) */
    @media (max-width: 375px) {
      .register-background {
        background-size: cover !important;
        background-position: center center !important;
        background-attachment: scroll;
      }
    }
    
    /* Высокие экраны (соотношение сторон больше 16:10) */
    @media (min-aspect-ratio: 16/10) {
      .register-background {
        background-size: cover !important;
        background-position: center center !important;
      }
    }
    
    /* Широкие экраны (соотношение сторон больше 21:9) */
    @media (min-aspect-ratio: 21/9) {
      .register-background {
        background-size: cover !important;
        background-position: center center !important;
      }
    }
    
    /* Retina/High DPI экраны */
    @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
      .register-background {
        background-size: cover !important;
        background-position: center center !important;
      }
    }
    
    /* Очень высокие экраны (например, складные телефоны) */
    @media (max-width: 480px) and (min-height: 800px) {
      .register-background {
        background-size: cover !important;
        background-position: center center !important;
        background-attachment: scroll;
      }
    }

    /* Альтернативный способ кропа через псевдо-элемент */
    .register-background::before {
      content: '';
      position: absolute;
      top: -5%;
      left: -5%;
      width: 110%;
      height: 110%;
      background-image: inherit;
      background-size: cover;
      background-position: center center;
      background-repeat: no-repeat;
      z-index: -1;
    }
  `;

  return (
    <div 
      className="register-background"
      style={{ 
        backgroundColor: '#252525',
        backgroundImage: `url(${backGroundRegister})`,
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        margin: 0,
        padding: 0
      }}
    >
      <style>{styles}</style>

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

      {/* Main Content Container */}
      <div className="relative z-10 min-h-screen flex items-center justify-center form-container">
        <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-[548px] space-y-4 sm:space-y-6 lg:space-y-8 px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center space-y-3 lg:space-y-4">
            <h1 
              className="text-white font-bold text-2xl sm:text-3xl lg:text-[40px]"
              style={{ 
                fontFamily: 'Helvetica, sans-serif',
                fontWeight: 700,
                lineHeight: '1.2'
              }}
            >
              {t('auth.register.title')}
            </h1>
            <p 
              className="text-white text-base sm:text-lg lg:text-[20px] leading-relaxed max-w-[550px] mx-auto"
              style={{ 
                fontFamily: 'Helvetica, sans-serif',
                fontWeight: 400,
                lineHeight: '1.18'
              }}
            >
              {t('auth.register.subtitle')}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5 lg:space-y-6">
            <div className="space-y-4 lg:space-y-5">
              
              {/* Username Field */}
              <div className="relative">
                <div 
                  className="absolute top-0 left-4 px-1 text-xs font-normal z-10 transition-colors duration-200"
                  style={{
                    backgroundColor: '#252525',
                    color: focusedField === 'username' ? '#7177FF' : '#ABABAB',
                    fontFamily: 'Helvetica, sans-serif',
                    transform: 'translateY(-50%)'
                  }}
                >
                  {t('auth.register.usernameLabel')}
                </div>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  onFocus={() => setFocusedField('username')}
                  onBlur={() => setFocusedField(null)}
                  className="form-input w-full h-12 sm:h-14 lg:h-[60px] bg-transparent text-white border rounded px-4 py-3 text-base sm:text-lg lg:text-[18px] outline-none transition-colors duration-200"
                  style={{
                    borderColor: focusedField === 'username' ? '#7177FF' : '#4D4D4D',
                    borderWidth: '1px',
                    borderRadius: '8px',
                    fontFamily: 'Helvetica, sans-serif',
                    fontWeight: 400
                  }}
                  required
                />
              </div>

              {/* Email Field */}
              <div className="relative">
                <div 
                  className="absolute top-0 left-4 px-1 text-xs font-normal z-10 transition-colors duration-200"
                  style={{
                    backgroundColor: '#252525',
                    color: focusedField === 'email' ? '#7177FF' : '#ABABAB',
                    fontFamily: 'Helvetica, sans-serif',
                    transform: 'translateY(-50%)'
                  }}
                >
                  {t('auth.register.emailLabel')}
                </div>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  className="form-input w-full h-12 sm:h-14 lg:h-[60px] bg-transparent text-white border rounded px-4 py-3 text-base sm:text-lg lg:text-[18px] outline-none transition-colors duration-200"
                  style={{
                    borderColor: focusedField === 'email' ? '#7177FF' : '#4D4D4D',
                    borderWidth: '1px',
                    borderRadius: '8px',
                    fontFamily: 'Helvetica, sans-serif',
                    fontWeight: 400
                  }}
                  required
                />
              </div>

              {/* Password Field */}
              <div className="relative">
                <div 
                  className="absolute top-0 left-4 px-1 text-xs font-normal z-10 transition-colors duration-200"
                  style={{
                    backgroundColor: '#252525',
                    color: focusedField === 'password' ? '#7177FF' : '#ABABAB',
                    fontFamily: 'Helvetica, sans-serif',
                    transform: 'translateY(-50%)'
                  }}
                >
                  {t('auth.register.passwordLabel')}
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  className="form-input w-full h-12 sm:h-14 lg:h-[60px] bg-transparent text-white border rounded px-4 py-3 pr-12 text-base sm:text-lg lg:text-[18px] outline-none transition-colors duration-200"
                  style={{
                    borderColor: focusedField === 'password' ? '#7177FF' : '#4D4D4D',
                    borderWidth: '1px',
                    borderRadius: '8px',
                    fontFamily: 'Helvetica, sans-serif',
                    fontWeight: 400
                  }}
                  required
                />
                <button
                  type="button"
                  className="eye-hover absolute right-3 top-1/2 transform -translate-y-1/2"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOffIcon 
                      className="eye-icon text-gray-400"
                      style={{ width: '20px', height: '20px' }}
                    />
                  ) : (
                    <EyeIcon 
                      className="eye-icon text-gray-400"
                      style={{ width: '20px', height: '20px' }}
                    />
                  )}
                </button>
              </div>

              {/* Confirm Password Field */}
              <div className="relative">
                <div 
                  className="absolute top-0 left-4 px-1 text-xs font-normal z-10 transition-colors duration-200"
                  style={{
                    backgroundColor: '#252525',
                    color: focusedField === 'confirmPassword' ? '#7177FF' : '#ABABAB',
                    fontFamily: 'Helvetica, sans-serif',
                    transform: 'translateY(-50%)'
                  }}
                >
                  {t('auth.register.confirmPasswordLabel')}
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  onFocus={() => setFocusedField('confirmPassword')}
                  onBlur={() => setFocusedField(null)}
                  className="form-input w-full h-12 sm:h-14 lg:h-[60px] bg-transparent text-white border rounded px-4 py-3 pr-12 text-base sm:text-lg lg:text-[18px] outline-none transition-colors duration-200"
                  style={{
                    borderColor: focusedField === 'confirmPassword' ? '#7177FF' : '#4D4D4D',
                    borderWidth: '1px',
                    borderRadius: '8px',
                    fontFamily: 'Helvetica, sans-serif',
                    fontWeight: 400
                  }}
                  required
                />
                <button
                  type="button"
                  className="eye-hover absolute right-3 top-1/2 transform -translate-y-1/2"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOffIcon 
                      className="eye-icon text-gray-400"
                      style={{ width: '20px', height: '20px' }}
                    />
                  ) : (
                    <EyeIcon 
                      className="eye-icon text-gray-400"
                      style={{ width: '20px', height: '20px' }}
                    />
                  )}
                </button>
              </div>

              {/* Terms Agreement */}
              <div className="flex items-center gap-3 lg:gap-4">
                <div className="relative">
                  <input
                    type="checkbox"
                    id="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)}
                    className="sr-only"
                  />
                  <div 
                    className="cursor-pointer transition-colors border border-gray-500 rounded flex items-center justify-center"
                    style={{
                      width: '24px',
                      height: '24px',
                      backgroundColor: formData.agreeToTerms ? '#7177FF' : 'transparent',
                      borderColor: formData.agreeToTerms ? '#7177FF' : '#4D4D4D',
                      borderRadius: '4px'
                    }}
                    onClick={() => handleInputChange('agreeToTerms', !formData.agreeToTerms)}
                  >
                    {formData.agreeToTerms && (
                      <CheckIcon 
                        className="text-white"
                        style={{
                          width: '18px',
                          height: '18px'
                        }}
                      />
                    )}
                  </div>
                </div>
                <label 
                  className="text-[#ABABAB] font-normal cursor-pointer text-sm sm:text-base lg:text-[16px]" 
                  style={{ 
                    fontFamily: 'Helvetica, sans-serif',
                    fontWeight: 400
                  }}
                  onClick={() => handleInputChange('agreeToTerms', !formData.agreeToTerms)}
                >
                  Я согласен с{' '}
                  <span className="text-[#7177FF] underline hover:text-purple-300 transition-colors cursor-pointer">
                    Условиями использования
                  </span>{' '}
                  и{' '}
                  <span className="text-[#7177FF] underline hover:text-purple-300 transition-colors cursor-pointer">
                    Политикой конфиденциальности
                  </span>
                </label>
              </div>
            </div>

            {/* Register Button */}
            <button 
              type="submit"
              className="w-full h-12 sm:h-14 lg:h-[60px] text-white font-bold text-base sm:text-lg md:text-xl lg:text-[24px] rounded transition-all duration-300 hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed register-button"
              style={{
                background: isLoading 
                  ? 'linear-gradient(90.67deg, #A8A8A8 -7.12%, #6B6B6B 114.37%)'
                  : 'linear-gradient(90.67deg, #F6B8FD -7.12%, #316AD7 114.37%)',
                fontFamily: 'Helvetica, sans-serif',
                fontWeight: 700,
                borderRadius: '8px',
                border: 'none',
                cursor: isLoading ? 'not-allowed' : 'pointer'
              }}
              disabled={isLoading || !formData.agreeToTerms}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <span>{t('auth.register.registering')}</span>
                  <div className="loading-dots">
                    <div className="loading-dot"></div>
                    <div className="loading-dot"></div>
                    <div className="loading-dot"></div>
                  </div>
                </div>
              ) : (
                t('auth.register.registerButton')
              )}
            </button>
          </form>

          {/* Separator */}
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

          {/* Social Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 lg:gap-[12px] w-full">
            {/* Google Button */}
            <button
              className="social-button flex flex-row justify-center items-center h-12 sm:h-14 lg:h-[60px] border bg-transparent rounded p-2 sm:p-3"
              style={{ 
                borderWidth: '1px',
                borderColor: '#4D4D4D',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
              onClick={() => handleSocialLogin('Google')}
            >
              <GoogleIcon className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" />
            </button>
            
            {/* Facebook Button */}
            <button
              className="social-button flex flex-row justify-center items-center h-12 sm:h-14 lg:h-[60px] border bg-transparent rounded p-2 sm:p-3"
              style={{ 
                borderWidth: '1px',
                borderColor: '#4D4D4D',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
              onClick={() => handleSocialLogin('Facebook')}
            >
              <FacebookIcon className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" />
            </button>
            
            {/* Apple Button */}
            <button
              className="social-button flex flex-row justify-center items-center h-12 sm:h-14 lg:h-[60px] border bg-transparent rounded p-2 sm:p-3"
              style={{ 
                borderWidth: '1px',
                borderColor: '#4D4D4D',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
              onClick={() => handleSocialLogin('Apple')}
            >
              <AppleIcon className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Links */}
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
              {t('auth.register.haveAccount')} 
            </span>
            <button 
              className="font-bold text-white hover:text-gray-300 transition-colors ml-1"
              style={{ 
                fontFamily: 'Helvetica, sans-serif',
                fontWeight: 700,
                fontSize: '16px'
              }}
              onClick={() => navigate('/login')}
            >
              {t('auth.register.loginLink')}
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

      {/* Decorative gradient elements */}
      <div 
        className="hidden xl:block absolute opacity-30 z-0"
        style={{
          width: '228px',
          height: '163px',
          right: '80px',
          top: '74px',
          transform: 'rotate(60.61deg)',
          background: 'linear-gradient(45deg, rgba(113, 119, 255, 0.3) 0%, rgba(246, 184, 253, 0.3) 100%)',
          borderRadius: '20px',
          filter: 'blur(40px)'
        }}
      />
      
      <div 
        className="hidden xl:block absolute opacity-30 z-0"
        style={{
          width: '194px',
          height: '115px',
          left: '9px',
          bottom: '208px',
          transform: 'rotate(-169.81deg)',
          background: 'linear-gradient(45deg, rgba(246, 184, 253, 0.3) 0%, rgba(113, 119, 255, 0.3) 100%)',
          borderRadius: '20px',
          filter: 'blur(40px)'
        }}
      />
    </div>
  );
}

// Social Media Icons Components
function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="12" fill="#1877F2"/>
      <path d="M16.5 12.5h-2.8V20h-3.2v-7.5H9V10h1.5V8.3c0-1.3.6-3.3 3.3-3.3H16v2.8h-1.9c-.3 0-.6.3-.6.6V10h2.6l-.6 2.5z" fill="white"/>
    </svg>
  );
}

function AppleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="#FFFFFF">
      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
    </svg>
  );
} 