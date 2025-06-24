import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useParams } from 'react-router-dom';
import { EyeIcon, EyeOffIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';

// Import images - используем правильный фон для newPassword
import logoImage from '../../assets/auth/login/logos/logo (2).png';
import newPasswordBackground from '../../assets/auth/newPassword/backgrounds/newPasswordBackround.png';

interface FormData {
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  password?: string;
  confirmPassword?: string;
  general?: string;
}

interface PasswordStrength {
  hasMinLength: boolean;
  hasUpperCase: boolean;
  hasLowerCase: boolean;
  hasSpecialChar: boolean;
  isValid: boolean;
}

export default function NewPasswordPage(): React.JSX.Element {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { token: paramToken } = useParams();
  const { updatePassword } = useAuth();
  const { t } = useTranslation();
  
  const [formData, setFormData] = useState<FormData>({
    password: '',
    confirmPassword: ''
  });
  
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isValidToken, setIsValidToken] = useState(true);
  const [isCheckingToken, setIsCheckingToken] = useState(true);
  
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({
    hasMinLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasSpecialChar: false,
    isValid: false
  });

  // Get reset token from URL parameters or query string
  const resetToken = paramToken || searchParams.get('token');

  // Check token validity on component mount
  useEffect(() => {
    const checkTokenValidity = async () => {
      if (!resetToken) {
        setIsValidToken(false);
        setIsCheckingToken(false);
        return;
      }

      try {
        // Simulate API call to verify token
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsValidToken(true); // For demo purposes
      } catch {
        setIsValidToken(false);
      } finally {
        setIsCheckingToken(false);
      }
    };

    checkTokenValidity();
  }, [resetToken]);

  // Animation trigger
  useEffect(() => {
    if (!isCheckingToken && isValidToken) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isCheckingToken, isValidToken]);

  // Password strength validation
  useEffect(() => {
    const password = formData.password;
    const strength: PasswordStrength = {
      hasMinLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      isValid: false
    };
    strength.isValid = strength.hasMinLength && strength.hasUpperCase && 
                     strength.hasLowerCase && strength.hasSpecialChar;
    setPasswordStrength(strength);
  }, [formData.password]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear specific error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Password validation
    if (!formData.password) {
      newErrors.password = t('errors.passwordRequired');
    } else if (!passwordStrength.isValid) {
      newErrors.password = t('errors.passwordRequirements');
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = t('errors.confirmPasswordRequired');
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t('errors.passwordsDoNotMatch');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      if (!resetToken) {
        throw new Error(t('errors.resetTokenNotFound'));
      }
      
      await updatePassword(resetToken, formData.password);
      
      // Success - navigate to login with success message
      navigate('/login', { 
        state: { 
          message: t('success.passwordChanged'),
          type: 'success'
        }
      });
    } catch (error: unknown) {
      setErrors({ 
        general: error instanceof Error ? error.message : t('errors.unableToChangePassword') 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStrengthColor = (isValid: boolean) => {
    return isValid ? '#10B981' : '#EF4444';
  };

  // CSS стили в стиле Nebula как в других страницах
  const nebulaStyles = `
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

    /* Hover эффект для кнопки создания пароля */
    .create-password-button {
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;
    }
    
    .create-password-button::before {
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
    
    .create-password-button:hover::before {
      opacity: 1;
    }
    
    .create-password-button:hover {
      transform: translateY(-1px);
      box-shadow: 0 8px 25px rgba(246, 184, 253, 0.4), 0 4px 12px rgba(49, 106, 215, 0.3);
    }
    
    .create-password-button:active {
      transform: translateY(0);
      box-shadow: 0 4px 15px rgba(246, 184, 253, 0.3), 0 2px 8px rgba(49, 106, 215, 0.2);
    }

    /* Адаптивные стили для фонового изображения */
    .newpassword-background {
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
      .newpassword-background {
        background-size: 115% 115% !important;
        background-position: center center !important;
        background-attachment: scroll;
      }
    }
    
    /* Tablet (641px - 1024px) */
    @media (min-width: 641px) and (max-width: 1024px) {
      .newpassword-background {
        background-size: 110% 110% !important;
        background-position: center center !important;
        background-attachment: scroll;
      }
    }
    
    /* Desktop (1025px - 1440px) */
    @media (min-width: 1025px) and (max-width: 1440px) {
      .newpassword-background {
        background-size: 108% 108% !important;
        background-position: center center !important;
        background-attachment: fixed;
      }
    }
    
    /* Large Desktop (1441px+) */
    @media (min-width: 1441px) {
      .newpassword-background {
        background-size: 105% 105% !important;
        background-position: center center !important;
        background-attachment: fixed;
      }
    }
  `;

  // Loading screen while checking token
  if (isCheckingToken) {
    return (
      <div 
        className="newpassword-background"
        style={{ 
          backgroundColor: '#252525',
          backgroundImage: `url(${newPasswordBackground})`,
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          margin: 0,
          padding: 0
        }}
      >
        <style dangerouslySetInnerHTML={{ __html: nebulaStyles }} />
        
        {/* Logo - в левом верхнем углу как в других страницах */}
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

        <div className="relative z-10 min-h-screen flex items-center justify-center form-container">
          <div className="text-center">
            <div className="loading-dots mb-6">
              <div className="loading-dot"></div>
              <div className="loading-dot"></div>
              <div className="loading-dot"></div>
            </div>
            <p 
              className="text-white text-lg"
              style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
            >
              {t('checkingLink')}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Invalid token screen
  if (!isValidToken) {
    return (
      <div 
        className="newpassword-background"
        style={{ 
          backgroundColor: '#252525',
          backgroundImage: `url(${newPasswordBackground})`,
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          margin: 0,
          padding: 0
        }}
      >
        <style dangerouslySetInnerHTML={{ __html: nebulaStyles }} />
        
        {/* Logo - в левом верхнем углу */}
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
        
        <div className="relative z-10 min-h-screen flex items-center justify-center form-container">
          <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-[548px] px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-6">
              <div className="w-20 h-20 mx-auto mb-6 bg-red-500 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
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
                {t('invalidLink')}
              </h1>
              
              <p 
                className="text-white/80 text-base sm:text-lg lg:text-[20px] leading-relaxed max-w-[450px] mx-auto"
                style={{ 
                  fontFamily: 'Helvetica, sans-serif',
                  fontWeight: 400,
                  lineHeight: '1.3'
                }}
              >
                {t('invalidLinkDescription')}
              </p>

              <div className="space-y-4 pt-4">
                <button
                  onClick={() => navigate('/reset-password')}
                  className="create-password-button w-full h-12 sm:h-14 lg:h-[60px] text-white font-bold text-base sm:text-lg md:text-xl lg:text-[24px] rounded transition-all duration-300"
                  style={{
                    background: 'linear-gradient(90.67deg, #F6B8FD -7.12%, #316AD7 114.37%)',
                    fontFamily: 'Helvetica, sans-serif',
                    fontWeight: 700,
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  {t('requestNewLink')}
                </button>

                <button
                  onClick={() => navigate('/login')}
                  className="w-full text-[#ABABAB] hover:text-gray-300 transition-colors py-2"
                  style={{ 
                    fontFamily: 'Helvetica, sans-serif',
                    fontWeight: 400,
                    fontSize: '16px',
                    textDecoration: 'underline'
                  }}
                >
                  {t('returnToLogin')}
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
      className="newpassword-background"
      style={{ 
        backgroundColor: '#252525',
        backgroundImage: `url(${newPasswordBackground})`,
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        margin: 0,
        padding: 0
      }}
    >
      <style dangerouslySetInnerHTML={{ __html: nebulaStyles }} />

      {/* Logo - в левом верхнем углу как в других страницах */}
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
      <div className="min-h-screen flex items-center justify-center px-4 py-8 lg:px-8 relative z-40 form-container">
        <div className="w-full max-w-[320px] sm:max-w-[400px] md:max-w-[480px] lg:max-w-[548px] mx-auto">
          
          {/* Header */}
          <div className="text-center mb-14 w-full max-w-[548px] mx-auto">
            <h1 
              className="text-white font-bold text-4xl mb-6 relative z-50"
              style={{ 
                fontFamily: 'Helvetica, sans-serif',
                fontWeight: 700
              }}
            >
              {t('createNewPassword')}
            </h1>
            <p 
              className="text-[#ABABAB] text-xl relative z-50"
              style={{ 
                fontFamily: 'Helvetica, sans-serif',
                fontWeight: 400
              }}
            >
              {t('passwordRequirements')}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-8 sm:space-y-12 lg:space-y-[60px]">
            
            {/* Input Fields */}
            <div className="space-y-6 lg:space-y-[56px]">
              <div className="space-y-4 lg:space-y-[24px]">
                
                {/* Password Field */}
                <div className="space-y-2">
                  <div className="relative h-14 sm:h-16 lg:h-[66px]">
                    {/* Main Border Container */}
                    <div 
                      className="absolute inset-0 top-1.5 lg:top-[6px] border rounded bg-transparent transition-colors duration-200"
                      style={{
                        borderWidth: '1px',
                        borderColor: errors.password ? '#EF4444' : (focusedField === 'password' ? '#7177FF' : '#ABABAB')
                      }}
                    />
                    
                    {/* Subtract Effect - Label Background Cut */}
                    <div 
                      className="absolute flex items-center justify-center"
                      style={{
                        width: '100px',
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
                          color: errors.password ? '#EF4444' : (focusedField === 'password' ? '#7177FF' : '#ABABAB')
                        }}>
                        {t('newPassword')}
                      </label>
                    </div>
                    
                    {/* Password Input */}
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder={t('enterNewPassword')}
                      className="absolute bg-transparent text-white font-normal border-none outline-none text-left z-20 transition-colors duration-200"
                      style={{ 
                        fontFamily: 'Helvetica, sans-serif',
                        fontWeight: 400,
                        fontSize: '18px',
                        left: '18px',
                        top: '22px',
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
                      disabled={isLoading}
                    />
                    
                    {/* Eye Icon */}
                    <button 
                      type="button"
                      className="absolute w-6 h-6 sm:w-7 sm:h-7 lg:w-[28px] lg:h-[28px] right-3 sm:right-4 lg:right-[16px] top-4 sm:top-5 lg:top-[21px] rounded eye-hover"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <EyeIcon className="eye-icon w-4 h-4 sm:w-5 sm:h-5 lg:w-[21px] lg:h-[18px] text-[#ABABAB]" />
                      ) : (
                        <EyeOffIcon className="eye-icon w-4 h-4 sm:w-5 sm:h-5 lg:w-[21px] lg:h-[18px] text-[#ABABAB]" />
                      )}
                    </button>
                  </div>
                  
                  {errors.password && (
                    <p className="text-red-400 text-sm mt-1 flex items-center">
                      <span className="w-4 h-4 rounded-full bg-red-400 text-white text-xs flex items-center justify-center mr-2">!</span>
                      {errors.password}
                    </p>
                  )}
                </div>

                {/* Password Strength Indicators */}
                {formData.password && (
                  <div className="space-y-2">
                    <p className="text-white/70 text-sm font-medium">{t('passwordRequirements')}:</p>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center">
                        <div 
                          className="w-2 h-2 rounded-full mr-2"
                          style={{ backgroundColor: getStrengthColor(passwordStrength.hasMinLength) }}
                        />
                        <span style={{ color: getStrengthColor(passwordStrength.hasMinLength) }}>
                          8+ {t('symbols')}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <div 
                          className="w-2 h-2 rounded-full mr-2"
                          style={{ backgroundColor: getStrengthColor(passwordStrength.hasUpperCase) }}
                        />
                        <span style={{ color: getStrengthColor(passwordStrength.hasUpperCase) }}>
                          {t('uppercaseLetter')}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <div 
                          className="w-2 h-2 rounded-full mr-2"
                          style={{ backgroundColor: getStrengthColor(passwordStrength.hasLowerCase) }}
                        />
                        <span style={{ color: getStrengthColor(passwordStrength.hasLowerCase) }}>
                          {t('lowercaseLetter')}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <div 
                          className="w-2 h-2 rounded-full mr-2"
                          style={{ backgroundColor: getStrengthColor(passwordStrength.hasSpecialChar) }}
                        />
                        <span style={{ color: getStrengthColor(passwordStrength.hasSpecialChar) }}>
                          {t('specialCharacter')}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <div className="relative h-14 sm:h-16 lg:h-[66px]">
                  {/* Main Border Container */}
                  <div 
                    className="absolute inset-0 top-1.5 lg:top-[6px] border rounded bg-transparent transition-colors duration-200"
                    style={{
                      borderWidth: '1px',
                      borderColor: errors.confirmPassword ? '#EF4444' : (focusedField === 'confirmPassword' ? '#7177FF' : '#ABABAB')
                    }}
                  />
                  
                  {/* Subtract Effect - Label Background Cut */}
                  <div 
                    className="absolute flex items-center justify-center"
                    style={{
                      width: '140px',
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
                        color: errors.confirmPassword ? '#EF4444' : (focusedField === 'confirmPassword' ? '#7177FF' : '#ABABAB')
                      }}>
                      {t('confirmPassword')}
                    </label>
                  </div>
                  
                  {/* Confirm Password Input */}
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder={t('enterConfirmPassword')}
                    className="absolute bg-transparent text-white font-normal border-none outline-none text-left z-20 transition-colors duration-200"
                    style={{ 
                      fontFamily: 'Helvetica, sans-serif',
                      fontWeight: 400,
                      fontSize: '18px',
                      left: '18px',
                      top: '22px',
                      width: 'calc(100% - 78px)',
                      height: '24px',
                      background: 'transparent !important',
                      WebkitBoxShadow: '0 0 0 1000px transparent inset !important',
                      WebkitTextFillColor: focusedField === 'confirmPassword' ? '#FFFFFF !important' : '#ABABAB !important',
                      caretColor: focusedField === 'confirmPassword' ? '#7177FF' : '#ABABAB',
                      color: focusedField === 'confirmPassword' ? '#FFFFFF !important' : '#ABABAB !important',
                      boxShadow: '0 0 0 1000px transparent inset !important'
                    }}
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    onFocus={() => setFocusedField('confirmPassword')}
                    onBlur={() => setFocusedField(null)}
                    disabled={isLoading}
                  />
                  
                  {/* Eye Icon */}
                  <button 
                    type="button"
                    className="absolute w-6 h-6 sm:w-7 sm:h-7 lg:w-[28px] lg:h-[28px] right-3 sm:right-4 lg:right-[16px] top-4 sm:top-5 lg:top-[21px] rounded eye-hover"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? (
                      <EyeIcon className="eye-icon w-4 h-4 sm:w-5 sm:h-5 lg:w-[21px] lg:h-[18px] text-[#ABABAB]" />
                    ) : (
                      <EyeOffIcon className="eye-icon w-4 h-4 sm:w-5 sm:h-5 lg:w-[21px] lg:h-[18px] text-[#ABABAB]" />
                    )}
                  </button>
                </div>
                
                {errors.confirmPassword && (
                  <p className="text-red-400 text-sm mt-1 flex items-center">
                    <span className="w-4 h-4 rounded-full bg-red-400 text-white text-xs flex items-center justify-center mr-2">!</span>
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* General Error */}
              {errors.general && (
                <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3">
                  <p className="text-red-400 text-sm flex items-center">
                    <span className="w-4 h-4 rounded-full bg-red-400 text-white text-xs flex items-center justify-center mr-2">!</span>
                    {errors.general}
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || !passwordStrength.isValid || formData.password !== formData.confirmPassword}
                className="create-password-button w-full h-12 sm:h-14 lg:h-[60px] text-white font-bold text-base sm:text-lg md:text-xl lg:text-[24px] rounded transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: isLoading 
                    ? 'linear-gradient(135deg, #6B7280 0%, #9CA3AF 100%)'
                    : 'linear-gradient(90.67deg, #F6B8FD -7.12%, #316AD7 114.37%)',
                  fontFamily: 'Helvetica, sans-serif',
                  fontWeight: 700,
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                {isLoading ? (
                  <div className="loading-dots">
                    <div className="loading-dot"></div>
                    <div className="loading-dot"></div>
                    <div className="loading-dot"></div>
                  </div>
                ) : (
                  t('confirmChanges')
                )}
              </button>

              {/* Back to Login */}
              <div className="text-center pt-4">
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="text-[#ABABAB] hover:text-gray-300 transition-colors py-2"
                  style={{ 
                    fontFamily: 'Helvetica, sans-serif',
                    fontWeight: 400,
                    fontSize: '16px',
                    textDecoration: 'underline'
                  }}
                  disabled={isLoading}
                >
                  {t('returnToLogin')}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}