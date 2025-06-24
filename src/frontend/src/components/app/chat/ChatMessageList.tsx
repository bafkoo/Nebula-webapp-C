import React from 'react';
import ChatMessageItem from './ChatMessageItem';
import type { MessageDto } from '../../../types/chat';
import { Loader2 } from 'lucide-react';

interface ChatMessageListProps {
  messages: MessageDto[];
  currentUserId: string;
  isLoading: boolean;
  className?: string;
}

const ChatMessageList: React.FC<ChatMessageListProps> = ({ messages, currentUserId, isLoading, className = "" }) => {
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted-foreground">
        <Loader2 className="animate-spin mr-2" size={20} />
        Загрузка сообщений...
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted-foreground">
        Сообщений пока нет. Начните диалог!
      </div>
    );
  }
  
  return (
    <div className={`flex-1 overflow-y-auto p-4 space-y-4 ${className}`}>
      {messages.map((message, index) => {
        const isCurrentUser = message.userId === currentUserId;
        const showAvatar = index === messages.length - 1 || messages[index + 1].userId !== message.userId;

        return (
          <ChatMessageItem
            key={message.id || index}
            message={message}
            isCurrentUser={isCurrentUser}
            showAvatar={showAvatar}
          />
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessageList; 