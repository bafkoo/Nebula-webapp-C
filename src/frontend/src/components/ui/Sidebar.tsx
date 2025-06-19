import { Plus } from "lucide-react";

interface SidebarProps {
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ className = "" }) => {
  // Server icons data - точно 10 иконок как в Figma
  const serverIcons = Array.from({ length: 10 }, (_, index) => ({
    id: index + 1,
    isActive: index === 0, // Первая иконка активна
    color: "#d9d9d9" // Цвет из Figma
  }));

  return (
    <div className={`w-[72px] h-[1080px] bg-black flex flex-col ${className}`}>
      
      {/* pm icon - Instance 72x40px, отступ 32px от верха */}
      <div className="w-[72px] h-10 flex items-center relative mt-8">
        {/* Rectangle 5 - индикатор активности 4x14px */}
        <div 
          className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-[14px] rounded-[0px_5px_5px_0px]"
          style={{ backgroundColor: "#d9d9d9" }}
        />
        
        {/* Rectangle 4 - основная иконка PM 40x40px */}
        <div 
          className="absolute left-4 top-0 w-10 h-10 rounded-[10px]"
          style={{ backgroundColor: "#d9d9d9" }}
        />
      </div>

      {/* severIcons - Frame 72x481px, отступ 48px от pm icon */}
      <div className="w-[72px] h-[481px] flex flex-col items-center mt-2">
        
        {/* Frame 1321315060 - разделитель 72x1px */}
        <div className="w-[72px] h-px flex justify-center mb-[9px]">
          <div 
            className="w-8 h-px"
            style={{ backgroundColor: "#d9d9d9", opacity: 0.2 }}
          />
        </div>

        {/* Серверные иконки - точные позиции из Figma */}
        <div className="flex flex-col items-center space-y-2">
          {serverIcons.map((server) => (
            <div key={server.id} className="w-14 h-10 flex items-center relative">
              {/* Rectangle 7 - индикатор активности 4x8px */}
              {server.isActive && (
                <div 
                  className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-2 rounded-[0px_2px_2px_0px]"
                  style={{ backgroundColor: "#d9d9d9" }}
                />
              )}
              
              {/* Основная иконка сервера 40x40px */}
              <div 
                className="absolute left-4 top-0 w-10 h-10 rounded-[10px]"
                style={{ backgroundColor: server.color }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Добавить сервер - Instance 55.8x40px, позиция y: -213 */}
      <div className="mt-auto mb-4 w-[55.8px] h-10 flex items-center relative">
        {/* Rectangle 9 - индикатор 3.8x8px (скрыт по умолчанию) */}
        <div 
          className="absolute left-0 top-1/2 transform -translate-y-1/2 w-[3.8px] h-2 opacity-0"
          style={{ backgroundColor: "#d9d9d9" }}
        />
        
        {/* Frame 1321315057 - кнопка добавления 40x40px */}
        <div className="absolute left-4 top-0 w-10 h-10 bg-[#36393f] rounded-[10px] flex items-center justify-center">
          <Plus className="w-6 h-6 text-[#3ba55c]" />
        </div>
      </div>

    </div>
  );
}; 