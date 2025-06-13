import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, useParams } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

// Import images
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

const NewPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { token: paramToken } = useParams();
  const [formData, setFormData] = useState<FormData>({
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({
    hasMinLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasSpecialChar: false,
    isValid: false
  });
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isValidToken, setIsValidToken] = useState(true);
  const [isCheckingToken, setIsCheckingToken] = useState(true);

  // Get reset token from URL parameters or query string
  // In real application, this would come from email link like:
  // https://yourapp.com/reset-password/abc123token or
  // https://yourapp.com/new-password?token=abc123token
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
        
        // In real app, this would be:
        // const response = await verifyResetToken(resetToken);
        // setIsValidToken(response.valid);
        
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
        setIsFormVisible(true);
      }, 300);
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear specific error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (!passwordStrength.isValid) {
      newErrors.password = 'Password does not meet requirements';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
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
      // Simulate API call with reset token
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In real app, this would be:
      // const response = await resetPassword({
      //   token: resetToken,
      //   newPassword: formData.password
      // });
      
      // Success - navigate to login with success message
      navigate('/login', { 
        state: { 
          message: 'Password updated successfully! Please log in with your new password.',
          type: 'success'
        }
      });
    } catch {
      setErrors({ 
        general: 'Failed to update password. Please try again or request a new reset link.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStrengthColor = (isValid: boolean) => {
    return isValid ? '#10B981' : '#EF4444';
  };

  // Loading screen while checking token
  if (isCheckingToken) {
    return (
      <div className="min-h-screen w-full relative overflow-hidden bg-[#252525] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4">
            <div className="w-full h-full border-4 border-white/20 border-t-white rounded-full animate-spin"></div>
          </div>
          <p className="text-white text-lg" style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}>
            Verifying reset link...
          </p>
        </div>
      </div>
    );
  }

  // Invalid token screen
  if (!isValidToken) {
    return (
      <div className="min-h-screen w-full relative overflow-hidden bg-[#252525] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-20 h-20 mx-auto mb-6 bg-red-500 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          
          <h1 
            className="text-white text-3xl font-bold mb-4"
            style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
          >
            Invalid Reset Link
          </h1>
          
          <p 
            className="text-white/70 text-lg mb-8"
            style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
          >
            This password reset link is invalid or has expired. Please request a new password reset.
          </p>

          <div className="space-y-4">
            <button
              onClick={() => navigate('/reset-password')}
              className="w-full h-[60px] rounded-lg text-white text-xl font-bold transition-all duration-300 hover:transform hover:-translate-y-1"
              style={{
                background: 'linear-gradient(135deg, #7177FF 0%, #9B87F5 25%, #E879F9 75%, #F472B6 100%)',
                fontFamily: 'Helvetica, Arial, sans-serif',
                fontWeight: 700
              }}
            >
              Request New Reset Link
            </button>

            <button
              onClick={() => navigate('/login')}
              className="w-full text-white/70 hover:text-white text-lg transition-colors py-3"
              style={{ fontFamily: 'Helvetica, Arial, sans-serif' }}
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      {/* Background Container */}
      <div 
        className="fixed inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${newPasswordBackground})`,
          backgroundPosition: 'center center',
          backgroundAttachment: 'fixed',
          transform: 'scale(1.08)',
          transformOrigin: 'center center'
        }}
      />

      {/* Overlay for better contrast */}
      <div className="fixed inset-0 bg-black bg-opacity-30" />

      {/* Content Container */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-[576px] mx-auto">
          {/* Logo Section */}
          <div 
            className={`flex items-center justify-center mb-8 transition-all duration-1000 ease-out ${
              isFormVisible 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-8'
            }`}
            style={{ transform: 'scale(0.8)' }}
          >
            <div className="flex items-center">
              <img 
                src={logoImage} 
                alt="Nebula Logo" 
                className="w-[50px] h-[50px] mr-3"
              />
              <span 
                className="text-white font-bold text-2xl"
                style={{ 
                  fontFamily: 'Helvetica, Arial, sans-serif',
                  fontWeight: 700
                }}
              >
                Nebula
              </span>
            </div>
          </div>

          {/* Main Form Card */}
          <div 
            className={`transition-all duration-1000 ease-out ${
              isFormVisible 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-12'
            }`}
          >
            <div className="backdrop-blur-sm bg-black/20 rounded-2xl p-8 border border-white/10">
              {/* Header Section */}
              <div className="text-center mb-8">
                <h1 
                  className="text-white text-[40px] font-bold mb-4"
                  style={{ 
                    fontFamily: 'Helvetica, Arial, sans-serif',
                    fontWeight: 700,
                    lineHeight: '1.2'
                  }}
                >
                  Create New Password
                </h1>
                <p 
                  className="text-white/70 text-lg leading-relaxed max-w-md mx-auto"
                  style={{ 
                    fontFamily: 'Helvetica, Arial, sans-serif',
                    fontWeight: 400
                  }}
                >
                  Type your new strong password. Your password must include: One capital letter & one small letter at least, One special character & Minimum 8 digits long.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Password Field */}
                <div className="space-y-2">
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      placeholder="New Password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`w-full h-[60px] px-4 pr-12 bg-transparent border rounded-lg text-white placeholder-white/50 text-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#7177FF] focus:border-transparent ${
                        errors.password 
                          ? 'border-red-500 focus:ring-red-500' 
                          : 'border-white/30 hover:border-white/50'
                      }`}
                      style={{ 
                        fontFamily: 'Helvetica, Arial, sans-serif',
                        fontWeight: 400
                      }}
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-white/60 hover:text-white transition-colors duration-200"
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
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
                    <p className="text-white/70 text-sm font-medium">Password Requirements:</p>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center">
                        <div 
                          className="w-2 h-2 rounded-full mr-2"
                          style={{ backgroundColor: getStrengthColor(passwordStrength.hasMinLength) }}
                        />
                        <span style={{ color: getStrengthColor(passwordStrength.hasMinLength) }}>
                          8+ characters
                        </span>
                      </div>
                      <div className="flex items-center">
                        <div 
                          className="w-2 h-2 rounded-full mr-2"
                          style={{ backgroundColor: getStrengthColor(passwordStrength.hasUpperCase) }}
                        />
                        <span style={{ color: getStrengthColor(passwordStrength.hasUpperCase) }}>
                          Uppercase letter
                        </span>
                      </div>
                      <div className="flex items-center">
                        <div 
                          className="w-2 h-2 rounded-full mr-2"
                          style={{ backgroundColor: getStrengthColor(passwordStrength.hasLowerCase) }}
                        />
                        <span style={{ color: getStrengthColor(passwordStrength.hasLowerCase) }}>
                          Lowercase letter
                        </span>
                      </div>
                      <div className="flex items-center">
                        <div 
                          className="w-2 h-2 rounded-full mr-2"
                          style={{ backgroundColor: getStrengthColor(passwordStrength.hasSpecialChar) }}
                        />
                        <span style={{ color: getStrengthColor(passwordStrength.hasSpecialChar) }}>
                          Special character
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Confirm Password Field */}
                <div className="space-y-2">
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      placeholder="Confirm New Password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className={`w-full h-[60px] px-4 pr-12 bg-transparent border rounded-lg text-white placeholder-white/50 text-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#7177FF] focus:border-transparent ${
                        errors.confirmPassword 
                          ? 'border-red-500 focus:ring-red-500' 
                          : 'border-white/30 hover:border-white/50'
                      }`}
                      style={{ 
                        fontFamily: 'Helvetica, Arial, sans-serif',
                        fontWeight: 400
                      }}
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-white/60 hover:text-white transition-colors duration-200"
                      disabled={isLoading}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
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
                  className="w-full h-[60px] rounded-lg text-white text-xl font-bold transition-all duration-300 ease-out disabled:opacity-50 disabled:cursor-not-allowed hover:transform hover:-translate-y-1 hover:shadow-[0_10px_30px_rgba(113,119,255,0.3)] active:transform active:translate-y-0"
                  style={{
                    background: isLoading 
                      ? 'linear-gradient(135deg, #6B7280 0%, #9CA3AF 100%)'
                      : 'linear-gradient(135deg, #7177FF 0%, #9B87F5 25%, #E879F9 75%, #F472B6 100%)',
                    fontFamily: 'Helvetica, Arial, sans-serif',
                    fontWeight: 700,
                    boxShadow: '0 4px 15px rgba(113, 119, 255, 0.2)'
                  }}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                      </div>
                    </div>
                  ) : (
                    'Confirm Changes'
                  )}
                </button>

                {/* Back to Login */}
                <div className="text-center pt-4">
                  <button
                    type="button"
                    onClick={() => navigate('/login')}
                    className="text-white/70 hover:text-white text-sm transition-colors duration-200"
                    style={{ 
                      fontFamily: 'Helvetica, Arial, sans-serif',
                      fontWeight: 400
                    }}
                    disabled={isLoading}
                  >
                    Back to Login
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Responsive Styles */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @media (max-width: 640px) {
            .backdrop-blur-sm {
              margin: 1rem;
              padding: 1.5rem;
            }
          }

          @media (min-width: 641px) and (max-width: 1024px) {
            .fixed.inset-0 {
              background-position: center center !important;
              background-attachment: scroll !important;
              transform: scale(1.1) !important;
            }
          }

          @media (min-width: 1025px) and (max-width: 1440px) {
            .fixed.inset-0 {
              background-position: center center !important;
              background-attachment: fixed !important;
              transform: scale(1.08) !important;
            }
          }

          @media (min-width: 1441px) and (max-width: 1920px) {
            .fixed.inset-0 {
              background-position: center center !important;
              transform: scale(1.05) !important;
            }
          }

          @media (min-width: 1921px) {
            .fixed.inset-0 {
              background-size: cover !important;
              background-position: center center !important;
              transform: scale(1.02) !important;
            }
          }

          @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
            .fixed.inset-0 {
              transform: scale(1.06) !important;
            }
          }

          input:-webkit-autofill,
          input:-webkit-autofill:hover,
          input:-webkit-autofill:focus {
            -webkit-box-shadow: 0 0 0 1000px transparent inset !important;
            -webkit-text-fill-color: white !important;
            transition: background-color 5000s ease-in-out 0s;
          }

          input[type="password"]::-ms-reveal,
          input[type="password"]::-ms-clear {
            display: none;
          }
        `
      }} />
    </div>
  );
};

export default NewPasswordPage;