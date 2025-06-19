import React from "react";
import { HelpCircle, Mail, Search, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function TopNavigation(): JSX.Element {
  return (
    <>
      {/* Top status bar */}
      <div className="w-full h-8 bg-black flex items-center justify-between px-4">
        <div className="flex-1"></div>
        <div className="inline-flex items-end gap-1.5">
          <Users className="w-4 h-4 text-white" />
          <div className="[font-family:'SF_Pro-Medium',Helvetica] font-medium text-sm text-white">
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

      {/* Main navigation bar */}
      <div className="w-full h-[49px] bg-black flex items-center">
        <div className="inline-flex items-center gap-2 ml-[313px] mt-4">
          <Users className="w-4 h-4 text-white opacity-70" />
          <div className="relative opacity-70 [font-family:'SF_Pro-Bold',Helvetica] font-bold text-[15px] text-center whitespace-nowrap text-white tracking-[0] leading-[normal]">
            Друзья
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="ml-auto mr-3 mt-3 h-6 w-6 text-white opacity-70 hover:bg-white/10"
        >
          <Search className="h-5 w-5" />
        </Button>

        <Tabs defaultValue="all" className="absolute top-2 left-[416px]">
          <TabsList className="bg-transparent">
            <TabsTrigger
              value="all"
              className="opacity-70 [font-family:'SF_Pro-Bold',Helvetica] font-bold text-white text-[15px] data-[state=active]:bg-transparent hover:bg-white/10"
            >
              Все
            </TabsTrigger>
            <TabsTrigger
              value="pending"
              className="opacity-70 [font-family:'SF_Pro-Bold',Helvetica] font-bold text-white text-[15px] data-[state=active]:bg-transparent hover:bg-white/10"
            >
              Ожидание
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <Button className="absolute top-2 left-[681px] h-8 rounded-lg shadow-[0px_4px_12px_#6366f14c,0px_0px_8px_#6366f166] [background:linear-gradient(90deg,rgba(59,130,246,1)_0%,rgba(139,92,246,1)_100%)] hover:opacity-90 transition-opacity">
          <span className="[font-family:'SF_Pro-Medium',Helvetica] font-medium text-sm text-center text-white">
            Добавить в друзья
          </span>
        </Button>
      </div>
    </>
  );
} 