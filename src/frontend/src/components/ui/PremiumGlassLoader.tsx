import React from 'react';
import logoImage from '../../assets/auth/login/logos/logo (2).png';

interface PremiumGlassLoaderProps {
  size?: number;
  showText?: boolean;
  message?: string;
  className?: string;
}

export default function PremiumGlassLoader({ 
  size = 140, 
  showText = true, 
  message = 'Загрузка...',
  className = ''
}: PremiumGlassLoaderProps): React.JSX.Element {
  
  const styles = `
    .premium-glass-loader {
      width: ${size}px;
      height: ${size}px;
      background: linear-gradient(
        165deg,
        rgba(113, 119, 255, 0.95) 0%,
        rgba(113, 119, 255, 0.8) 15%,
        rgba(246, 184, 253, 0.7) 35%,
        rgba(246, 184, 253, 0.5) 55%,
        rgba(113, 119, 255, 0.4) 75%,
        rgba(10, 10, 10, 0.9) 100%
      );
      border-radius: 50%;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      box-shadow: 
        0 0 30px rgba(113, 119, 255, 0.4),
        0 0 60px rgba(246, 184, 253, 0.2),
        inset 0 0 30px rgba(255, 255, 255, 0.1);
    }

    /* Основной вращающийся слой теней */
    .premium-glass-loader:before {
      position: absolute;
      content: "";
      width: 100%;
      height: 100%;
      border-radius: 100%;
      border-bottom: 0 solid rgba(113, 119, 255, 0.02);
      box-shadow: 
        0 -12px 25px 25px rgba(113, 119, 255, 0.3) inset,
        0 -6px 18px 12px rgba(113, 119, 255, 0.4) inset, 
        0 -3px 8px rgba(113, 119, 255, 0.6) inset,
        0 -4px 3px rgba(246, 184, 253, 0.8) inset, 
        0 3px 0px rgba(246, 184, 253, 0.9), 
        0 3px 4px rgba(246, 184, 253, 0.7),
        0 6px 8px rgba(113, 119, 255, 0.7), 
        0 12px 20px rgba(113, 119, 255, 0.5), 
        0 15px 25px 25px rgba(113, 119, 255, 0.3);
      filter: blur(1.5px);
      animation: 3.5s premiumGlassRotate linear infinite;
      z-index: 1;
    }

    /* Дополнительный слой внутреннего свечения */
    .premium-glass-loader:after {
      position: absolute;
      content: "";
      width: 85%;
      height: 85%;
      border-radius: 100%;
      background: radial-gradient(
        circle at 25% 25%,
        rgba(255, 255, 255, 0.9) 0%,
        rgba(255, 255, 255, 0.6) 15%,
        rgba(113, 119, 255, 0.4) 30%,
        rgba(246, 184, 253, 0.3) 50%,
        rgba(113, 119, 255, 0.2) 70%,
        transparent 85%
      );
      animation: 5s premiumGlassShimmer ease-in-out infinite;
      z-index: 2;
    }

    /* Контейнер для логотипа с множественными анимациями */
    .premium-logo-container {
      position: relative;
      z-index: 4;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 65%;
      height: 65%;
      animation: 
        3s premiumLogoFloat ease-in-out infinite alternate,
        6s premiumLogoRotate ease-in-out infinite,
        4s premiumLogoPulse ease-in-out infinite;
    }

    /* Основной логотип с продвинутыми эффектами */
    .premium-nebula-logo {
      width: 100%;
      height: 100%;
      object-fit: contain;
      filter: 
        drop-shadow(0 0 15px rgba(113, 119, 255, 0.8))
        drop-shadow(0 0 25px rgba(246, 184, 253, 0.6))
        drop-shadow(0 0 35px rgba(255, 255, 255, 0.3))
        brightness(1.3)
        contrast(1.2)
        saturate(1.1);
      animation: 
        4s premiumLogoGlow ease-in-out infinite,
        8s premiumLogoColorShift ease-in-out infinite,
        2.5s premiumLogoBreath ease-in-out infinite;
      transform-origin: center center;
    }

    /* Дополнительные слои эффектов для логотипа */
    .premium-logo-container:before {
      content: '';
      position: absolute;
      width: 120%;
      height: 120%;
      background: radial-gradient(
        circle,
        rgba(113, 119, 255, 0.2) 0%,
        rgba(246, 184, 253, 0.15) 30%,
        transparent 60%
      );
      border-radius: 50%;
      animation: 3s premiumLogoAura ease-in-out infinite;
      z-index: -1;
    }

    .premium-logo-container:after {
      content: '';
      position: absolute;
      width: 100%;
      height: 100%;
      background: conic-gradient(
        from 0deg,
        rgba(113, 119, 255, 0.3) 0deg,
        rgba(246, 184, 253, 0.3) 120deg,
        rgba(255, 255, 255, 0.2) 240deg,
        rgba(113, 119, 255, 0.3) 360deg
      );
      border-radius: 50%;
      animation: 4s premiumLogoSpectrum linear infinite;
      z-index: -1;
      opacity: 0.6;
    }

    /* Текст с улучшенными эффектами */
    .premium-glass-text {
      background: linear-gradient(
        45deg,
        #7177FF 0%,
        #F6B8FD 20%,
        #FFFFFF 40%,
        #F6B8FD 60%,
        #7177FF 80%,
        #F6B8FD 100%
      );
      background-size: 300% auto;
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      animation: premiumTextShimmer 3s linear infinite;
      text-shadow: 
        0 0 20px rgba(113, 119, 255, 0.6),
        0 0 40px rgba(246, 184, 253, 0.4);
      filter: drop-shadow(0 0 10px rgba(113, 119, 255, 0.5));
    }

    .premium-loading-dots {
      display: inline-flex;
      gap: 6px;
      margin-left: 10px;
    }
    
    .premium-loading-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: linear-gradient(45deg, #7177FF, #F6B8FD);
      animation: premiumLoadingBounce 1.6s infinite both;
      box-shadow: 
        0 0 15px rgba(113, 119, 255, 0.6),
        0 0 25px rgba(246, 184, 253, 0.4);
    }
    
    .premium-loading-dot:nth-child(1) { animation-delay: -0.4s; }
    .premium-loading-dot:nth-child(2) { animation-delay: -0.2s; }
    .premium-loading-dot:nth-child(3) { animation-delay: 0s; }

    /* Анимации для стеклянного эффекта */
    @keyframes premiumGlassRotate {
      100% { 
        transform: rotate(360deg);
      }
    }

    @keyframes premiumGlassShimmer {
      0%, 100% {
        opacity: 0.4;
        transform: rotate(0deg) scale(1);
      }
      25% {
        opacity: 0.8;
        transform: rotate(90deg) scale(1.1);
      }
      50% {
        opacity: 0.6;
        transform: rotate(180deg) scale(0.95);
      }
      75% {
        opacity: 0.9;
        transform: rotate(270deg) scale(1.05);
      }
    }

    /* Продвинутые анимации логотипа */
    @keyframes premiumLogoFloat {
      0% {
        transform: translateY(0px) translateX(0px);
      }
      100% {
        transform: translateY(-4px) translateX(2px);
      }
    }

    @keyframes premiumLogoRotate {
      0%, 100% {
        transform: rotate(0deg);
      }
      25% {
        transform: rotate(2deg);
      }
      50% {
        transform: rotate(0deg);
      }
      75% {
        transform: rotate(-2deg);
      }
    }

    @keyframes premiumLogoPulse {
      0%, 100% {
        transform: scale(1);
      }
      50% {
        transform: scale(1.08);
      }
    }

    @keyframes premiumLogoGlow {
      0%, 100% {
        filter: 
          drop-shadow(0 0 15px rgba(113, 119, 255, 0.8))
          drop-shadow(0 0 25px rgba(246, 184, 253, 0.6))
          drop-shadow(0 0 35px rgba(255, 255, 255, 0.3))
          brightness(1.3)
          contrast(1.2)
          saturate(1.1);
      }
      33% {
        filter: 
          drop-shadow(0 0 25px rgba(113, 119, 255, 1))
          drop-shadow(0 0 40px rgba(246, 184, 253, 0.8))
          drop-shadow(0 0 50px rgba(255, 255, 255, 0.5))
          brightness(1.5)
          contrast(1.3)
          saturate(1.3);
      }
      66% {
        filter: 
          drop-shadow(0 0 20px rgba(246, 184, 253, 0.9))
          drop-shadow(0 0 35px rgba(113, 119, 255, 0.7))
          drop-shadow(0 0 45px rgba(255, 255, 255, 0.4))
          brightness(1.4)
          contrast(1.25)
          saturate(1.2);
      }
    }

    @keyframes premiumLogoColorShift {
      0%, 100% {
        filter: 
          hue-rotate(0deg)
          drop-shadow(0 0 15px rgba(113, 119, 255, 0.8))
          brightness(1.3);
      }
      25% {
        filter: 
          hue-rotate(15deg)
          drop-shadow(0 0 20px rgba(246, 184, 253, 0.8))
          brightness(1.4);
      }
      50% {
        filter: 
          hue-rotate(30deg)
          drop-shadow(0 0 25px rgba(255, 255, 255, 0.6))
          brightness(1.5);
      }
      75% {
        filter: 
          hue-rotate(15deg)
          drop-shadow(0 0 20px rgba(113, 119, 255, 0.9))
          brightness(1.4);
      }
    }

    @keyframes premiumLogoBreath {
      0%, 100% {
        opacity: 1;
        transform: scale(1);
      }
      50% {
        opacity: 0.9;
        transform: scale(1.02);
      }
    }

    @keyframes premiumLogoAura {
      0%, 100% {
        opacity: 0.3;
        transform: scale(1) rotate(0deg);
      }
      50% {
        opacity: 0.7;
        transform: scale(1.2) rotate(180deg);
      }
    }

    @keyframes premiumLogoSpectrum {
      0% {
        transform: rotate(0deg);
        opacity: 0.6;
      }
      100% {
        transform: rotate(360deg);
        opacity: 0.6;
      }
    }

    @keyframes premiumTextShimmer {
      0% {
        background-position: -300% center;
      }
      100% {
        background-position: 300% center;
      }
    }

    @keyframes premiumLoadingBounce {
      0%, 80%, 100% {
        transform: scale(0.8);
        opacity: 0.8;
      }
      40% {
        transform: scale(1.2);
        opacity: 1;
      }
    }

    /* Дополнительные световые эффекты */
    .premium-glass-loader-container {
      position: relative;
      display: inline-block;
    }

    .premium-glass-loader-container:before {
      content: '';
      position: absolute;
      top: -25px;
      left: -25px;
      right: -25px;
      bottom: -25px;
      background: radial-gradient(
        circle,
        rgba(113, 119, 255, 0.15) 0%,
        rgba(246, 184, 253, 0.1) 25%,
        rgba(255, 255, 255, 0.05) 50%,
        transparent 75%
      );
      border-radius: 50%;
      animation: 6s premiumAmbientGlow ease-in-out infinite;
      z-index: 0;
    }

    .premium-glass-loader-container:after {
      content: '';
      position: absolute;
      top: -15px;
      left: -15px;
      right: -15px;
      bottom: -15px;
      background: conic-gradient(
        from 0deg,
        rgba(113, 119, 255, 0.2) 0deg,
        rgba(246, 184, 253, 0.2) 120deg,
        rgba(255, 255, 255, 0.1) 240deg,
        rgba(113, 119, 255, 0.2) 360deg
      );
      border-radius: 50%;
      animation: 8s premiumAmbientRotate linear infinite reverse;
      z-index: 0;
      opacity: 0.7;
    }

    @keyframes premiumAmbientGlow {
      0%, 100% {
        opacity: 0.4;
        transform: scale(1);
      }
      33% {
        opacity: 0.7;
        transform: scale(1.3);
      }
      66% {
        opacity: 0.5;
        transform: scale(0.9);
      }
    }

    @keyframes premiumAmbientRotate {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }
  `;

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      
      <div className="premium-glass-loader-container">
        <div className="premium-glass-loader">
          <div className="premium-logo-container">
            <img 
              src={logoImage}
              alt="Nebula Logo"
              className="premium-nebula-logo"
            />
          </div>
        </div>
      </div>

      {/* Текст с улучшенными эффектами */}
      {showText && (
        <div className="mt-8 text-center">
          <h2 
            className="premium-glass-text font-bold text-2xl mb-3"
            style={{
              fontFamily: "'gg sans', 'Whitney', 'Helvetica Neue', Helvetica, Arial, sans-serif",
              fontWeight: 700,
              letterSpacing: '-0.02em'
            }}
          >
            Nebula
          </h2>
          
          <div className="flex items-center justify-center">
            <span 
              className="text-white/90 text-lg"
              style={{ 
                fontFamily: 'Helvetica, sans-serif',
                fontWeight: 400,
                textShadow: '0 0 10px rgba(113, 119, 255, 0.3)'
              }}
            >
              {message}
            </span>
            <div className="premium-loading-dots">
              <div className="premium-loading-dot"></div>
              <div className="premium-loading-dot"></div>
              <div className="premium-loading-dot"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 