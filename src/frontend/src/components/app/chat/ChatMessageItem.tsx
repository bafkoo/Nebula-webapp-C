import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Check, Clock, AlertCircle } from 'lucide-react';
import { cn } from '../../../lib/utils';
import type { MessageDto } from '../../../types/chat';
import { Avatar } from '../../ui/Avatar';
import MessageRenderer from './MessageRenderer';
import { FileMessage } from './FileMessage';

interface ChatMessageItemProps {
  message: MessageDto;
  isCurrentUser: boolean;
  showAvatar: boolean;
  isNew?: boolean;
}

const ChatMessageItem: React.FC<ChatMessageItemProps> = ({ message, isCurrentUser, showAvatar, isNew = false }) => {
  const [isVisible, setIsVisible] = useState(!isNew);
  const [hasError, setHasError] = useState(message.hasError);

  useEffect(() => {
    if (isNew) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isNew]);

  useEffect(() => {
    setHasError(message.hasError);
  }, [message.hasError]);

  const renderMessageStatus = () => {
    if (hasError) {
      return <AlertCircle className="h-4 w-4 text-red-500 animate-bounce-in" aria-label="Ошибка отправки" />;
    }
    if (message.isSending) {
      return <Clock className="h-4 w-4 text-muted-foreground animate-spin" aria-label="Отправка..." />;
    }
    // TODO: Implement read status
    // if (message.isRead) {
    //   return <CheckCheck className="h-4 w-4 text-blue-500" />;
    // }
    return <Check className="h-4 w-4 text-muted-foreground animate-scale-in" />;
  };

  // Определяем, есть ли файл в сообщении
  const hasFile = message.type !== 'Text' && message.fileUrl;

  return (
    <div 
      className={cn(
        "flex items-end gap-2 transition-all duration-300",
        isCurrentUser ? "justify-end" : "justify-start",
        !isVisible && "opacity-0 translate-y-2",
        isVisible && isNew && "animate-fade-in-up",
        hasError && "animate-pulse-glow"
      )}
    >
      {!isCurrentUser && (
        <div className="w-8">
          {showAvatar && (
            <Avatar 
              size="sm"
              src={message.avatarUrl} 
              username={message.userName}
              alt={`Аватар ${message.userName}`}
              className={cn(
                "transition-all duration-200",
                isNew && "animate-scale-in"
              )}
            />
          )}
        </div>
      )}

      <div
        className={cn(
          "max-w-xs md:max-w-md lg:max-w-lg rounded-lg text-sm transition-all duration-200",
          "hover:shadow-md transform hover:scale-[1.02] chat-message-shadow",
          !hasFile && "px-3 py-2", // Применяем padding только если нет файла
          isCurrentUser
            ? "bg-primary text-primary-foreground rounded-br-none"
            : "bg-muted text-foreground rounded-bl-none",
          message.isSending && "opacity-70",
          hasError && "bg-destructive/10 border border-destructive/20"
        )}
      >
        {!isCurrentUser && showAvatar && (
          <p className={cn(
            "font-semibold text-xs mb-1",
            isNew && "animate-fade-in-up",
            "text-primary",
            hasFile && "px-3 pt-2"
          )}>
            {message.userName}
          </p>
        )}
        
        {hasFile ? (
          <FileMessage
            fileUrl={message.fileUrl!}
            fileName={message.fileName || 'Неизвестный файл'}
            fileSize={message.fileSize || 0}
            mimeType={message.mimeType || 'application/octet-stream'}
            content={message.content}
            className={cn(
              "message-content",
              isNew && "animate-fade-in-up",
              "p-3"
            )}
          />
        ) : (
          <MessageRenderer 
            content={message.content}
            isCurrentUser={isCurrentUser}
            className={cn(
              "message-content",
              isNew && "animate-fade-in-up"
            )}
          />
        )}
        
        <div className={cn(
          "flex items-center gap-2 mt-2 text-xs text-right opacity-70",
          isNew && "animate-fade-in-up",
          hasFile && "px-3 pb-2"
        )}>
          <span>{format(new Date(message.createdAt), 'HH:mm', { locale: ru })}</span>
          {isCurrentUser && renderMessageStatus()}
        </div>
      </div>
    </div>
  );
};

export default ChatMessageItem; 