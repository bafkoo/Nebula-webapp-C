import React, { useState, type KeyboardEvent } from 'react';
import { Send } from 'lucide-react';
import { Button } from '../../ui/Button';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  onTyping: (isTyping: boolean) => void;
  disabled?: boolean;
  className?: string;
}

const ChatInput: React.FC<ChatInputProps> = ({ 
  onSendMessage, 
  onTyping,
  disabled = false,
  className = "" 
}) => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    const trimmedMessage = message.trim();
    if (trimmedMessage && !disabled) {
      onSendMessage(trimmedMessage);
      setMessage('');
      onTyping(false);
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    onTyping(e.target.value.length > 0);
  };

  return (
    <div className={`p-3 bg-card ${className}`}>
      <div className="flex gap-2 items-end">
        {/* Message Input */}
        <div className="flex-1 relative">
          <textarea
            value={message}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            disabled={disabled}
            placeholder={disabled ? "Выберите чат для отправки сообщения" : "Напишите сообщение... (Enter для отправки)"}
            className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:opacity-50 disabled:cursor-not-allowed min-h-[36px] max-h-[80px]"
            rows={1}
            style={{
              height: 'auto',
              minHeight: '36px',
              maxHeight: '80px',
              scrollbarWidth: 'thin'
            }}
            onInput={(e) => {
              const target = e.target as HTMLTextAreaElement;
              target.style.height = 'auto';
              target.style.height = Math.min(target.scrollHeight, 80) + 'px';
            }}
          />
        </div>

        {/* Send Button */}
        <Button
          onClick={handleSend}
          disabled={disabled || !message.trim()}
          size="sm"
          className="h-9 w-9 p-0 flex-shrink-0"
          title="Отправить сообщение"
        >
          <Send size={16} />
        </Button>
      </div>

      {/* Hints */}
      <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
        <span>
          {disabled ? "Выберите чат" : "Enter - отправить, Shift+Enter - новая строка"}
        </span>
        <span className={`${message.length > 1000 ? 'text-red-500' : ''}`}>
          {message.length}/1000
        </span>
      </div>
    </div>
  );
};

export default ChatInput; 