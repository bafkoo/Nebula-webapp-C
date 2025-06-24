import React, { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
import { ChatSearchIcon } from '../../icons/Icons';
import type { ChatDto } from '../../../types/chat';

interface ChatHeaderProps {
  isExpanded: boolean;
  onToggleExpand: () => void;
  activeChat: string | null;
  onChatChange: (chatId: string) => void;
  className?: string;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  isExpanded,
  onToggleExpand,
  activeChat,
  onChatChange,
  className = ""
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [chats] = useState<ChatDto[]>([
    { id: '1', name: 'Общий чат', type: 'group', createdBy: 'user1', createdAt: '2024-01-01', description: 'Основной чат команды' },
    { id: '2', name: 'Алексей М.', type: 'private', createdBy: 'user2', createdAt: '2024-01-02' },
    { id: '3', name: 'Проект Alpha', type: 'group', createdBy: 'user1', createdAt: '2024-01-03', description: 'Обсуждение проекта Alpha' },
  ]);

  const activeChatData = chats.find(chat => chat.id === activeChat);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const selectChat = (chatId: string) => {
    onChatChange(chatId);
    setIsDropdownOpen(false);
  };

  return (
    <div className={`p-4 border-b border-border bg-card ${className}`}>
      <div className="flex items-center justify-between">
        {/* Chat Selector */}
        <div className="flex-1 relative">
          <button
            onClick={toggleDropdown}
            className="flex items-center gap-2 w-full text-left hover:bg-muted rounded-md px-2 py-1 transition-colors"
          >
            <ChatSearchIcon size={16} className="text-muted-foreground" />
            <span className="text-sm font-medium text-foreground truncate">
              {activeChatData?.name || 'Выберите чат'}
            </span>
            {isDropdownOpen ? (
              <ChevronUpIcon size={16} className="text-muted-foreground ml-auto" />
            ) : (
              <ChevronDownIcon size={16} className="text-muted-foreground ml-auto" />
            )}
          </button>

          {/* Dropdown */}
          {isDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-md shadow-lg z-10 max-h-48 overflow-y-auto">
              {chats.map(chat => (
                <button
                  key={chat.id}
                  onClick={() => selectChat(chat.id)}
                  className={`w-full text-left px-3 py-2 hover:bg-muted transition-colors ${
                    chat.id === activeChat ? 'bg-muted' : ''
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      chat.type === 'private' ? 'bg-green-500' : 'bg-blue-500'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-foreground truncate">
                        {chat.name}
                      </div>
                      {chat.description && (
                        <div className="text-xs text-muted-foreground truncate">
                          {chat.description}
                        </div>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Expand/Collapse Button */}
        <button
          onClick={onToggleExpand}
          className="ml-2 p-1 hover:bg-muted rounded transition-colors"
          title={isExpanded ? 'Свернуть чат' : 'Развернуть чат'}
        >
          {isExpanded ? (
            <ChevronUpIcon size={16} className="text-muted-foreground" />
          ) : (
            <ChevronDownIcon size={16} className="text-muted-foreground" />
          )}
        </button>
      </div>
    </div>
  );
};

export default ChatHeader; 