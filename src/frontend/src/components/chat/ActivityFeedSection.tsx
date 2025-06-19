export default function ActivityFeedSection() {
  return (
    <div className="w-[418px] h-[998px] bg-[#0a0a0a] flex flex-col">
      {/* Заголовок Активные контакты - Frame 388x29px */}
      <div className="w-[388px] h-[29px] mx-[15px] mt-[11px]">
        <h2 className="text-white text-2xl font-semibold tracking-[-2.16px] leading-[28.62px]">
          Активные контакты
        </h2>
      </div>

      {/* Пока что тут тихо секция - Frame 388x41px */}
      <div className="w-[388px] h-[41px] mx-[15px] mt-[4px]">
        <div className="flex justify-center items-center h-6 mt-[17px]">
          <span className="text-white text-base font-medium tracking-[-0.96px] leading-[19.08px]">
            Пока что тут тихо...
          </span>
        </div>
      </div>

      {/* Описание функционала - Frame 388x51px */}
      <div className="w-[388px] h-[51px] mx-[15px] mt-[4px]">
        <p className="text-white text-sm font-medium tracking-[-0.84px] leading-[16.69px] text-center">
          Если ваш друг начнет чем-то заниматься - например, запустит игру или войдет в голосовой чат - вы увидите это здесь!
        </p>
      </div>
    </div>
  );
} 