import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import rehypeHighlight from 'rehype-highlight';
import rehypeRaw from 'rehype-raw';
import { ExternalLink } from 'lucide-react';
import { cn } from '../../../lib/utils';
import 'prismjs/themes/prism-tomorrow.css';

interface MessageRendererProps {
  content: string;
  isCurrentUser: boolean;
  className?: string;
}

interface LinkPreview {
  url: string;
  title?: string;
  description?: string;
  image?: string;
  siteName?: string;
}

const MessageRenderer: React.FC<MessageRendererProps> = ({ 
  content, 
  isCurrentUser, 
  className 
}) => {
  const [linkPreviews, setLinkPreviews] = useState<LinkPreview[]>([]);
  const [isLoadingPreviews, setIsLoadingPreviews] = useState(false);

  // Извлечение URL из текста
  const extractUrls = (text: string): string[] => {
    const urlRegex = /(https?:\/\/[^\s]+)/gi;
    return text.match(urlRegex) || [];
  };

  // Обработка @mentions и #channels в тексте
  const processText = (text: string): string => {
    return text
      .replace(/@(\w+)/g, '<span class="mention" data-username="$1">@$1</span>')
      .replace(/#(\w+)/g, '<span class="text-green-400">#$1</span>');
  };

  // Загрузка превью ссылок (заглушка)
  useEffect(() => {
    const urls = extractUrls(content);
    if (urls.length > 0) {
      setIsLoadingPreviews(true);
      
      // Симуляция загрузки превью
      setTimeout(() => {
        const previews: LinkPreview[] = urls.map(url => ({
          url,
          title: 'Пример заголовка',
          description: 'Это пример описания ссылки для демонстрации функциональности превью.',
          image: 'https://via.placeholder.com/300x200?text=Preview',
          siteName: new URL(url).hostname
        }));
        
        setLinkPreviews(previews);
        setIsLoadingPreviews(false);
      }, 1000);
    }
  }, [content]);

  return (
    <div className={cn("message-renderer", className)}>
      {/* Основное содержимое с Markdown */}
      <div className="prose prose-sm dark:prose-invert max-w-none">
        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkBreaks]}
          rehypePlugins={[rehypeHighlight, rehypeRaw]}
          components={{
            // Кастомная обработка ссылок
            a: ({ href, children, ...props }) => (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 underline decoration-dotted",
                  isCurrentUser ? "text-blue-200 hover:text-blue-100" : ""
                )}
                {...props}
              >
                {children}
                <ExternalLink size={12} />
              </a>
            ),
            
            // Кастомная обработка кода
            code: ({ children, className, ...props }) => {
              const isInline = !className;
              return (
                <code
                  className={cn(
                    isInline
                      ? "px-1.5 py-0.5 rounded text-xs font-mono bg-gray-800 text-pink-400"
                      : "block p-3 rounded-lg overflow-x-auto text-xs font-mono bg-gray-900 text-gray-100",
                    className
                  )}
                  {...props}
                >
                  {children}
                </code>
              );
            },

            // Кастомная обработка блоков кода
            pre: ({ children, ...props }) => (
              <pre
                className="my-2 overflow-x-auto rounded-lg bg-gray-900 text-gray-100"
                {...props}
              >
                {children}
              </pre>
            ),

            // Кастомная обработка цитат
            blockquote: ({ children, ...props }) => (
              <blockquote
                className={cn(
                  "border-l-4 pl-4 py-2 my-2 italic",
                  isCurrentUser 
                    ? "border-blue-200 bg-blue-50/10" 
                    : "border-gray-400 bg-gray-50/10"
                )}
                {...props}
              >
                {children}
              </blockquote>
            ),

            // Обработка параграфов для mentions и channels
            p: ({ children, ...props }) => {
              // Преобразуем детей в строку для обработки
              const textContent = React.Children.toArray(children).join('');
              const processedContent = processText(textContent);
              
              return (
                <p
                  className="my-1 last:mb-0"
                  dangerouslySetInnerHTML={{
                    __html: processedContent
                  }}
                  {...props}
                />
              );
            }
          }}
        >
          {content}
        </ReactMarkdown>
      </div>

      {/* Превью ссылок */}
      {(linkPreviews.length > 0 || isLoadingPreviews) && (
        <div className="mt-3 space-y-2">
          {isLoadingPreviews ? (
            <div className="p-3 bg-muted/50 rounded-lg border border-border animate-pulse">
              <div className="flex gap-3">
                <div className="w-16 h-12 bg-muted rounded"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-muted rounded w-3/4"></div>
                  <div className="h-2 bg-muted rounded w-1/2"></div>
                </div>
              </div>
            </div>
          ) : (
            linkPreviews.map((preview, index) => (
              <a
                key={index}
                href={preview.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-3 bg-muted/50 rounded-lg border border-border hover:bg-muted/70 transition-colors"
              >
                <div className="flex gap-3">
                  {preview.image && (
                    <img
                      src={preview.image}
                      alt="Link preview"
                      className="w-16 h-12 object-cover rounded flex-shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    {preview.title && (
                      <h4 className="text-sm font-medium text-foreground truncate">
                        {preview.title}
                      </h4>
                    )}
                    {preview.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                        {preview.description}
                      </p>
                    )}
                    {preview.siteName && (
                      <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                        <ExternalLink size={10} />
                        {preview.siteName}
                      </p>
                    )}
                  </div>
                </div>
              </a>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default MessageRenderer; 