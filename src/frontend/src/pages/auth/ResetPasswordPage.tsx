import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import resetPasswordBackground from '../../assets/auth/resetPassword/backgrounds/resetPasswordBackground.png';
import logoImage from '../../assets/auth/login/logos/logo (2).png';

export default function ResetPasswordPage(): React.JSX.Element {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  
  // Состояние для анимации появления
  const [isVisible, setIsVisible] = useState(false);

  // Навигация и Auth
  const navigate = useNavigate();
  const { resetPassword } = useAuth();

  // Анимация появления
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsLoading(true);
    
    try {
      await resetPassword(email);
      setIsSuccess(true);
    } catch (error) {
      console.error('Reset password error:', error);
      // В случае ошибки все равно показываем success для безопасности
      setIsSuccess(true);
    } finally {
      setIsLoading(false);
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
    input[type="email"]:-webkit-autofill {
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

    /* Hover эффект для кнопки сброса пароля */
    .reset-button {
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;
    }
    
    .reset-button::before {
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
    
    .reset-button:hover::before {
      opacity: 1;
    }
    
    .reset-button:hover {
      transform: translateY(-1px);
      box-shadow: 0 8px 25px rgba(246, 184, 253, 0.4), 0 4px 12px rgba(49, 106, 215, 0.3);
    }
    
    .reset-button:active {
      transform: translateY(0);
      box-shadow: 0 4px 15px rgba(246, 184, 253, 0.3), 0 2px 8px rgba(49, 106, 215, 0.2);
    }

    /* Input focus effects */
    .email-input {
      transition: all 0.3s ease;
    }
    
    .email-input:focus {
      border-color: #7177FF !important;
      box-shadow: 0 0 0 3px rgba(113, 119, 255, 0.1) !important;
      outline: none;
    }

    /* Success animation */
    .success-container {
      opacity: ${isSuccess ? 1 : 0};
      transform: ${isSuccess ? 'scale(1)' : 'scale(0.9)'};
      transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    }

    /* Адаптивные стили для фонового изображения */
    .reset-background {
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
      .reset-background {
        background-size: 115% 115% !important;
        background-position: center center !important;
        background-attachment: scroll;
      }
    }
    
    /* Tablet (641px - 1024px) */
    @media (min-width: 641px) and (max-width: 1024px) {
      .reset-background {
        background-size: 110% 110% !important;
        background-position: center center !important;
        background-attachment: scroll;
      }
    }
    
    /* Desktop (1025px - 1440px) */
    @media (min-width: 1025px) and (max-width: 1440px) {
      .reset-background {
        background-size: 108% 108% !important;
        background-position: center center !important;
        background-attachment: fixed;
      }
    }
    
    /* Large Desktop (1441px+) */
    @media (min-width: 1441px) {
      .reset-background {
        background-size: 105% 105% !important;
        background-position: center center !important;
        background-attachment: fixed;
      }
    }
  `;

  if (isSuccess) {
    return (
      <div 
        className="reset-background"
        style={{ 
          backgroundColor: '#252525',
          backgroundImage: `url(${resetPasswordBackground})`,
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

        {/* Success Message */}
        <div className="relative z-10 min-h-screen flex items-center justify-center form-container">
          <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-[548px] px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-6 success-container">
              <div className="w-20 h-20 mx-auto mb-6 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              
              <h1 
                className="text-white font-bold text-2xl sm:text-3xl lg:text-[40px]"
                style={{ 
                  fontFamily: 'Helvetica, sans-serif',
                  fontWeight: 700,
                  lineHeight: '1.2'
                }}
              >
                Check Your Email
              </h1>
              
              <p 
                className="text-white/80 text-base sm:text-lg lg:text-[20px] leading-relaxed max-w-[450px] mx-auto"
                style={{ 
                  fontFamily: 'Helvetica, sans-serif',
                  fontWeight: 400,
                  lineHeight: '1.3'
                }}
              >
                We've sent a password reset link to {email}. Click the link in the email to create a new password.
              </p>

              <div className="space-y-4 pt-4">
                <button
                  onClick={() => navigate('/login')}
                  className="reset-button w-full h-12 sm:h-14 lg:h-[60px] text-white font-bold text-base sm:text-lg md:text-xl lg:text-[24px] rounded transition-all duration-300"
                  style={{
                    background: 'linear-gradient(90.67deg, #F6B8FD -7.12%, #316AD7 114.37%)',
                    fontFamily: 'Helvetica, sans-serif',
                    fontWeight: 700,
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  Back to Login
                </button>

                <button
                  onClick={() => setIsSuccess(false)}
                  className="w-full text-[#ABABAB] hover:text-gray-300 transition-colors py-2"
                  style={{ 
                    fontFamily: 'Helvetica, sans-serif',
                    fontWeight: 400,
                    fontSize: '16px',
                    textDecoration: 'underline'
                  }}
                >
                  Didn't receive email? Try again
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="reset-background"
      style={{ 
        backgroundColor: '#252525',
        backgroundImage: `url(${resetPasswordBackground})`,
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
        <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-[548px] space-y-8 sm:space-y-10 lg:space-y-14 px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center space-y-4 lg:space-y-7">
            <h1 
              className="text-white font-bold text-2xl sm:text-3xl lg:text-[40px] mb-4"
              style={{ 
                fontFamily: 'Helvetica, sans-serif',
                fontWeight: 700,
                lineHeight: '1.2'
              }}
            >
              {t('auth.resetPassword.title')}
            </h1>
            <p 
              className="text-white text-base sm:text-lg lg:text-[20px] leading-relaxed max-w-[550px] mx-auto"
              style={{ 
                fontFamily: 'Helvetica, sans-serif',
                fontWeight: 400,
                lineHeight: '1.18'
              }}
            >
              {t('auth.resetPassword.subtitle')}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-8 lg:space-y-14">
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
                                  {t('auth.resetPassword.emailLabel')}
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
                className="email-input w-full h-12 sm:h-14 lg:h-[60px] bg-transparent text-white border rounded px-4 py-3 text-base sm:text-lg lg:text-[18px] outline-none transition-colors duration-200"
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

            {/* Submit Button */}
            <button 
              type="submit"
              className="reset-button w-full h-12 sm:h-14 lg:h-[60px] text-white font-bold text-base sm:text-lg md:text-xl lg:text-[24px] rounded transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
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
              disabled={isLoading || !email.trim()}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <span>{t('auth.resetPassword.sending')}</span>
                  <div className="loading-dots">
                    <div className="loading-dot"></div>
                    <div className="loading-dot"></div>
                    <div className="loading-dot"></div>
                  </div>
                </div>
              ) : (
                t('auth.resetPassword.sendButton')
              )}
            </button>
          </form>
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
              {t('auth.resetPassword.rememberPassword')} 
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
              {t('auth.resetPassword.loginLink')}
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