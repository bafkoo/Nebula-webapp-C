import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

// Mock data for server icons
const serverIcons = Array(7).fill(null);

export default function ServerSidebar() {
  return (
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
  );
} 