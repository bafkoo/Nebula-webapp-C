import React, { useState } from 'react';
import { Download, File, Image, FileText, Archive, Eye, X } from 'lucide-react';
import { Button } from '../../ui/Button';

interface FileMessageProps {
  fileUrl: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  content?: string;
  className?: string;
}

export const FileMessage: React.FC<FileMessageProps> = ({
  fileUrl,
  fileName,
  fileSize,
  mimeType,
  content,
  className = ""
}) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Определение типа файла
  const getFileType = () => {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.includes('pdf') || 
        mimeType.includes('document') || 
        mimeType.includes('text') ||
        mimeType.includes('spreadsheet') ||
        mimeType.includes('presentation')) return 'document';
    if (mimeType.includes('zip') || 
        mimeType.includes('rar') || 
        mimeType.includes('archive')) return 'archive';
    return 'other';
  };

  const fileType = getFileType();

  // Иконка файла
  const getFileIcon = () => {
    switch (fileType) {
      case 'image':
        return <Image className="w-5 h-5" />;
      case 'document':
        return <FileText className="w-5 h-5" />;
      case 'archive':
        return <Archive className="w-5 h-5" />;
      default:
        return <File className="w-5 h-5" />;
    }
  };

  // Цвет иконки
  const getIconColor = () => {
    switch (fileType) {
      case 'image':
        return 'text-blue-500';
      case 'document':
        return 'text-green-500';
      case 'archive':
        return 'text-purple-500';
      default:
        return 'text-gray-500';
    }
  };

  // Форматирование размера файла
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Скачивание файла
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Открытие превью
  const handlePreview = () => {
    if (fileType === 'image') {
      setIsPreviewOpen(true);
    } else {
      // Для документов открываем в новой вкладке
      window.open(fileUrl, '_blank');
    }
  };

  return (
    <>
      <div className={`max-w-sm ${className}`}>
        {/* Текст сообщения если есть */}
        {content && content.trim() && (
          <div className="mb-2 text-sm text-gray-700 dark:text-gray-300">
            {content}
          </div>
        )}

        {/* Файл */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 border border-gray-200 dark:border-gray-600">
          <div className="flex items-start space-x-3">
            {/* Превью изображения или иконка */}
            <div className="flex-shrink-0">
              {fileType === 'image' && !imageError ? (
                <img
                  src={fileUrl}
                  alt={fileName}
                  className="w-12 h-12 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={handlePreview}
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className={`w-12 h-12 bg-white dark:bg-gray-600 rounded-lg flex items-center justify-center ${getIconColor()}`}>
                  {getFileIcon()}
                </div>
              )}
            </div>

            {/* Информация о файле */}
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {fileName}
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {formatFileSize(fileSize)}
              </p>
              
              {/* Кнопки действий */}
              <div className="flex space-x-2 mt-2">
                {(fileType === 'image' || fileType === 'document') && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handlePreview}
                    className="text-xs px-2 py-1 h-6"
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    Просмотр
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleDownload}
                  className="text-xs px-2 py-1 h-6"
                >
                  <Download className="w-3 h-3 mr-1" />
                  Скачать
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Модальное окно превью изображения */}
      {isPreviewOpen && fileType === 'image' && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setIsPreviewOpen(false)}
        >
          <div className="relative max-w-4xl max-h-full">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsPreviewOpen(false)}
              className="absolute top-4 right-4 z-10 bg-black bg-opacity-50 text-white hover:bg-opacity-70"
            >
              <X className="w-4 h-4" />
            </Button>
            <img
              src={fileUrl}
              alt={fileName}
              className="max-w-full max-h-full object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
            <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-3 py-2 rounded-lg">
              <p className="text-sm font-medium">{fileName}</p>
              <p className="text-xs opacity-75">{formatFileSize(fileSize)}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}; 