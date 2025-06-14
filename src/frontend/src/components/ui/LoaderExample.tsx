import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import PremiumGlassLoader from './PremiumGlassLoader';
import FullScreenPremiumLoader from './FullScreenPremiumLoader';
import { useLoader } from '../../hooks/useLoader';

export default function LoaderExample(): React.JSX.Element {
  const { t } = useTranslation();
  const [showPremiumFullScreen, setShowPremiumFullScreen] = useState(false);
  const { isVisible, message, showLoader, hideLoader } = useLoader();

  const handleShowPremiumFullScreen = () => {
    setShowPremiumFullScreen(true);
    setTimeout(() => setShowPremiumFullScreen(false), 4000);
  };

  const handleShowHookLoader = () => {
    showLoader(t('loader.examples.hookDemo1'), 180);
    
    setTimeout(() => {
      showLoader(t('loader.examples.hookDemo2'), 180);
    }, 1500);
    
    setTimeout(() => {
      showLoader(t('loader.examples.hookDemo3'), 180);
    }, 3000);
    
    setTimeout(() => {
      hideLoader();
    }, 4500);
  };

  return (
    <div className="min-h-screen bg-[#252525] p-8">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-12">
          <h1 
            className="text-4xl font-bold mb-4 bg-gradient-to-r from-[#7177FF] via-[#F6B8FD] to-[#7177FF] bg-clip-text text-transparent"
            style={{ fontFamily: "'gg sans', 'Whitney', 'Helvetica Neue', Helvetica, Arial, sans-serif" }}
          >
            {t('loader.examples.title')}
          </h1>
          <p className="text-white/80 text-lg">
            {t('loader.examples.subtitle')}
          </p>
        </div>

        {/* Premium Loaders Showcase */}
        <div className="mb-12">
          <h2 className="text-white text-2xl font-bold mb-8 text-center">{t('loader.examples.mainSizes')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#1a1a1a] rounded-lg p-8 text-center">
              <h3 className="text-white text-lg font-semibold mb-6">{t('loader.examples.compact')}</h3>
              <PremiumGlassLoader size={120} message={t('common.loading')} />
            </div>
            
            <div className="bg-[#1a1a1a] rounded-lg p-8 text-center">
              <h3 className="text-white text-lg font-semibold mb-6">{t('loader.examples.standard')}</h3>
              <PremiumGlassLoader size={160} message={t('loader.examples.processing')} />
            </div>
            
            <div className="bg-[#1a1a1a] rounded-lg p-8 text-center">
              <h3 className="text-white text-lg font-semibold mb-6">{t('loader.examples.large')}</h3>
              <PremiumGlassLoader size={200} message={t('loader.examples.connecting')} />
            </div>
          </div>
        </div>

        {/* Logo Only Versions */}
        <div className="mb-12">
          <h2 className="text-white text-2xl font-bold mb-8 text-center">{t('loader.examples.logoOnly')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#1a1a1a] rounded-lg p-6 text-center">
              <h3 className="text-white text-lg font-semibold mb-4">{t('loader.examples.small')}</h3>
              <PremiumGlassLoader size={100} showText={false} />
            </div>
            
            <div className="bg-[#1a1a1a] rounded-lg p-6 text-center">
              <h3 className="text-white text-lg font-semibold mb-4">{t('loader.examples.medium')}</h3>
              <PremiumGlassLoader size={140} showText={false} />
            </div>
            
            <div className="bg-[#1a1a1a] rounded-lg p-6 text-center">
              <h3 className="text-white text-lg font-semibold mb-4">{t('loader.examples.largeLogo')}</h3>
              <PremiumGlassLoader size={180} showText={false} />
            </div>
          </div>
        </div>

        {/* Interactive Demo */}
        <div className="text-center mb-12">
          <h2 className="text-white text-2xl font-bold mb-8">{t('loader.examples.interactiveDemo')}</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <button
              onClick={handleShowPremiumFullScreen}
              className="px-8 py-4 bg-gradient-to-r from-[#7177FF] via-[#F6B8FD] to-[#7177FF] text-white font-semibold rounded-lg hover:opacity-90 transition-opacity text-lg"
            >
              {t('loader.examples.fullscreenLoader')}
            </button>
            
            <button
              onClick={handleShowHookLoader}
              className="px-8 py-4 bg-gradient-to-r from-[#F6B8FD] via-[#7177FF] to-[#F6B8FD] text-white font-semibold rounded-lg hover:opacity-90 transition-opacity text-lg"
            >
              {t('loader.examples.hookLoader')}
            </button>
          </div>
        </div>

        {/* Usage Examples */}
        <div className="bg-[#1a1a1a] rounded-lg p-8">
          <h2 className="text-white text-2xl font-bold mb-6">{t('loader.examples.usageExamples')}</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-[#7177FF] text-lg font-semibold mb-3">{t('loader.examples.regularLoader')}:</h3>
              <pre className="bg-[#0a0a0a] text-green-400 p-4 rounded-lg overflow-x-auto">
{`<PremiumGlassLoader 
  size={160} 
  message="${t('loader.examples.loadingData')}" 
/>`}
              </pre>
            </div>
            
            <div>
              <h3 className="text-[#F6B8FD] text-lg font-semibold mb-3">{t('loader.examples.logoOnlyCode')}:</h3>
              <pre className="bg-[#0a0a0a] text-green-400 p-4 rounded-lg overflow-x-auto">
{`<PremiumGlassLoader 
  size={120} 
  showText={false} 
/>`}
              </pre>
            </div>
            
            <div>
              <h3 className="text-[#7177FF] text-lg font-semibold mb-3">{t('loader.examples.fullscreenCode')}:</h3>
              <pre className="bg-[#0a0a0a] text-green-400 p-4 rounded-lg overflow-x-auto">
{`<FullScreenPremiumLoader 
  message="${t('loader.examples.processing')}" 
  size={220} 
/>`}
              </pre>
            </div>
            
            <div>
              <h3 className="text-[#F6B8FD] text-lg font-semibold mb-3">{t('loader.examples.withHook')}:</h3>
              <pre className="bg-[#0a0a0a] text-green-400 p-4 rounded-lg overflow-x-auto">
{`const { showLoader, hideLoader } = useLoader();

// ${t('loader.examples.show')}
showLoader('${t('common.loading')}', 180);

// ${t('loader.examples.hide')}
hideLoader();`}
              </pre>
            </div>
          </div>
        </div>

      </div>

      {/* Full Screen Loaders */}
      {showPremiumFullScreen && (
        <FullScreenPremiumLoader message={t('loader.examples.premiumDemo')} size={240} />
      )}
      
      {isVisible && (
        <FullScreenPremiumLoader message={message} />
      )}
    </div>
  );
} 