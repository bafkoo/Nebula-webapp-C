import React from 'react';
import { Avatar } from '../../ui/Avatar';

interface Message {
  id: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: string;
  type: 'text' | 'system';
  isOwnMessage?: boolean;
}

interface ChatMessageItemProps {
  message: Message;
  className?: string;
}

const ChatMessageItem: React.FC<ChatMessageItemProps> = ({ 
  message, 
  className = "" 
}) => {
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('ru-RU', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // System message
  if (message.type === 'system') {
    return (
      <div className={`flex justify-center ${className}`}>
        <div className="flex items-center gap-2 px-3 py-1 bg-muted rounded-full">
          <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full"></div>
          <span className="text-xs text-muted-foreground">{message.content}</span>
          <span className="text-xs text-muted-foreground/70">{formatTime(message.createdAt)}</span>
        </div>
      </div>
    );
  }

  // Own message (right-aligned)
  if (message.isOwnMessage) {
    return (
      <div className={`flex justify-end ${className}`}>
        <div className="flex items-start gap-2 max-w-[85%]">
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs text-muted-foreground">{formatTime(message.createdAt)}</span>
              <span className="text-xs font-medium text-foreground">{message.userName}</span>
            </div>
            <div className="bg-primary text-primary-foreground px-3 py-2 rounded-lg rounded-tr-sm">
              <p className="text-sm leading-relaxed">{message.content}</p>
            </div>
          </div>
          <Avatar 
            username={message.userName}
            size="sm" 
            className="mt-6"
          />
        </div>
      </div>
    );
  }

  // Other user's message (left-aligned)
  return (
    <div className={`flex justify-start ${className}`}>
      <div className="flex items-start gap-2 max-w-[85%]">
        <Avatar 
          username={message.userName}
          size="sm" 
          className="mt-6"
        />
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium text-foreground">{message.userName}</span>
            <span className="text-xs text-muted-foreground">{formatTime(message.createdAt)}</span>
          </div>
          <div className="bg-muted text-foreground px-3 py-2 rounded-lg rounded-tl-sm">
            <p className="text-sm leading-relaxed">{message.content}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessageItem; 