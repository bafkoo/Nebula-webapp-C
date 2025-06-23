import React from 'react';
import { Sidebar } from '../../components/app/sidebar/Sidebar';
import { Header } from '../../components/app/layout/Header';
import { GamingLobbiesWidget } from '../../components/app/dashboard/widgets/GamingLobbiesWidget';
import { StatsAchievementsWidget } from '../../components/app/dashboard/widgets/StatsAchievementsWidget';
import { NewsUpdatesWidget } from '../../components/app/dashboard/widgets/NewsUpdatesWidget';
import { RecommendationsWidget } from '../../components/app/dashboard/widgets/RecommendationsWidget';
import { QuickSettingsWidget } from '../../components/app/dashboard/widgets/QuickSettingsWidget';
import { EventsTournamentsWidget } from '../../components/app/dashboard/widgets/EventsTournamentsWidget';

export const MainPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        <Header />
        
        {/* Dashboard Widgets Grid */}
        <div className="flex-1 p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {/* Первый ряд */}
            <GamingLobbiesWidget />
            <StatsAchievementsWidget />
            <NewsUpdatesWidget />
            
            {/* Второй ряд */}
            <RecommendationsWidget />
            <QuickSettingsWidget />
            <EventsTournamentsWidget />
          </div>
        </div>
      </div>
    </div>
  );
}; 