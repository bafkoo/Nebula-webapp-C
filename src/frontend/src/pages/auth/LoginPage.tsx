import { CheckIcon, EyeIcon } from "lucide-react";
import React from "react";
import gradientMainBg from "../../assets/auth/login/backgrounds/gradient-main.webp";
import logoImage from "../../assets/auth/login/logos/logo (2).png";

export default function LoginPage(): React.JSX.Element {
  return (
    <div className="relative min-h-screen w-full bg-[#252525] overflow-hidden">
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

      {/* Logo - с большим эффектом отдаления */}
      <div 
        className="absolute left-20 top-10 z-50"
        style={{
          transform: 'scale(0.8)', // больше отдаление как у остального интерфейса
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

      {/* Main Form Container - всегда сверху + больше отдаления */}
      <div 
        className="min-h-screen flex items-center justify-center px-4 py-8 lg:px-8 relative z-40"
        style={{
          transform: 'scale(0.8)', // еще больше отдаление интерфейса
          transformOrigin: 'center center'
        }}
      >
        <div className="w-full max-w-[320px] sm:max-w-[400px] md:max-w-[480px] lg:max-w-[548px] mx-auto">
          
          {/* Header Section - всегда видимый */}
          <div className="text-center mb-14 w-full max-w-[548px] mx-auto">
            <h1 className="text-white text-4xl font-bold mb-6 relative z-50">
              Welcome back, Trailblazer!
            </h1>
            <p className="text-[#ABABAB] text-xl relative z-50">
              We are excited to have your back. Log in now and access your account.
            </p>
          </div>

          {/* Form Container */}
          <div className="space-y-8 sm:space-y-12 lg:space-y-[60px]">
            
            {/* Input Fields */}
            <div className="space-y-6 lg:space-y-[56px]">
              <div className="space-y-4 lg:space-y-[24px]">
                
                {/* Email Input - точный Subtract эффект */}
                <div className="relative h-14 sm:h-16 lg:h-[66px]">
                  {/* Main Border Container */}
                  <div 
                    className="absolute inset-0 top-1.5 lg:top-[6px] border border-[#ABABAB] rounded bg-transparent"
                    style={{
                      borderWidth: '1px',
                      borderColor: '#ABABAB'
                    }}
                  />
                  
                  {/* Subtract Effect - Label Background Cut */}
                  <div 
                    className="absolute h-5 sm:h-5 lg:h-[22px] left-3 lg:left-[12px] -top-2 lg:top-[-5px] bg-[#252525] rounded-sm"
                    style={{
                      width: '133px',
                      backgroundColor: '#252525',
                      zIndex: 1
                    }}
                  />
                  
                  {/* Label */}
                  <label 
                    className="absolute left-4 sm:left-4 lg:left-[18px] -top-1 lg:top-0 text-[#ABABAB] text-xs sm:text-sm lg:text-[14px] font-normal z-10"
                    style={{ 
                      fontFamily: 'Helvetica, sans-serif',
                      fontWeight: 400
                    }}>
                    Username or Email
                  </label>
                  
                  {/* Email Value */}
                  <div 
                    className="absolute left-4 sm:left-4 lg:left-[18px] top-5 sm:top-6 lg:top-[28px] text-white text-base sm:text-lg md:text-xl lg:text-[22px] font-bold z-10"
                    style={{ 
                      fontFamily: 'Helvetica, sans-serif',
                      fontWeight: 700
                    }}>
                    muffinworks@gmail.com
                  </div>
                </div>

                {/* Password Section */}
                <div className="relative h-20 sm:h-24 lg:h-[108px]">
                  {/* Password Input Border */}
                  <div 
                    className="absolute w-full h-12 sm:h-14 lg:h-[60px] left-0 top-0 border border-[#4D4D4D] rounded bg-transparent"
                    style={{
                      borderWidth: '1px',
                      borderColor: '#4D4D4D'
                    }}
                  />
                  
                  {/* Password Input */}
                  <input
                    type="password"
                    placeholder="Password"
                    className="absolute left-4 sm:left-4 lg:left-[18px] top-3 sm:top-4 lg:top-[23px] bg-transparent text-[#ABABAB] text-sm sm:text-base lg:text-[18px] font-normal border-none outline-none w-[calc(100%-4rem)]"
                    style={{ 
                      fontFamily: 'Helvetica, sans-serif',
                      fontWeight: 400
                    }}
                  />
                  
                  {/* Eye Icon */}
                  <button className="absolute w-6 h-6 sm:w-7 sm:h-7 lg:w-[28px] lg:h-[28px] right-3 sm:right-4 lg:right-[16px] top-3 sm:top-4 lg:top-[16px] rounded">
                    <EyeIcon className="w-4 h-4 sm:w-5 sm:h-5 lg:w-[21px] lg:h-[18px] text-[#ABABAB]" />
                  </button>

                  {/* Remember me section */}
                  <div className="absolute w-full left-0 bottom-0 lg:top-[84px] flex items-center justify-between text-xs sm:text-sm lg:text-[18px]">
                    <div className="flex items-center gap-2 sm:gap-3">
                      {/* Custom Checkbox */}
                      <div 
                        className="flex items-center justify-center rounded border-0"
                        style={{
                          width: '24px',
                          height: '24px',
                          background: '#7177FF',
                          borderRadius: '4px'
                        }}
                      >
                        <CheckIcon 
                          className="text-white"
                          style={{
                            width: '18px',
                            height: '18px'
                          }}
                        />
                      </div>
                      <label 
                        className="text-[#ABABAB] font-normal cursor-pointer" 
                        style={{ 
                          fontFamily: 'Helvetica, sans-serif',
                          fontWeight: 400,
                          fontSize: '18px'
                        }}>
                        Remember me
                      </label>
                    </div>
                    <button 
                      className="text-[#ABABAB] font-normal hover:text-gray-300 transition-colors text-right"
                      style={{ 
                        fontFamily: 'Helvetica, sans-serif',
                        fontWeight: 400,
                        fontSize: '18px',
                        textDecoration: 'underline'
                      }}>
                      Forgot your password?
                    </button>
                  </div>
                </div>
              </div>

              {/* Login Button - точный градиент */}
              <button 
                className="w-full h-12 sm:h-14 lg:h-[60px] text-white font-bold text-base sm:text-lg md:text-xl lg:text-[24px] rounded transition-all hover:opacity-90 active:scale-[0.98]"
                style={{
                  background: 'linear-gradient(90.67deg, #F6B8FD -7.12%, #316AD7 114.37%)',
                  fontFamily: 'Helvetica, sans-serif',
                  fontWeight: 700,
                  fontSize: '24px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                Log In
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
                  or
                </span>
              </div>
            </div>

            {/* Social Buttons - точные размеры */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 lg:gap-[12px] w-full">
              {/* Google Button */}
              <button
                className="flex flex-row justify-center items-center h-12 sm:h-14 lg:h-[60px] border bg-transparent hover:bg-gray-800/20 transition-colors rounded p-2 sm:p-3"
                style={{ 
                  borderWidth: '1px',
                  borderColor: '#4D4D4D',
                  filter: 'drop-shadow(0px 1px 2px rgba(16, 24, 40, 0.05))',
                  borderRadius: '8px',
                  width: '174.67px',
                  cursor: 'pointer'
                }}
              >
                <GoogleIcon className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" />
              </button>
              
              {/* Facebook Button */}
              <button
                className="flex flex-row justify-center items-center h-12 sm:h-14 lg:h-[60px] border bg-transparent hover:bg-gray-800/20 transition-colors rounded p-2 sm:p-3"
                style={{ 
                  borderWidth: '1px',
                  borderColor: '#4D4D4D',
                  filter: 'drop-shadow(0px 1px 2px rgba(16, 24, 40, 0.05))',
                  borderRadius: '8px',
                  width: '174.67px',
                  cursor: 'pointer'
                }}
              >
                <FacebookIcon className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" />
              </button>
              
              {/* Apple Button */}
              <button
                className="flex flex-row justify-center items-center h-12 sm:h-14 lg:h-[60px] border bg-transparent hover:bg-gray-800/20 transition-colors rounded p-2 sm:p-3"
                style={{ 
                  borderWidth: '1px',
                  borderColor: '#4D4D4D',
                  filter: 'drop-shadow(0px 1px 2px rgba(16, 24, 40, 0.05))',
                  borderRadius: '8px',
                  width: '174.67px',
                  cursor: 'pointer'
                }}
              >
                <AppleIcon className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Links - отступ 80px от края */}
      <div 
        className="absolute bottom-12 z-50"
        style={{
          left: '80px',
          right: '80px'
        }}
      >
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-sm sm:text-base lg:text-[18px]">
          <div className="text-center sm:text-left">
            <span 
              className="text-white" 
              style={{ 
                fontFamily: 'Helvetica, sans-serif',
                fontWeight: 400,
                fontSize: '18px'
              }}>
              Don't have an account yet? 
            </span>
            <button 
              className="font-bold text-white hover:text-gray-300 transition-colors ml-1"
              style={{ 
                fontFamily: 'Helvetica, sans-serif',
                fontWeight: 700,
                fontSize: '18px'
              }}>
              Register
            </button>
          </div>
          <button 
            className="text-[#ABABAB] hover:text-gray-300 transition-colors"
            style={{ 
              fontFamily: 'Helvetica, sans-serif',
              fontWeight: 400,
              fontSize: '18px',
              textDecoration: 'underline'
            }}>
            Contact Support
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

// Facebook Icon component - оригинальный дизайн
function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill="#1877F2"/>
      <path d="M16.671 15.543l.532-3.47h-3.328v-2.25c0-.949.465-1.874 1.956-1.874h1.513V4.996s-1.374-.235-2.686-.235c-2.741 0-4.533 1.662-4.533 4.669v2.632H7.078v3.47h3.047v8.385a12.118 12.118 0 003.75 0v-8.385h2.796z" fill="#FFFFFF"/>
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