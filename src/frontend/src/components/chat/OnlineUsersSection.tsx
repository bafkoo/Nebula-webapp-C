import { ScrollArea } from '../ui/scroll-area';

export default function OnlineUsersSection() {
  // Массив пользователей онлайн
  const onlineUsers = Array.from({ length: 15 }, (_, i) => ({
    id: i + 1,
    name: "Никнейм",
    status: "Статус",
    isOnline: true
  }));

  return (
    <div className="w-[1145px] h-[998px] bg-[#030303] border-r border-white/10 flex flex-col">
      {/* Поиск и количество в сети секция - 1119x81px */}
      <div className="w-[1119px] h-[81px] mx-[13px] mt-[13px]">
        {/* Поиск друзей - 1104x38px */}
        <div className="w-[1104px] h-[38px] mx-[15px]">
          <div className="w-[1104px] h-[38px] bg-[#161616] border border-white/10 rounded-[7px] flex items-center px-3">
            <span className="text-white text-[15px] font-medium tracking-[-0.6px] leading-[17.89px]">
              Поиск
            </span>
          </div>
        </div>
        
        {/* В сети - 2 - точная позиция из Figma */}
        <div className="w-[1104px] h-[18px] mx-[15px] mt-[25px]">
          <span className="text-white text-[15px] font-medium tracking-[-1.35px] leading-[17.89px]">
            В сети  -  2
          </span>
        </div>
      </div>

      {/* Центральный разделитель - 1097x12px */}
      <div className="w-[1097px] h-3 mx-[24px] flex items-center">
        <div className="w-[1085px] h-px bg-gray-300/10" />
      </div>

      {/* Список друзей - 1119x868px */}
      <div className="w-[1119px] h-[868px] mx-[13px] flex-1">
        <ScrollArea className="h-full">
          <div className="px-[11px]">
            {onlineUsers.map((user, index) => (
              <div key={user.id}>
                {/* User Item - 1119x46px */}
                <div className="w-[1119px] h-[46px] flex items-center">
                  {/* User Info - Frame 109x37px */}
                  <div className="w-[109px] h-[37px] flex items-center">
                    {/* Avatar - 32x32px */}
                    <div className="w-8 h-8 bg-gray-300 rounded-[19px] relative mr-3">
                      {/* Status indicator - 8x8px */}
                      <div className="w-2 h-2 bg-green-500 rounded-[10px] border-2 border-black absolute -bottom-0.5 -right-0.5" />
                    </div>
                    
                    {/* Name and Status - Frame 65x19px */}
                    <div className="w-[65px] h-[19px]">
                      <div className="text-white text-base font-medium tracking-[-1.44px] leading-[19.08px]">
                        {user.name}
                      </div>
                      <div className="text-white text-sm font-medium tracking-[-1.26px] leading-[16.69px] mt-0.5">
                        {user.status}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons - блок сообщений 94x32px */}
                  <div className="ml-auto w-[94px] h-8 flex items-center gap-2">
                    {/* Сообщение Button - 32x32px */}
                    <button className="w-8 h-8 bg-black/[0.61] rounded-full flex items-center justify-center">
                      <div className="w-4 h-4 bg-white/20 rounded" />
                    </button>
                    
                    {/* 3dots Button - 32x32px */}
                    <button className="w-8 h-8 bg-black/[0.68] rounded-full flex items-center justify-center">
                      <div className="w-4 h-4 bg-white/20 rounded" />
                    </button>
                  </div>
                </div>

                {/* Разделитель между элементами - 1097x6px */}
                {index < onlineUsers.length - 1 && (
                  <div className="w-[1097px] h-[6px] flex items-center">
                    <div className="w-[1087px] h-px bg-gray-300/10" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
} 