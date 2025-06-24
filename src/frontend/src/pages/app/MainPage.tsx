import React from 'react';
import { useParams } from 'react-router-dom';
import { Sidebar } from '../../components/app/sidebar/Sidebar';
import { Header } from '../../components/app/layout/Header';
import { GamingLobbiesWidget } from '../../components/app/dashboard/widgets/GamingLobbiesWidget';
import { StatsAchievementsWidget } from '../../components/app/dashboard/widgets/StatsAchievementsWidget';
import { NewsUpdatesWidget } from '../../components/app/dashboard/widgets/NewsUpdatesWidget';
import { RecommendationsWidget } from '../../components/app/dashboard/widgets/RecommendationsWidget';
import { QuickSettingsWidget } from '../../components/app/dashboard/widgets/QuickSettingsWidget';
import { EventsTournamentsWidget } from '../../components/app/dashboard/widgets/EventsTournamentsWidget';
import FullChatInterface from '../../components/app/chat/FullChatInterface';
import type { ActiveTab } from '../../types/app';

export const MainPage: React.FC = () => {
  const { chatId } = useParams<{ chatId: string }>();
  
  // Определяем активную вкладку на основе URL
  const isOnChatPage = window.location.pathname.startsWith('/app/chat');
  const activeTab: ActiveTab = isOnChatPage ? 'chat' : 'dashboard';
  
  console.log('MainPage: URL analysis:', {
    pathname: window.location.pathname,
    chatId,
    isOnChatPage,
    activeTab
  });

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        <Header 
          activeTab={activeTab}
        />
        
        {/* Content */}
        <div className="flex-1 p-6">
          {activeTab === 'dashboard' ? (
            /* Dashboard View */
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              <GamingLobbiesWidget />
              <StatsAchievementsWidget />
              <NewsUpdatesWidget />
              <RecommendationsWidget />
              <QuickSettingsWidget />
              <EventsTournamentsWidget />
            </div>
          ) : (
            /* Chat View */
            <FullChatInterface className="h-full" />
          )}
        </div>
      </div>
    </div>
  );
}; 