import React, { useState } from 'react';
import { Send, Paperclip } from 'lucide-react';
import { Button } from '../../ui/Button';
import MessageFormatter from './MessageFormatter';
import EmojiPicker from './EmojiPicker';
import { FileUpload } from './FileUpload';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  onFileUpload: (file: File, content?: string) => void;
  onTyping: (isTyping: boolean) => void;
  disabled?: boolean;
  className?: string;
}

const ChatInput: React.FC<ChatInputProps> = ({ 
  onSendMessage, 
  onFileUpload,
  onTyping,
  disabled = false,
  className = "" 
}) => {
  const [message, setMessage] = useState('');
  const [showFileUpload, setShowFileUpload] = useState(false);

  const handleSend = () => {
    const trimmedMessage = message.trim();
    if (trimmedMessage && !disabled) {
      onSendMessage(trimmedMessage);
      setMessage('');
      onTyping(false);
    }
  };

  const handleMessageChange = (newMessage: string) => {
    setMessage(newMessage);
    onTyping(newMessage.length > 0);
  };

  const handleEmojiSelect = (emoji: string) => {
    setMessage(prev => prev + emoji);
    onTyping(true);
  };

  const handleFileSelect = (file: File) => {
    const content = message.trim() || undefined;
    onFileUpload(file, content);
    setMessage('');
    setShowFileUpload(false);
    onTyping(false);
  };

  const handleFileUploadCancel = () => {
    setShowFileUpload(false);
  };

  const handleFileButtonClick = () => {
    setShowFileUpload(true);
  };

  return (
    <div className={`p-3 bg-card border-t border-border ${className}`}>
      {/* File Upload Modal */}
      {showFileUpload && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="w-full max-w-md">
            <FileUpload
              onFileSelect={handleFileSelect}
              onCancel={handleFileUploadCancel}
            />
          </div>
        </div>
      )}

      {/* Emoji Picker */}
      <EmojiPicker 
        onEmojiSelect={handleEmojiSelect}
        className="mb-3"
      />

      <div className="flex gap-2 items-end">
        {/* File Upload Button */}
        <Button
          onClick={handleFileButtonClick}
          disabled={disabled}
          size="sm"
          variant="ghost"
          className="h-10 w-10 p-0 flex-shrink-0 self-end text-muted-foreground hover:text-foreground"
          title="Прикрепить файл"
        >
          <Paperclip size={16} />
        </Button>

        {/* Message Formatter */}
        <div className="flex-1">
          <MessageFormatter
            value={message}
            onChange={handleMessageChange}
            onSubmit={handleSend}
            className="w-full"
          />
        </div>

        {/* Send Button */}
        <Button
          onClick={handleSend}
          disabled={disabled || !message.trim()}
          size="sm"
          className="h-10 w-10 p-0 flex-shrink-0 self-end"
          title="Отправить сообщение (Ctrl+Enter)"
        >
          <Send size={16} />
        </Button>
      </div>

      {/* Status and character count */}
      <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
        <span>
          {disabled ? "Выберите чат для отправки сообщения" : "Ctrl+Enter - отправить, поддерживается Markdown"}
        </span>
        <span className={`${message.length > 1500 ? 'text-red-500' : message.length > 1000 ? 'text-yellow-500' : ''}`}>
          {message.length}/2000
        </span>
      </div>
    </div>
  );
};

export default ChatInput; 