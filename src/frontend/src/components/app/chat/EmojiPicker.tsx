import React, { useState, useRef, useEffect } from 'react';
import EmojiPickerComponent, { type EmojiClickData, Theme } from 'emoji-picker-react';
import { Smile, X } from 'lucide-react';
import { Button } from '../../ui/Button';
import { cn } from '../../../lib/utils';

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
  className?: string;
}

const EmojiPicker: React.FC<EmojiPickerProps> = ({ onEmojiSelect, className }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [recentEmojis, setRecentEmojis] = useState<string[]>([]);
  const pickerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Закрытие при клике вне компонента
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        pickerRef.current && 
        !pickerRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Загрузка недавних эмодзи из localStorage
  useEffect(() => {
    const saved = localStorage.getItem('nebula-recent-emojis');
    if (saved) {
      try {
        setRecentEmojis(JSON.parse(saved));
      } catch (error) {
        console.warn('Ошибка загрузки недавних эмодзи:', error);
      }
    }
  }, []);

  // Сохранение недавних эмодзи
  const saveRecentEmojis = (emojis: string[]) => {
    try {
      localStorage.setItem('nebula-recent-emojis', JSON.stringify(emojis));
    } catch (error) {
      console.warn('Ошибка сохранения недавних эмодзи:', error);
    }
  };

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    const emoji = emojiData.emoji;
    onEmojiSelect(emoji);
    
    // Добавляем в недавние (без дубликатов, максимум 20)
    const newRecent = [emoji, ...recentEmojis.filter(e => e !== emoji)].slice(0, 20);
    setRecentEmojis(newRecent);
    saveRecentEmojis(newRecent);
    
    setIsOpen(false);
  };

  const handleQuickEmojiClick = (emoji: string) => {
    onEmojiSelect(emoji);
    
    // Добавляем в недавние
    const newRecent = [emoji, ...recentEmojis.filter(e => e !== emoji)].slice(0, 20);
    setRecentEmojis(newRecent);
    saveRecentEmojis(newRecent);
  };

  // Часто используемые эмодзи для быстрого доступа
  const quickEmojis = ['😀', '😂', '😊', '😍', '🤔', '👍', '👎', '❤️', '🔥', '💯'];

  return (
    <div className={cn("relative", className)}>
      {/* Быстрые эмодзи */}
      <div className="flex items-center gap-1 mb-2">
        {quickEmojis.map((emoji, index) => (
          <button
            key={index}
            onClick={() => handleQuickEmojiClick(emoji)}
            className="w-8 h-8 flex items-center justify-center rounded hover:bg-muted/70 transition-colors text-lg"
            title={`Вставить ${emoji}`}
          >
            {emoji}
          </button>
        ))}
        
        {/* Кнопка открытия полного picker */}
        <Button
          ref={buttonRef}
          variant="ghost"
          size="sm"
          onClick={() => setIsOpen(!isOpen)}
          className="w-8 h-8 p-0 ml-2"
          title={isOpen ? "Закрыть эмодзи" : "Выбрать эмодзи"}
        >
          {isOpen ? <X size={16} /> : <Smile size={16} />}
        </Button>
      </div>

      {/* Недавние эмодзи */}
      {recentEmojis.length > 0 && (
        <div className="mb-2">
          <p className="text-xs text-muted-foreground mb-1">Недавние:</p>
          <div className="flex items-center gap-1 flex-wrap">
            {recentEmojis.slice(0, 10).map((emoji, index) => (
              <button
                key={index}
                onClick={() => handleQuickEmojiClick(emoji)}
                className="w-7 h-7 flex items-center justify-center rounded hover:bg-muted/70 transition-colors text-sm"
                title={`Вставить ${emoji}`}
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Полный Emoji Picker */}
      {isOpen && (
        <div 
          ref={pickerRef}
          className="absolute bottom-full right-0 mb-2 z-50 shadow-xl border border-border rounded-lg overflow-hidden"
        >
          <EmojiPickerComponent
            onEmojiClick={handleEmojiClick}
            theme={Theme.DARK}
            width={320}
            height={400}
            searchPlaceholder="Поиск эмодзи..."
            previewConfig={{
              showPreview: false
            }}
            skinTonesDisabled={false}
            lazyLoadEmojis={true}
          />
        </div>
      )}
    </div>
  );
};

export default EmojiPicker; 