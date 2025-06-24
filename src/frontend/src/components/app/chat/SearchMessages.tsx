import React, { useState, useEffect, useCallback } from 'react';
import { Search, Filter, User, FileText, X, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '../../ui/Button';
import type { MessageType } from '../../../types/chat';
import { useDebounce } from '../../../hooks/useDebounce';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { 
  apiClient, 
  type SearchMessagesRequest, 
  type SearchMessageResultDto, 
  type HighlightFragment 
} from '../../../lib/api';

interface SearchMessagesProps {
  chatId?: string; // Если передан, поиск только в этом чате
  onMessageSelect: (messageId: string) => void;
  onClose: () => void;
  className?: string;
}

interface SearchFilters {
  authorId?: string;
  messageType?: MessageType;
  startDate?: string;
  endDate?: string;
}

export const SearchMessages: React.FC<SearchMessagesProps> = ({
  chatId,
  onMessageSelect,
  onClose,
  className = ""
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchMessageResultDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({});
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const debouncedQuery = useDebounce(query, 300);

  // Поиск сообщений
  const searchMessages = useCallback(async (searchQuery: string, searchPage: number = 1) => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    try {
      if (chatId) {
        // Поиск в конкретном чате
        const response = await apiClient.searchInChat(chatId, searchQuery, searchPage, 20);
        
        if (searchPage === 1) {
          setResults(response.messages);
        } else {
          setResults(prev => [...prev, ...response.messages]);
        }
        
        setTotalCount(response.totalCount);
        setTotalPages(response.totalPages);
      } else {
        // Глобальный поиск
        const request: SearchMessagesRequest = {
          query: searchQuery,
          authorId: filters.authorId,
          messageType: filters.messageType,
          startDate: filters.startDate,
          endDate: filters.endDate,
          page: searchPage,
          pageSize: 20
        };

        const response = await apiClient.searchMessages(request);
        
        if (searchPage === 1) {
          setResults(response.messages);
        } else {
          setResults(prev => [...prev, ...response.messages]);
        }
        
        setTotalCount(response.totalCount);
        setTotalPages(response.totalPages);
      }
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
      // Можно добавить toast уведомление об ошибке
    } finally {
      setIsLoading(false);
    }
  }, [chatId, filters]);

  // Автоматический поиск при изменении запроса
  useEffect(() => {
    if (debouncedQuery) {
      setPage(1);
      searchMessages(debouncedQuery, 1);
    } else {
      setResults([]);
    }
  }, [debouncedQuery, searchMessages]);

  // Загрузка следующей страницы
  const loadMore = () => {
    if (page < totalPages && !isLoading) {
      const nextPage = page + 1;
      setPage(nextPage);
      searchMessages(debouncedQuery, nextPage);
    }
  };

  // Применение фильтров
  const applyFilters = (newFilters: SearchFilters) => {
    setFilters(newFilters);
    setPage(1);
    if (debouncedQuery) {
      searchMessages(debouncedQuery, 1);
    }
  };

  // Очистка фильтров
  const clearFilters = () => {
    setFilters({});
    setPage(1);
    if (debouncedQuery) {
      searchMessages(debouncedQuery, 1);
    }
  };

  // Рендер подсвеченного текста
  const renderHighlightedText = (fragments: HighlightFragment[]) => {
    return fragments.map((fragment, index) => (
      <span 
        key={index} 
        className={fragment.isHighlighted ? 'bg-yellow-200 dark:bg-yellow-800 px-1 rounded' : ''}
      >
        {fragment.text}
      </span>
    ));
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {chatId ? 'Поиск в чате' : 'Поиск сообщений'}
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
        
        {/* Search Input */}
        <div className="mt-4 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Поиск сообщений..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 
                     rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Filters Toggle */}
        <div className="mt-3 flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="text-gray-600 dark:text-gray-300"
          >
            <Filter className="w-4 h-4 mr-2" />
            Фильтры
            {showFilters ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />}
          </Button>
          
          {results.length > 0 && (
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Найдено: {totalCount} сообщений
            </span>
          )}
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg space-y-3">
            <div className="grid grid-cols-2 gap-3">
              {/* Author Filter */}
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Автор
                </label>
                <input
                  type="text"
                  placeholder="Имя пользователя"
                  value={filters.authorId || ''}
                  onChange={(e) => setFilters(prev => ({ ...prev, authorId: e.target.value || undefined }))}
                  className="w-full px-3 py-1 text-sm bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 
                           rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Message Type Filter */}
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Тип сообщения
                </label>
                <select
                  value={filters.messageType || ''}
                  onChange={(e) => setFilters(prev => ({ ...prev, messageType: e.target.value as MessageType || undefined }))}
                  className="w-full px-3 py-1 text-sm bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 
                           rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">Все типы</option>
                  <option value="Text">Текст</option>
                  <option value="Image">Изображения</option>
                  <option value="File">Файлы</option>
                  <option value="Voice">Голосовые</option>
                  <option value="Video">Видео</option>
                </select>
              </div>

              {/* Start Date */}
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  С даты
                </label>
                <input
                  type="date"
                  value={filters.startDate || ''}
                  onChange={(e) => setFilters(prev => ({ ...prev, startDate: e.target.value || undefined }))}
                  className="w-full px-3 py-1 text-sm bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 
                           rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* End Date */}
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                  До даты
                </label>
                <input
                  type="date"
                  value={filters.endDate || ''}
                  onChange={(e) => setFilters(prev => ({ ...prev, endDate: e.target.value || undefined }))}
                  className="w-full px-3 py-1 text-sm bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 
                           rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                size="sm"
                onClick={() => applyFilters(filters)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Применить
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={clearFilters}
                className="text-gray-600 dark:text-gray-300"
              >
                Очистить
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      <div className="max-h-96 overflow-y-auto">
        {isLoading && results.length === 0 ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            <Search className="w-8 h-8 mx-auto mb-2 animate-pulse" />
            Поиск...
          </div>
        ) : results.length === 0 && query.length >= 2 ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            <Search className="w-8 h-8 mx-auto mb-2" />
            Ничего не найдено
          </div>
        ) : results.length === 0 ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            <Search className="w-8 h-8 mx-auto mb-2" />
            Введите запрос для поиска
          </div>
        ) : (
          <div className="space-y-1">
            {results.map((result) => (
              <button
                key={result.id}
                onClick={() => onMessageSelect(result.id)}
                className="w-full text-left p-4 hover:bg-gray-50 dark:hover:bg-gray-700 border-b 
                         border-gray-100 dark:border-gray-600 transition-colors"
              >
                <div className="flex items-start space-x-3">
                  {/* Avatar */}
                  <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    {/* Header */}
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-sm text-gray-900 dark:text-white">
                        {result.userName}
                      </span>
                      {!chatId && (
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          в {result.chatName}
                        </span>
                      )}
                      <span className="text-xs text-gray-400 dark:text-gray-500">
                        {format(new Date(result.createdAt), 'dd MMM HH:mm', { locale: ru })}
                      </span>
                      {result.type !== 'Text' && (
                        <FileText className="w-3 h-3 text-gray-400" />
                      )}
                    </div>
                    
                    {/* Content */}
                    <div className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                      {renderHighlightedText(result.highlightedContent)}
                    </div>
                  </div>
                </div>
              </button>
            ))}
            
            {/* Load More */}
            {page < totalPages && (
              <div className="p-4 text-center">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={loadMore}
                  disabled={isLoading}
                  className="text-blue-600 hover:text-blue-700"
                >
                  {isLoading ? 'Загрузка...' : 'Загрузить ещё'}
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}; 