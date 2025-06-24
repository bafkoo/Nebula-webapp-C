import React from 'react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Check, Clock, AlertCircle } from 'lucide-react';
import { cn } from '../../../lib/utils';
import type { MessageDto } from '../../../types/chat';
import { Avatar } from '../../ui/Avatar';

interface ChatMessageItemProps {
  message: MessageDto;
  isCurrentUser: boolean;
  showAvatar: boolean;
}

const ChatMessageItem: React.FC<ChatMessageItemProps> = ({ message, isCurrentUser, showAvatar }) => {

  const renderMessageStatus = () => {
    if (message.hasError) {
      return <AlertCircle className="h-4 w-4 text-red-500" aria-label="Ошибка отправки" />;
    }
    if (message.isSending) {
      return <Clock className="h-4 w-4 text-muted-foreground animate-spin" aria-label="Отправка..." />;
    }
    // TODO: Implement read status
    // if (message.isRead) {
    //   return <CheckCheck className="h-4 w-4 text-blue-500" />;
    // }
    return <Check className="h-4 w-4 text-muted-foreground" />;
  };

  return (
    <div className={cn("flex items-end gap-2", isCurrentUser ? "justify-end" : "justify-start")}>
      {!isCurrentUser && (
        <div className="w-8">
          {showAvatar && (
            <Avatar 
              size="sm"
              src={message.avatarUrl} 
              username={message.userName}
              alt={`Аватар ${message.userName}`}
            />
          )}
        </div>
      )}

      <div
        className={cn(
          "max-w-xs md:max-w-md lg:max-w-lg rounded-lg px-3 py-2 text-sm",
          isCurrentUser
            ? "bg-primary text-primary-foreground rounded-br-none"
            : "bg-muted text-foreground rounded-bl-none"
        )}
      >
        {!isCurrentUser && showAvatar && (
          <p className="font-semibold text-xs mb-1">{message.userName}</p>
        )}
        <p className="whitespace-pre-wrap">{message.content}</p>
        <div className="flex items-center gap-2 mt-1 text-xs text-right opacity-70">
          <span>{format(new Date(message.createdAt), 'HH:mm', { locale: ru })}</span>
          {isCurrentUser && renderMessageStatus()}
        </div>
      </div>
    </div>
  );
};

export default ChatMessageItem; 