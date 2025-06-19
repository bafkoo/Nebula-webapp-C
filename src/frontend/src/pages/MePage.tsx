import { HelpCircle, Mail, Users } from "lucide-react";
import { useEffect } from "react";
import ActivityFeedSection from "../components/chat/ActivityFeedSection";
import FriendsListSection from "../components/chat/FriendsListSection";
import MiniHeaderSection from "../components/chat/MiniHeaderSection";
import OnlineUsersSection from "../components/chat/OnlineUsersSection";
import { Sidebar } from "../components/ui/Sidebar";

export default function MePage() {
  // Принудительное применение темной темы
  useEffect(() => {
    document.body.style.backgroundColor = '#000000';
    document.body.style.color = '#ffffff';
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.documentElement.style.backgroundColor = '#000000';
  }, []);

  return (
    <div className="bg-black w-[1920px] h-[1080px] relative overflow-hidden">
      {/* Sidebar - Frame 72x1080px, вертикальный auto-layout */}
      <div className="absolute left-0 top-0">
        <Sidebar />
      </div>

      {/* Hedder - верхний header, 1920px ширина, 32px высота */}
      <div className="absolute left-0 top-0 w-[1920px] h-8 bg-black/75 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Users className="w-3.5 h-3.5 text-white" />
          <div className="font-medium text-white text-sm tracking-[-0.84px]">
            Друзья
          </div>
        </div>
        
        {/* Блок с почтой и FAQ - справа */}
        <div className="absolute right-5 flex items-center gap-4">
          <Mail className="w-[22px] h-[22px] text-white" />
          <HelpCircle className="w-[22px] h-[22px] text-white" />
        </div>
      </div>

      {/* SmallHeadder - под основным header, горизонтальный auto-layout */}
      <div className="absolute left-[73px] top-[33px] w-[1847px] h-[47px] bg-black/[0.72] border-b border-white/10">
        <MiniHeaderSection />
      </div>

      {/* FriendPannle - левая панель друзей, 281px ширина */}
      <div className="absolute left-[73px] top-[81px] w-[281px] h-[998px]">
        <FriendsListSection />
      </div>

      {/* centralPanelOnline - центральная панель, 1145px ширина */}
      <div className="absolute left-[355px] top-[81px] w-[1145px] h-[998px]">
        <OnlineUsersSection />
      </div>

      {/* activityPanel - правая панель активности, 418px ширина */}
      <div className="absolute left-[1502px] top-[81px] w-[418px] h-[998px]">
        <ActivityFeedSection />
      </div>
    </div>
  );
} 