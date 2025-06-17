import {
  Headphones,
  MessageSquare,
  Plus,
  Settings,
  Users,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function ChannelSidebar() {
  return (
    <div className="w-[281px] h-full bg-black rounded-[10px_0px_0px_0px] relative">
      {/* Friends section */}
      <div className="flex w-[264px] h-[39px] items-center gap-[11px] pl-1.5 pr-0 pt-0.5 pb-[3px] absolute top-[90px] left-[83px] rounded-[5px]">
        <Users className="w-[22px] h-[22px] text-white" />
        <div className="opacity-70 [font-family:'SF_Pro-Medium',Helvetica] font-medium text-sm text-center text-white">
          Друзья
        </div>
      </div>

      {/* Message square */}
      <div className="flex w-[264px] h-[39px] items-center gap-3 px-3 py-[5px] absolute top-[131px] left-[83px]">
        <MessageSquare className="w-[22px] h-[22px] text-white" />
      </div>

      <Separator className="absolute top-[173px] left-20 w-[264px] bg-white/20" />

      {/* Direct messages header */}
      <div className="inline-flex items-center gap-[107px] absolute top-[276px] left-[83px]">
        <div className="[font-family:'SF_Pro-Medium',Helvetica] font-medium text-sm text-center text-white">
          Личные сообщения
        </div>
        <Plus className="w-2.5 h-2.5 text-white" />
      </div>

      {/* User in DM */}
      <div className="flex w-[264px] h-[39px] items-center gap-3 px-3 py-[5px] absolute top-[301px] left-[77px] rounded-md hover:bg-white/5 transition-colors cursor-pointer">
        <Avatar className="w-8 h-8 bg-[#c7c8cec2]">
          <AvatarFallback className="bg-[#c7c8cec2]"></AvatarFallback>
        </Avatar>
        <div className="[font-family:'SF_Pro-Light',Helvetica] font-light text-sm text-white">
          Никнейм
        </div>
      </div>

      {/* User profile area */}
      <div className="absolute w-[338px] h-[58px] top-[1012px] left-1 bg-[#12111169] rounded-[10px] border border-solid border-[#ffffff1f] flex items-center px-4">
        <div className="flex items-center gap-2 flex-1">
          <Avatar className="w-[41px] h-[41px] bg-[#f23f43] relative">
            <AvatarFallback className="bg-[#f23f43]"></AvatarFallback>
            <div className="absolute w-5 h-5 bottom-0 right-0 bg-green-500 rounded-full border-2 border-black"></div>
          </Avatar>
          <div className="flex flex-col">
            <div className="[font-family:'SF_Pro-Regular',Helvetica] font-normal text-white text-[13px]">
              bafko
            </div>
            <div className="[font-family:'SF_Pro-Light',Helvetica] font-light text-[11px] text-white">
              В сети
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-white hover:bg-white/10"
          >
            <Headphones className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-white hover:bg-white/10"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
} 