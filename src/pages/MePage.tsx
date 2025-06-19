import React, { useState, useEffect } from 'react';
import MiniHeaderSection from '../components/MiniHeaderSection';
import FriendsListSection from '../components/FriendsListSection';
import OnlineUsersSection from '../components/OnlineUsersSection';
import ActivityFeedSection from '../components/ActivityFeedSection';

export default function MePage() {
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    document.documentElement.style.setProperty('--background', '#000000');
    document.documentElement.style.setProperty('--foreground', '#ffffff');
    document.body.style.backgroundColor = '#000000';
    document.body.style.color = '#ffffff';
  }, []);

  return (
    <div className="min-h-screen bg-black text-white flex">
      {/* Sidebar - точно 72px ширина */}
      <div className="w-[72px] bg-black border-r border-white/10 flex flex-col">
        {/* PM Icon - верхний элемент */}
        <div className="h-[40px] mt-8 flex justify-center items-center">
          <div className="w-10 h-10 bg-gray-300 rounded-[10px] relative">
            <div className="absolute left-0 top-3.5 w-1 h-3.5 bg-gray-300 rounded-full" />
          </div>
        </div>
        
        {/* Разделитель */}
        <div className="mx-5 my-1">
          <div className="w-8 h-px bg-gray-300/20" />
        </div>
        
        {/* Server Icons */}
        <div className="flex flex-col items-center space-y-3">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="w-14 h-10 flex items-center">
              <div className="w-1 h-2 bg-gray-300 rounded-full" />
            </div>
          ))}
        </div>
        
        {/* Добавить сервер */}
        <div className="mt-auto mb-8 flex justify-center">
          <div className="w-10 h-10 bg-transparent border border-gray-300/20 rounded-[10px] flex items-center justify-center">
            <div className="w-1 h-2 bg-gray-300/20 rounded-full" />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Mini Header - точно 47px высота */}
        <div className="h-[47px] bg-black/[0.72] border-b border-white/10 border-l border-white/10 rounded-tl-lg">
          <MiniHeaderSection />
        </div>

        {/* Content Area */}
        <div className="flex-1 flex">
          {/* Friends Panel - точно 281px ширина */}
          <div className="w-[281px] bg-black border-r border-white/10">
            <FriendsListSection />
          </div>

          {/* Central Panel Online - точно 1145px ширина */}
          <div className="w-[1145px] bg-[#030303] border-r border-white/10">
            <OnlineUsersSection />
          </div>

          {/* Activity Panel - точно 418px ширина */}
          <div className="w-[418px] bg-[#0a0a0a]">
            <ActivityFeedSection />
          </div>
        </div>
      </div>
    </div>
  );
} 