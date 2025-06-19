import { Users } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';

export default function FriendsListSection() {
  // Массив друзей для отображения
  const friends = Array.from({ length: 17 }, (_, i) => ({
    id: i + 1,
    name: "Никнейм",
    isOnline: true
  }));

  return (
    <div className="w-[281px] h-[998px] bg-black border-r border-white/10 flex flex-col">
      {/* Заголовок Друзья - 261x39px */}
      <div className="w-[261px] h-[39px] mx-[10px] mt-2 flex items-center">
        <Users className="w-[24px] h-[24px] text-white mr-2" />
        <span className="text-white text-[15px] font-medium tracking-[-0.45px] leading-[17.9px]">
          Друзья
        </span>
      </div>

      {/* Навигационные кнопки - горизонтальная группа кнопок */}
      <div className="w-[261px] mx-[10px] flex flex-col gap-1">
        {/* Запросы на общение кнопки */}
        <button className="w-[261px] h-[39px] bg-transparent border border-white/10 rounded-[5px] text-white text-sm font-medium text-left px-3">
          Все запросы
        </button>
        <button className="w-[261px] h-[39px] bg-transparent border border-white/10 rounded-[5px] text-white text-sm font-medium text-left px-3">
          Исходящие
        </button>
        <button className="w-[261px] h-[39px] bg-transparent border border-white/10 rounded-[5px] text-white text-sm font-medium text-left px-3">
          Входящие
        </button>
      </div>

      {/* Разделитель - 261x17px */}
      <div className="w-[261px] h-[17px] mx-[10px] flex items-center">
        <div className="w-[245px] h-px bg-[#d9d9d9]/10 mx-2" />
      </div>

      {/* Личные сообщения - Frame 261x25px */}
      <div className="w-[261px] h-[25px] mx-[10px]">
        <div className="w-[245px] h-[17px] mx-[6px]">
          <span className="text-white text-sm font-medium tracking-[-0.84px] leading-[16.7px]">
            Личные сообщения
          </span>
        </div>
      </div>

      {/* Список друзей - Frame 261x779px */}
      <div className="w-[261px] h-[779px] mx-[10px] flex-1">
        <ScrollArea className="h-full">
          <div className="space-y-1">
            {friends.map((friend) => (
              <div key={friend.id} className="w-[261px] h-10 flex items-center px-[6px]">
                {/* Avatar - 32x32px */}
                <div className="w-8 h-8 bg-gray-300 rounded-[39px] relative mr-3">
                  {/* Status indicator - 8x8px */}
                  <div className="w-2 h-2 bg-green-500 rounded-[10px] border-2 border-black absolute -bottom-0.5 -right-0.5" />
                </div>
                
                {/* Name */}
                <span className="text-white text-sm font-normal tracking-[0px] leading-[16.7px]">
                  {friend.name}
                </span>
                
                {/* Placeholder for additional info - Frame 133x10px */}
                <div className="ml-auto w-[133px] h-[10px]">
                  {/* Placeholder for future content */}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
} 