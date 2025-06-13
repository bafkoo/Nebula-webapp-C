import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Apple, CheckIcon, EyeIcon, Facebook } from "lucide-react";
import React from "react";
import gradientMainBg from "../../assets/auth/login/backgrounds/gradient-main.webp";

export default function LoginPage(): React.JSX.Element {
  // Social login options data
  const socialLogins = [
    { icon: <GoogleIcon className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" />, name: "Google" },
    { icon: <Facebook className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" />, name: "Facebook" },
    { icon: <Apple className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8" />, name: "Apple" },
  ];

  return (
    <div className="relative min-h-screen w-full bg-[#252525] overflow-hidden">
      {/* Background image - responsive */}
      <div 
        className="absolute inset-0 w-full h-full"
        style={{ 
          background: `linear-gradient(0deg, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)), url(${gradientMainBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />

      {/* Decorative gradient elements - только для больших экранов */}
      <div 
        className="hidden xl:block absolute w-[940.94px] h-[1462.52px] top-[535px]"
        style={{
          left: 'calc(50% - 940.94px/2 - 227.05px)',
          background: 'linear-gradient(45deg, rgba(114, 244, 250, 0.3) 0%, rgba(251, 251, 251, 0.1) 100%)',
          mixBlendMode: 'plus-lighter',
          filter: 'blur(104.65px)',
          transform: 'matrix(-0.03, -1, 1, 0, 0, 0)'
        }}
      />

      <div 
        className="hidden xl:block absolute w-[675.22px] h-[1011.17px] top-[326.59px]"
        style={{
          left: 'calc(50% - 675.22px/2 - 130.39px)',
          background: 'linear-gradient(135deg, rgba(114, 244, 250, 0.2) 0%, rgba(251, 251, 251, 0.05) 100%)',
          mixBlendMode: 'color-dodge',
          filter: 'blur(57.1px)',
          transform: 'matrix(-0.11, -0.99, 1, -0.01, 0, 0)'
        }}
      />

      {/* Logo - адаптивное позиционирование */}
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 lg:top-12 lg:left-20 z-10">
        <div className="flex items-center gap-1 sm:gap-2">
          <div className="w-3 h-3 sm:w-4 sm:h-4 lg:w-[18px] lg:h-[18px] bg-white rounded-full" />
          <div 
            className="w-4 h-4 sm:w-5 sm:h-5 lg:w-[24.98px] lg:h-[24.98px] bg-white"
            style={{ transform: 'rotate(-89.93deg)' }}
          />
        </div>
      </div>

      {/* Main content container - нормальное центрирование */}
      <div className="min-h-screen flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-[400px] sm:max-w-[480px] lg:max-w-[548px] space-y-8 lg:space-y-14">
          
          {/* Header section - адаптивные размеры */}
          <div className="text-center space-y-4 lg:space-y-6">
            <h1 className="text-2xl sm:text-3xl lg:text-[40px] font-bold leading-tight lg:leading-[46px] text-white">
              Welcome back, Trailblazer!
            </h1>
            <p className="text-base sm:text-lg lg:text-[20px] font-normal leading-relaxed lg:leading-[23px] text-[#ABABAB]">
              We are excited to have your back. Log in now and access your account.
            </p>
          </div>

          {/* Form container - адаптивные отступы */}
          <div className="space-y-8 lg:space-y-[60px]">
            {/* Input fields container */}
            <div className="space-y-6 lg:space-y-[56px]">
              {/* Inputs section */}
              <div className="space-y-4 lg:space-y-[24px]">
                {/* Email input - адаптивная высота и размеры */}
                <div className="relative h-14 sm:h-16 lg:h-[66px]">
                  <div className="absolute inset-0 top-1 lg:top-[6px] border border-[#ABABAB] rounded bg-transparent" />
                  <div className="absolute w-32 sm:w-36 lg:w-[133px] h-5 sm:h-6 lg:h-[22px] left-3 lg:left-[12px] -top-2 lg:top-[-5px] bg-[#313131] rounded" />
                  <label className="absolute left-4 sm:left-5 lg:left-[18px] -top-1 lg:top-0 text-[#ABABAB] text-xs sm:text-sm lg:text-[14px] font-normal">
                    Username or Email
                  </label>
                  <input
                    type="email"
                    className="absolute left-4 sm:left-5 lg:left-[18px] top-6 sm:top-7 lg:top-[28px] bg-transparent text-white text-lg sm:text-xl lg:text-[22px] font-bold border-none outline-none w-[calc(100%-2rem)] lg:w-[calc(100%-2.25rem)]"
                    defaultValue="muffinworks@gmail.com"
                  />
                </div>

                {/* Password section - адаптивные размеры */}
                <div className="relative h-20 sm:h-24 lg:h-[108px]">
                  {/* Password input */}
                  <div className="absolute w-full h-12 sm:h-14 lg:h-[60px] left-0 top-0 border border-[#4D4D4D] rounded bg-transparent" />
                  <input
                    type="password"
                    placeholder="Password"
                    className="absolute left-4 sm:left-5 lg:left-[18px] top-3 sm:top-4 lg:top-[23px] bg-transparent text-[#ABABAB] text-base sm:text-lg lg:text-[18px] font-normal border-none outline-none w-[calc(100%-4rem)]"
                  />
                  <button className="absolute w-6 h-6 sm:w-7 sm:h-7 lg:w-[28px] lg:h-[28px] right-3 sm:right-4 lg:right-[16px] top-3 sm:top-4 lg:top-[16px] rounded">
                    <EyeIcon className="w-5 h-4 sm:w-6 sm:h-5 lg:w-[21px] lg:h-[18px] text-[#ABABAB]" />
                  </button>

                  {/* Remember me section */}
                  <div className="absolute w-full left-0 bottom-0 lg:top-[84px] flex items-center justify-between text-sm sm:text-base lg:text-[18px]">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="w-5 h-5 sm:w-6 sm:h-6 lg:w-[24px] lg:h-[24px] bg-[#7177FF] rounded flex items-center justify-center">
                        <CheckIcon className="w-3 h-3 sm:w-4 sm:h-4 lg:w-[18px] lg:h-[18px] text-white" />
                      </div>
                      <label className="text-[#ABABAB] font-normal">
                        Remember me
                      </label>
                    </div>
                    <button className="text-[#ABABAB] font-normal hover:text-gray-300 transition-colors">
                      Forgot your password?
                    </button>
                  </div>
                </div>
              </div>

              {/* Login button - адаптивные размеры */}
              <Button 
                className="w-full h-12 sm:h-14 lg:h-[60px] text-white font-bold text-lg sm:text-xl lg:text-[24px] border-none"
                style={{
                  background: 'linear-gradient(90.67deg, #F6B8FD -7.12%, #316AD7 114.37%)'
                }}
              >
                Log In
              </Button>
            </div>

            {/* Separator - адаптивный */}
            <div className="relative py-4">
              <hr className="border-[#4D4D4D]" />
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#313131] px-3 py-1 rounded">
                <span className="text-[#ABABAB] text-sm sm:text-base lg:text-[18px] font-normal">
                  or
                </span>
              </div>
            </div>

            {/* Social buttons - адаптивная сетка */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 lg:gap-[12px] w-full">
              {socialLogins.map((social, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="h-12 sm:h-14 lg:h-[60px] border-[#4D4D4D] bg-transparent hover:bg-gray-800/20 transition-colors"
                  style={{ filter: 'drop-shadow(0px 1px 2px rgba(16, 24, 40, 0.05))' }}
                >
                  {social.icon}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom text links - адаптивное позиционирование */}
      <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 z-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 text-sm sm:text-base lg:text-[18px]">
          <div className="text-center sm:text-left">
            <span className="text-white">Don't have an account yet? </span>
            <button className="font-bold text-white hover:text-gray-300 transition-colors">Register</button>
          </div>
          <button className="text-[#ABABAB] underline hover:text-gray-300 transition-colors">
            Contact Support
          </button>
        </div>
      </div>

      {/* Decorative elements - только для больших экранов */}
      <div 
        className="hidden xl:block absolute w-[195.04px] h-[123.36px] left-[calc(50%-646.51px)] top-[1053.93px]"
        style={{ transform: 'rotate(-169.81deg)' }}
      >
        <div className="w-full h-full bg-gradient-to-tr from-cyan-400/20 via-white/10 to-transparent rounded-full opacity-30" />
      </div>

      <div 
        className="hidden xl:block absolute w-[227.72px] h-[162.64px] right-[50px] top-[74px]"
        style={{ transform: 'rotate(60.61deg)' }}
      >
        <div className="w-full h-full bg-gradient-to-br from-cyan-400/20 via-white/10 to-transparent rounded-full opacity-30" />
      </div>
    </div>
  );
}

// Google Icon component
function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
} 