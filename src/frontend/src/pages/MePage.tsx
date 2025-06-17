import * as React from "react";
import {
  Headphones,
  HelpCircle,
  Mail,
  MessageSquare,
  MoreVertical,
  Plus,
  Search,
  Settings,
  Users,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock data for users
const onlineUsers = [
  {
    id: 1,
    name: "Никнейм",
    status: "Статус",
    avatar: "#f23f43",
  },
];

// Mock data for server icons
const serverIcons = Array(7).fill(null);

const MePage: React.FC = () => {
  return (
    <div className="bg-transparent flex justify-center w-full min-h-screen">
      <div className="w-full max-w-[1920px] h-screen relative overflow-hidden">
        
        {/* Top status bar */}
        <div className="absolute w-full h-8 top-0 left-0 bg-black flex items-center justify-between px-4 z-20 sm:left-[73px] sm:w-[calc(100%-73px)]">
          <div className="flex-1"></div>
          <div className="inline-flex items-end gap-1.5">
            <Users className="w-4 h-4 text-white" />
            <div className="font-medium text-sm text-white hidden sm:block">
              Друзья
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-white hover:bg-white/10"
            >
              <Mail className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-white hover:bg-white/10"
            >
              <HelpCircle className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Top navigation bar */}
        <div className="absolute w-full h-[49px] top-8 left-0 bg-black z-10 sm:left-[73px] sm:w-[calc(100%-73px)]">
          <div className="inline-flex items-center gap-2 absolute top-4 left-4 sm:left-[240px]">
            <Users className="w-4 h-4 text-white opacity-70" />
            <div className="opacity-70 font-bold text-[15px] text-white hidden sm:block">
              Друзья
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="absolute top-3 right-3 h-6 w-6 text-white opacity-70 hover:bg-white/10"
          >
            <Search className="h-5 w-5" />
          </Button>

          <Tabs defaultValue="all" className="absolute top-2 left-[140px] sm:left-[343px] hidden sm:block">
            <TabsList className="bg-transparent">
              <TabsTrigger
                value="all"
                className="opacity-70 font-bold text-white text-[15px] data-[state=active]:bg-transparent hover:bg-white/10"
              >
                Все
              </TabsTrigger>
              <TabsTrigger
                value="pending"
                className="opacity-70 font-bold text-white text-[15px] data-[state=active]:bg-transparent hover:bg-white/10"
              >
                Ожидание
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <Button className="absolute top-2 left-[200px] sm:left-[608px] h-8 rounded-lg shadow-[0px_4px_12px_#6366f14c,0px_0px_8px_#6366f166] bg-gradient-to-r from-blue-500 to-purple-600 hover:opacity-90 transition-opacity text-xs sm:text-sm px-3 sm:px-4">
            <span className="font-medium text-white">
              Добавить в друзья
            </span>
          </Button>
        </div>

        {/* Left sidebar with server list and channels */}
        <div className="absolute w-full sm:w-[354px] h-full top-0 left-0 flex z-30">
          
          {/* Server sidebar */}
          <div className="w-[73px] h-full bg-black flex flex-col items-center pt-8 gap-2">
            {serverIcons.map((_, index) => (
              <Button
                key={index}
                variant="ghost"
                size="icon"
                className="w-10 h-10 rounded-lg bg-transparent text-white hover:bg-white/10 transition-colors"
              >
                <div className="w-6 h-6 rounded-full bg-indigo-500" />
              </Button>
            ))}

            <Button
              variant="ghost"
              size="icon"
              className="w-10 h-10 rounded-[10px] bg-transparent text-white mt-2 hover:bg-white/10 transition-colors"
            >
              <Plus className="w-6 h-6" />
            </Button>
          </div>

          {/* Channel sidebar - Hidden on mobile */}
          <div className="hidden sm:block w-[281px] h-full bg-black rounded-[10px_0px_0px_0px] relative">
            {/* Friends section */}
            <div className="flex w-[264px] h-[39px] items-center gap-[11px] pl-1.5 pr-0 pt-0.5 pb-[3px] absolute top-[90px] left-[17px] rounded-[5px] hover:bg-white/5 cursor-pointer transition-colors">
              <Users className="w-[22px] h-[22px] text-white" />
              <div className="opacity-70 font-medium text-sm text-white">
                Друзья
              </div>
            </div>

            {/* Message square */}
            <div className="flex w-[264px] h-[39px] items-center gap-3 px-3 py-[5px] absolute top-[131px] left-[17px] hover:bg-white/5 cursor-pointer transition-colors rounded-md">
              <MessageSquare className="w-[22px] h-[22px] text-white" />
            </div>

            <Separator className="absolute top-[173px] left-[17px] w-[247px] bg-white/20" />

            {/* Direct messages header */}
            <div className="inline-flex items-center justify-between w-[247px] absolute top-[200px] left-[17px]">
              <div className="font-medium text-sm text-white">
                Личные сообщения
              </div>
              <Plus className="w-2.5 h-2.5 text-white cursor-pointer hover:text-white/70 transition-colors" />
            </div>

            {/* User in DM */}
            <div className="flex w-[247px] h-[39px] items-center gap-3 px-3 py-[5px] absolute top-[235px] left-[17px] rounded-md hover:bg-white/5 transition-colors cursor-pointer">
              <Avatar className="w-8 h-8 bg-[#c7c8cec2]">
                <AvatarFallback className="bg-[#c7c8cec2]"></AvatarFallback>
              </Avatar>
              <div className="font-light text-sm text-white">
                Никнейм
              </div>
            </div>

            {/* User profile area */}
            <div className="absolute w-[264px] h-[58px] bottom-[20px] left-[17px] bg-[#12111169] rounded-[10px] border border-solid border-[#ffffff1f] flex items-center px-4">
              <div className="flex items-center gap-2 flex-1">
                <Avatar className="w-[41px] h-[41px] bg-[#f23f43] relative">
                  <AvatarFallback className="bg-[#f23f43]"></AvatarFallback>
                  <div className="absolute w-5 h-5 bottom-0 right-0 bg-green-500 rounded-full border-2 border-black"></div>
                </Avatar>
                <div className="flex flex-col">
                  <div className="font-normal text-white text-[13px]">
                    bafko
                  </div>
                  <div className="font-light text-[11px] text-white">
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
        </div>

        {/* Main content area */}
        <Card className="absolute w-full sm:w-[calc(100%-775px)] h-[calc(100%-81px)] top-[81px] left-0 sm:left-[355px] bg-black border-none rounded-none">
          <CardContent className="p-4 sm:p-6">
            <div className="font-normal text-sm text-white mb-4">
              В сети&nbsp;&nbsp;- 2
            </div>

            <Separator className="my-4 bg-white/20" />

            {/* User list */}
            {onlineUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center gap-4 py-2.5 px-2 hover:bg-white/5 rounded-md transition-colors cursor-pointer"
              >
                <Avatar
                  className="w-8 h-8 relative"
                  style={{ backgroundColor: user.avatar }}
                >
                  <AvatarFallback
                    style={{ backgroundColor: user.avatar }}
                  ></AvatarFallback>
                  <div className="absolute w-3.5 h-3.5 bottom-0 right-0 bg-green-500 rounded-full border-2 border-black"></div>
                </Avatar>
                <div className="flex flex-col flex-1">
                  <div className="font-light text-sm text-white">
                    {user.name}
                  </div>
                  <div className="font-light text-[13px] text-white/70">
                    {user.status}
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-white hover:bg-white/10"
                  >
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-white hover:bg-white/10"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Right sidebar - Hidden on smaller screens */}
        <Card className="hidden lg:block absolute w-[420px] h-[calc(100%-81px)] top-[81px] right-0 bg-black border-none rounded-none">
          <CardContent className="flex flex-col items-center justify-center h-full p-6">
            <div className="font-medium text-[15px] text-white text-center">
              Пока тут никого нет
            </div>
            <div className="font-light text-[13px] text-center text-white/70 mt-2 max-w-[345px]">
              Когда ваш друг запустит игру или войдет в голосовой чат, вы увидите это здесь!
            </div>
          </CardContent>
        </Card>
        
      </div>
    </div>
  );
};

export default MePage; 