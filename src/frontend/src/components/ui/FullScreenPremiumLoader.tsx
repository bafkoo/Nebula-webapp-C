import React from 'react';
import PremiumGlassLoader from './PremiumGlassLoader';

interface FullScreenPremiumLoaderProps {
  message?: string;
  size?: number;
  background?: string;
}

export default function FullScreenPremiumLoader({ 
  message = 'Загрузка...', 
  size = 200,
  background = '#252525'
}: FullScreenPremiumLoaderProps): React.JSX.Element {
  
  const styles = `
    .fullscreen-premium-loader {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      z-index: 9999;
      backdrop-filter: blur(20px);
      background: ${background};
      background-image: 
        radial-gradient(circle at 15% 85%, rgba(113, 119, 255, 0.15) 0%, transparent 50%),
        radial-gradient(circle at 85% 15%, rgba(246, 184, 253, 0.15) 0%, transparent 50%),
        radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.05) 0%, transparent 50%),
        radial-gradient(circle at 30% 30%, rgba(113, 119, 255, 0.08) 0%, transparent 40%),
        radial-gradient(circle at 70% 70%, rgba(246, 184, 253, 0.08) 0%, transparent 40%);
    }

    .premium-loader-background {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: radial-gradient(
        circle at 50% 50%,
        rgba(113, 119, 255, 0.12) 0%,
        rgba(246, 184, 253, 0.08) 25%,
        rgba(255, 255, 255, 0.03) 50%,
        transparent 75%
      );
      animation: premiumBackgroundPulse 8s ease-in-out infinite;
    }

    .floating-premium-particles {
      position: absolute;
      width: 100%;
      height: 100%;
      overflow: hidden;
    }

    .premium-particle {
      position: absolute;
      border-radius: 50%;
      pointer-events: none;
      opacity: 0.2;
      animation: floatPremiumParticle linear infinite;
    }

    .premium-particle-1 {
      background: radial-gradient(
        circle,
        rgba(113, 119, 255, 0.9) 0%,
        rgba(113, 119, 255, 0.6) 40%,
        transparent 80%
      );
      box-shadow: 
        0 0 30px rgba(113, 119, 255, 0.4),
        inset 0 0 20px rgba(113, 119, 255, 0.3);
    }

    .premium-particle-2 {
      background: radial-gradient(
        circle,
        rgba(246, 184, 253, 0.9) 0%,
        rgba(246, 184, 253, 0.6) 40%,
        transparent 80%
      );
      box-shadow: 
        0 0 30px rgba(246, 184, 253, 0.4),
        inset 0 0 20px rgba(246, 184, 253, 0.3);
    }

    .premium-particle-3 {
      background: radial-gradient(
        circle,
        rgba(255, 255, 255, 0.8) 0%,
        rgba(255, 255, 255, 0.4) 40%,
        transparent 80%
      );
      box-shadow: 
        0 0 25px rgba(255, 255, 255, 0.3),
        inset 0 0 15px rgba(255, 255, 255, 0.2);
    }

    @keyframes premiumBackgroundPulse {
      0%, 100% {
        opacity: 0.5;
        transform: scale(1);
      }
      33% {
        opacity: 0.8;
        transform: scale(1.2);
      }
      66% {
        opacity: 0.6;
        transform: scale(0.9);
      }
    }

    @keyframes floatPremiumParticle {
      0% {
        transform: translateY(100vh) rotate(0deg) scale(0);
        opacity: 0;
      }
      5% {
        opacity: 0.2;
        transform: translateY(95vh) rotate(18deg) scale(0.5);
      }
      10% {
        opacity: 0.2;
        transform: translateY(90vh) rotate(36deg) scale(1);
      }
      90% {
        opacity: 0.2;
        transform: translateY(10vh) rotate(324deg) scale(1);
      }
      95% {
        opacity: 0.1;
        transform: translateY(5vh) rotate(342deg) scale(0.5);
      }
      100% {
        transform: translateY(-5vh) rotate(360deg) scale(0);
        opacity: 0;
      }
    }

    /* Многослойные световые эффекты */
    .premium-ambient-light-1 {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 400px;
      height: 400px;
      background: radial-gradient(
        circle,
        rgba(113, 119, 255, 0.15) 0%,
        rgba(113, 119, 255, 0.08) 30%,
        transparent 70%
      );
      border-radius: 50%;
      animation: premiumAmbientGlow1 10s ease-in-out infinite;
      z-index: 1;
    }

    .premium-ambient-light-2 {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 300px;
      height: 300px;
      background: radial-gradient(
        circle,
        rgba(246, 184, 253, 0.12) 0%,
        rgba(246, 184, 253, 0.06) 30%,
        transparent 70%
      );
      border-radius: 50%;
      animation: premiumAmbientGlow2 12s ease-in-out infinite;
      z-index: 1;
    }

    .premium-ambient-light-3 {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 500px;
      height: 500px;
      background: conic-gradient(
        from 0deg,
        rgba(113, 119, 255, 0.1) 0deg,
        rgba(246, 184, 253, 0.1) 120deg,
        rgba(255, 255, 255, 0.05) 240deg,
        rgba(113, 119, 255, 0.1) 360deg
      );
      border-radius: 50%;
      animation: premiumAmbientRotate 15s linear infinite;
      z-index: 1;
      opacity: 0.8;
    }

    @keyframes premiumAmbientGlow1 {
      0%, 100% {
        opacity: 0.4;
        transform: translate(-50%, -50%) scale(1) rotate(0deg);
      }
      25% {
        opacity: 0.7;
        transform: translate(-50%, -50%) scale(1.4) rotate(90deg);
      }
      50% {
        opacity: 0.5;
        transform: translate(-50%, -50%) scale(0.8) rotate(180deg);
      }
      75% {
        opacity: 0.8;
        transform: translate(-50%, -50%) scale(1.2) rotate(270deg);
      }
    }

    @keyframes premiumAmbientGlow2 {
      0%, 100% {
        opacity: 0.3;
        transform: translate(-50%, -50%) scale(1) rotate(0deg);
      }
      33% {
        opacity: 0.6;
        transform: translate(-50%, -50%) scale(1.3) rotate(-120deg);
      }
      66% {
        opacity: 0.4;
        transform: translate(-50%, -50%) scale(0.9) rotate(-240deg);
      }
    }

    @keyframes premiumAmbientRotate {
      0% {
        transform: translate(-50%, -50%) rotate(0deg);
      }
      100% {
        transform: translate(-50%, -50%) rotate(360deg);
      }
    }
  `;

  return (
    <div className="fullscreen-premium-loader">
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      
      {/* Анимированный фон */}
      <div className="premium-loader-background" />
      
      {/* Многослойное окружающее свечение */}
      <div className="premium-ambient-light-1" />
      <div className="premium-ambient-light-2" />
      <div className="premium-ambient-light-3" />
      
      {/* Плавающие премиум частицы */}
      <div className="floating-premium-particles">
        {Array.from({ length: 12 }, (_, i) => {
          const particleType = (i % 3) + 1;
          return (
            <div
              key={i}
              className={`premium-particle premium-particle-${particleType}`}
              style={{
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 15 + 10}px`,
                height: `${Math.random() * 15 + 10}px`,
                animationDuration: `${Math.random() * 20 + 25}s`,
                animationDelay: `${Math.random() * 10}s`
              }}
            />
          );
        })}
      </div>
      
      {/* Центральный премиум лоадер */}
      <div className="flex items-center justify-center w-full h-full relative z-10">
        <PremiumGlassLoader 
          size={size}
          message={message}
          showText={true}
        />
      </div>
    </div>
  );
} 