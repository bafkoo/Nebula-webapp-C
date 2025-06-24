import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

// Import images
import logoImage from '../../assets/auth/login/logos/logo (2).png';
import authCodeBackground from '../../assets/auth/verification/backgrounds/authCodeBackground.png';

// Auth Context
import { useAuth } from '../../hooks/useAuth';

interface FormErrors {
  code?: string;
  general?: string;
}

const VerificationPage: React.FC = () => {
  const navigate = useNavigate();
  const { verifyEmail, resendVerificationCode, pendingVerificationEmail } = useAuth();
  const { t } = useTranslation();
  
  // Input refs for auto-focus
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  
  // Form state
  const [code, setCode] = useState<string[]>(Array(6).fill(''));
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(false);
  
  // Resend functionality
  const [canResend, setCanResend] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const [isResending, setIsResending] = useState(false);
  
  // Email из AuthContext
  const email = pendingVerificationEmail || 'user@example.com';
  const maskedEmail = email.replace(/(.{2})(.*)(@.*)/, '$1********$3');

  // Animation trigger
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFormVisible(true);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  // Resend timer
  useEffect(() => {
    if (resendTimer > 0 && !canResend) {
      const timer = setTimeout(() => {
        setResendTimer(resendTimer - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (resendTimer === 0) {
      setCanResend(true);
    }
  }, [resendTimer, canResend]);

  // Auto-focus first input on mount
  useEffect(() => {
    if (isFormVisible && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [isFormVisible]);

  const handleInputChange = (index: number, value: string) => {
    // Only allow numbers
    const numericValue = value.replace(/[^0-9]/g, '');
    
    if (numericValue.length <= 1) {
      const newCode = [...code];
      newCode[index] = numericValue;
      setCode(newCode);

      // Clear errors when user starts typing
      if (errors.code) {
        setErrors(prev => ({ ...prev, code: undefined }));
      }

      // Auto-focus next input
      if (numericValue && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    // Handle backspace
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    
    // Handle paste
    if (e.key === 'Enter') {
      handleSubmit(e as React.FormEvent);
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/[^0-9]/g, '');
    
    if (pastedData.length === 6) {
      const newCode = pastedData.split('');
      setCode(newCode);
      inputRefs.current[5]?.focus();
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (code.some(digit => digit === '')) {
      newErrors.code = 'Please enter the complete 6-digit code';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (code.length !== 6 || !validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      const codeString = code.join('');
      await verifyEmail(codeString);
      navigate('/app');
    } catch (error) {
      console.error('Verification failed:', error);
      setErrors({ general: 'Неверный код верификации. Попробуйте снова.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!canResend || isResending) return;

    setIsResending(true);
    setErrors({});

    try {
      // Используем реальный API метод
      await resendVerificationCode();
      
      // Reset timer
      setCanResend(false);
      setResendTimer(60);
      
      // Clear current code
      setCode(Array(6).fill(''));
      inputRefs.current[0]?.focus();
      
    } catch (error: unknown) {
      setErrors({ 
        general: error instanceof Error ? error.message : 'Не удалось отправить код повторно. Попробуйте снова.' 
      });
    } finally {
      setIsResending(false);
    }
  };

  const isCodeComplete = code.every(digit => digit !== '');

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
    input:-webkit-autofill:active {
      -webkit-box-shadow: 0 0 0 1000px transparent inset !important;
      -webkit-text-fill-color: #ffffff !important;
      background-color: transparent !important;
      background-image: none !important;
      color: #ffffff !important;
      transition: background-color 5000s ease-in-out 0s !important;
    }

    /* Анимация появления формы */
    .form-container {
      opacity: ${isFormVisible ? 1 : 0};
      transform: ${isFormVisible ? 'translateY(0)' : 'translateY(40px)'};
      transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .logo-container {
      opacity: ${isFormVisible ? 1 : 0};
      transform: ${isFormVisible ? 'translateY(0)' : 'translateY(-20px)'};
      transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1) 0.2s;
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

    /* Адаптивные стили для фонового изображения */
    .verification-background {
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
      .verification-background {
        background-size: 115% 115% !important;
        background-position: center center !important;
        background-attachment: scroll;
      }
    }
    
    /* Tablet (641px - 1024px) */
    @media (min-width: 641px) and (max-width: 1024px) {
      .verification-background {
        background-size: 110% 110% !important;
        background-position: center center !important;
        background-attachment: scroll;
      }
    }
    
    /* Desktop (1025px - 1440px) */
    @media (min-width: 1025px) and (max-width: 1440px) {
      .verification-background {
        background-size: 108% 108% !important;
        background-position: center center !important;
        background-attachment: fixed;
      }
    }
    
    /* Large Desktop (1441px+) */
    @media (min-width: 1441px) {
      .verification-background {
        background-size: 105% 105% !important;
        background-position: center center !important;
        background-attachment: fixed;
      }
    }
  `;

  return (
    <div 
      className="verification-background"
      style={{ 
        backgroundColor: '#252525',
        backgroundImage: `url(${authCodeBackground})`,
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
        <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-[576px] space-y-4 sm:space-y-6 lg:space-y-8 px-4 sm:px-6 lg:px-8">
          
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
              {t('verifyYourCode')}
            </h1>
            <p 
              className="text-white text-base sm:text-lg lg:text-[20px] leading-relaxed max-w-[550px] mx-auto"
              style={{ 
                fontFamily: 'Helvetica, sans-serif',
                fontWeight: 400,
                lineHeight: '1.18'
              }}
            >
              {t('enterThePasscodeYouJustReceivedOnYourEmailAddressEndingWith')}
              <span className="text-white font-medium">{maskedEmail}</span>
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5 lg:space-y-6">
            {/* Code Input Fields */}
            <div className="space-y-4">
              <div 
                className="flex justify-center gap-3"
                onPaste={handlePaste}
              >
                {code.map((digit, index) => (
                  <input
                    key={index}
                    ref={el => { inputRefs.current[index] = el; }}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={1}
                    value={digit}
                    onChange={e => handleInputChange(index, e.target.value)}
                    onKeyDown={e => handleKeyDown(index, e)}
                    className={`w-[73px] h-[80px] text-center text-[32px] font-bold bg-transparent border rounded-lg text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#7177FF] focus:border-transparent ${
                      errors.code 
                        ? 'border-red-500 focus:ring-red-500' 
                        : digit 
                          ? 'border-[#7177FF] bg-[#7177FF]/10'
                          : 'border-white/30 hover:border-white/50'
                    }`}
                    style={{ 
                      fontFamily: 'Helvetica, sans-serif',
                      fontWeight: 700,
                      borderRadius: '8px'
                    }}
                    disabled={isLoading}
                  />
                ))}
              </div>
              
              {errors.code && (
                <p className="text-red-400 text-sm text-center flex items-center justify-center">
                  <span className="w-4 h-4 rounded-full bg-red-400 text-white text-xs flex items-center justify-center mr-2">!</span>
                  {errors.code}
                </p>
              )}
            </div>

            {/* General Error */}
            {errors.general && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3">
                <p className="text-red-400 text-sm flex items-center justify-center">
                  <span className="w-4 h-4 rounded-full bg-red-400 text-white text-xs flex items-center justify-center mr-2">!</span>
                  {errors.general}
                </p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !isCodeComplete}
              className="w-full h-12 sm:h-14 lg:h-[60px] rounded-lg text-white text-base sm:text-lg lg:text-xl font-bold transition-all duration-300 ease-out disabled:opacity-50 disabled:cursor-not-allowed register-button"
              style={{
                background: isLoading 
                  ? 'linear-gradient(135deg, #6B7280 0%, #9CA3AF 100%)'
                  : 'linear-gradient(135deg, #7177FF 0%, #9B87F5 25%, #E879F9 75%, #F472B6 100%)',
                fontFamily: 'Helvetica, sans-serif',
                fontWeight: 700,
                borderRadius: '8px'
              }}
            >
              {isLoading ? (
                <div className="loading-dots">
                  <div className="loading-dot"></div>
                  <div className="loading-dot"></div>
                  <div className="loading-dot"></div>
                </div>
              ) : (
                'Verify'
              )}
            </button>

            {/* Resend Code Section */}
            <div className="text-center space-y-3">
              <p 
                className="text-white/70 text-sm"
                style={{ 
                  fontFamily: 'Helvetica, sans-serif',
                  fontWeight: 400
                }}
              >
                {t('didntReceiveTheCode')}
              </p>
              
              {canResend ? (
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={isResending}
                  className="text-[#7177FF] hover:text-[#5A5FEB] text-sm font-medium transition-colors duration-200 disabled:opacity-50"
                  style={{ 
                    fontFamily: 'Helvetica, sans-serif',
                    fontWeight: 500
                  }}
                >
                  {isResending ? 'Sending...' : 'Resend Code'}
                </button>
              ) : (
                <p 
                  className="text-white/50 text-sm"
                  style={{ 
                    fontFamily: 'Helvetica, sans-serif',
                    fontWeight: 400
                  }}
                >
                  {t('resendCodeIn')} {resendTimer}s
                </p>
              )}
            </div>

            {/* Back Navigation */}
            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="text-white/70 hover:text-white text-sm transition-colors duration-200"
                style={{ 
                  fontFamily: 'Helvetica, sans-serif',
                  fontWeight: 400
                }}
                disabled={isLoading}
              >
                {t('backToLogin')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VerificationPage; 