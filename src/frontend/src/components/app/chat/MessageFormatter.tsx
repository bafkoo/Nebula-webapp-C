import React, { useState, useRef } from 'react';
import { 
  Bold, 
  Italic, 
  Code, 
  Quote, 
  List, 
  ListOrdered, 
  Link,
  AtSign,
  Hash
} from 'lucide-react';
import { Button } from '../../ui/Button';
import { cn } from '../../../lib/utils';

interface MessageFormatterProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  className?: string;
}

const MessageFormatter: React.FC<MessageFormatterProps> = ({
  value,
  onChange,
  onSubmit,
  className
}) => {
  const [showToolbar, setShowToolbar] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Получение выделенного текста и позиции курсора
  const getSelection = () => {
    const textarea = textareaRef.current;
    if (!textarea) return { start: 0, end: 0, selectedText: '' };

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);

    return { start, end, selectedText };
  };

  // Вставка текста в позицию курсора
  const insertText = (before: string, after: string = '', placeholder?: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const { start, end, selectedText } = getSelection();
    const textToInsert = selectedText || placeholder || '';
    const newText = before + textToInsert + after;
    
    const newValue = value.substring(0, start) + newText + value.substring(end);
    onChange(newValue);

    // Восстанавливаем фокус и позицию курсора
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + before.length + textToInsert.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  // Обработчики форматирования
  const formatBold = () => insertText('**', '**', 'жирный текст');
  const formatItalic = () => insertText('*', '*', 'курсив');
  const formatCode = () => insertText('`', '`', 'код');
  const formatQuote = () => insertText('\n> ', '', 'цитата');
  const formatList = () => insertText('\n- ', '', 'элемент списка');
  const formatOrderedList = () => insertText('\n1. ', '', 'пронумерованный элемент');
  const formatLink = () => insertText('[', '](https://)', 'текст ссылки');
  const formatMention = () => insertText('@', '', 'username');
  const formatChannel = () => insertText('#', '', 'канал');

  // Обработка клавиш
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Ctrl/Cmd + Enter для отправки
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      onSubmit();
      return;
    }

    // Горячие клавиши для форматирования
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'b':
          e.preventDefault();
          formatBold();
          break;
        case 'i':
          e.preventDefault();
          formatItalic();
          break;
        case 'k':
          e.preventDefault();
          formatLink();
          break;
        case '`':
          e.preventDefault();
          formatCode();
          break;
      }
    }
  };

  const toolbarButtons = [
    { icon: Bold, action: formatBold, title: 'Жирный (Ctrl+B)', shortcut: 'Ctrl+B' },
    { icon: Italic, action: formatItalic, title: 'Курсив (Ctrl+I)', shortcut: 'Ctrl+I' },
    { icon: Code, action: formatCode, title: 'Код (Ctrl+`)', shortcut: 'Ctrl+`' },
    { icon: Quote, action: formatQuote, title: 'Цитата' },
    { icon: List, action: formatList, title: 'Список' },
    { icon: ListOrdered, action: formatOrderedList, title: 'Нумерованный список' },
    { icon: Link, action: formatLink, title: 'Ссылка (Ctrl+K)', shortcut: 'Ctrl+K' },
    { icon: AtSign, action: formatMention, title: '@упоминание' },
    { icon: Hash, action: formatChannel, title: '#канал' },
  ];

  return (
    <div className={cn("relative", className)}>
      {/* Панель инструментов */}
      {showToolbar && (
        <div className="mb-2 p-2 bg-muted/50 rounded-lg border border-border">
          <div className="flex items-center gap-1 flex-wrap">
            {toolbarButtons.map((button, index) => (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                onClick={button.action}
                className="h-8 w-8 p-0"
                title={button.title}
              >
                <button.icon size={14} />
              </Button>
            ))}
          </div>
          
          {/* Подсказки по горячим клавишам */}
          <div className="mt-2 text-xs text-muted-foreground">
            <p><strong>Горячие клавиши:</strong> Ctrl+B (жирный), Ctrl+I (курсив), Ctrl+K (ссылка), Ctrl+Enter (отправить)</p>
          </div>
        </div>
      )}

      {/* Текстовое поле */}
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowToolbar(true)}
          onBlur={(e) => {
            // Не скрываем панель если фокус перешел на кнопку в панели
            if (!e.currentTarget.closest('.relative')?.contains(e.relatedTarget as Node)) {
              setShowToolbar(false);
            }
          }}
          placeholder="Напишите сообщение... (поддерживается Markdown)"
          className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary min-h-[60px] max-h-[200px]"
          style={{
            height: 'auto',
            minHeight: '60px',
            maxHeight: '200px',
            scrollbarWidth: 'thin'
          }}
          onInput={(e) => {
            const target = e.target as HTMLTextAreaElement;
            target.style.height = 'auto';
            target.style.height = Math.min(target.scrollHeight, 200) + 'px';
          }}
        />

        {/* Предварительный просмотр Markdown */}
        {value && showToolbar && (
          <div className="mt-2 p-2 bg-muted/30 rounded border border-border">
            <p className="text-xs text-muted-foreground mb-1">Предварительный просмотр:</p>
            <div className="text-sm prose prose-sm dark:prose-invert max-w-none">
              {/* Простой предварительный просмотр */}
              <div
                dangerouslySetInnerHTML={{
                  __html: value
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/\*(.*?)\*/g, '<em>$1</em>')
                    .replace(/`(.*?)`/g, '<code class="bg-gray-700 px-1 rounded text-pink-400">$1</code>')
                    .replace(/@(\w+)/g, '<span class="text-blue-400">@$1</span>')
                    .replace(/#(\w+)/g, '<span class="text-green-400">#$1</span>')
                    .replace(/\n/g, '<br>')
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Подсказка по синтаксису */}
      {!showToolbar && value.length === 0 && (
        <div className="mt-1 text-xs text-muted-foreground">
          <p>
            <strong>Поддерживается Markdown:</strong> **жирный**, *курсив*, `код`, @упоминания, #каналы
          </p>
        </div>
      )}
    </div>
  );
};

export default MessageFormatter; 