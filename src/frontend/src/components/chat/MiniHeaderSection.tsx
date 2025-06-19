import { Users } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';
import { NewGroupChat } from '../ui/NewGroupChat';

export default function MiniHeaderSection() {
  return (
    <div className="h-[47px] flex items-center px-3 bg-black/[0.72] border-b border-white/10">
      {/* Search Holder - точная ширина 278.3px */}
      <div className="w-[278.3px] h-[39px] flex items-center">
        <div className="w-[264.3px] h-[29px] bg-[#161616] border border-white/[0.13] rounded-[5px] flex items-center px-4">
          <span className="text-white text-sm font-medium tracking-[0px] leading-[16.7px]">
            Найти или начать разговор
          </span>
        </div>
      </div>

      {/* Main Content - точные размеры и позиции */}
      <div className="flex-1 flex items-center justify-between h-8 ml-[27px]">
        {/* Друзья Label */}
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-white" />
          <span className="text-white text-[15px] font-medium tracking-[-0.45px] leading-[17.9px]">
            Друзья
          </span>
        </div>

        {/* Tabs Navigation */}
        <div className="flex items-center gap-0">
          <Tabs defaultValue="online" className="flex">
            <TabsList className="bg-transparent border-none p-0 gap-0 h-8">
              <TabsTrigger 
                value="online" 
                className="bg-transparent text-white font-black text-base tracking-[-1.44px] leading-[19.09px] px-[11px] h-8 rounded-lg data-[state=active]:bg-transparent"
              >
                В сети
              </TabsTrigger>
              <TabsTrigger 
                value="all" 
                className="bg-transparent text-white font-black text-base tracking-[-1.44px] leading-[19.09px] px-[14.5px] h-8 rounded-lg data-[state=active]:bg-transparent"
              >
                Все
              </TabsTrigger>
              <TabsTrigger 
                value="pending" 
                className="bg-transparent text-white font-black text-base tracking-[-1.44px] leading-[19.09px] px-[11px] h-8 rounded-lg data-[state=active]:bg-transparent"
              >
                Ожидание
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Добавить в друзья Button */}
          <button className="ml-[13px] w-[155px] h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
            <span className="text-white text-sm font-medium tracking-[0px] leading-[16.7px]">
              Добавить в друзья
            </span>
          </button>
        </div>

        {/* New Group Chat Button */}
        <div className="ml-auto">
          <div className="w-[27px] h-[27px] flex items-center justify-center">
            <NewGroupChat className="w-[21px] h-[21px]" />
          </div>
        </div>
      </div>
    </div>
  );
} 