import React, { useState, useRef, useCallback } from 'react';
import { Upload, X, File, Image, FileText, Archive } from 'lucide-react';
import { Button } from '../../ui/Button';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  onCancel: () => void;
  maxFileSize?: number; // в байтах
  allowedTypes?: string[];
  className?: string;
}

interface FilePreview {
  file: File;
  url?: string;
  type: 'image' | 'document' | 'archive' | 'other';
}

export const FileUpload: React.FC<FileUploadProps> = ({
  onFileSelect,
  onCancel,
  maxFileSize = 10 * 1024 * 1024, // 10 MB по умолчанию
  allowedTypes = [
    '.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', // images
    '.pdf', '.doc', '.docx', '.txt', '.rtf', '.xls', '.xlsx', '.ppt', '.pptx', // documents
    '.zip', '.rar', '.7z', '.tar', '.gz' // archives
  ],
  className = ""
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<FilePreview | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Определение типа файла
  const getFileType = (fileName: string): FilePreview['type'] => {
    const ext = fileName.toLowerCase();
    if (['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp'].some(e => ext.endsWith(e))) {
      return 'image';
    }
    if (['.pdf', '.doc', '.docx', '.txt', '.rtf', '.xls', '.xlsx', '.ppt', '.pptx'].some(e => ext.endsWith(e))) {
      return 'document';
    }
    if (['.zip', '.rar', '.7z', '.tar', '.gz'].some(e => ext.endsWith(e))) {
      return 'archive';
    }
    return 'other';
  };

  // Иконка файла по типу
  const getFileIcon = (type: FilePreview['type']) => {
    switch (type) {
      case 'image':
        return <Image className="w-8 h-8 text-blue-500" />;
      case 'document':
        return <FileText className="w-8 h-8 text-green-500" />;
      case 'archive':
        return <Archive className="w-8 h-8 text-purple-500" />;
      default:
        return <File className="w-8 h-8 text-gray-500" />;
    }
  };

  // Валидация файла
  const validateFile = (file: File): string | null => {
    if (file.size > maxFileSize) {
      return `Размер файла превышает ${Math.round(maxFileSize / 1024 / 1024)} MB`;
    }

    const extension = '.' + file.name.split('.').pop()?.toLowerCase();
    if (!allowedTypes.includes(extension)) {
      return `Тип файла не поддерживается. Разрешены: ${allowedTypes.join(', ')}`;
    }

    return null;
  };

  // Обработка выбора файла
  const handleFileSelect = useCallback((file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    const fileType = getFileType(file.name);
    
    // Создаем preview для изображений
    let url: string | undefined;
    if (fileType === 'image') {
      url = URL.createObjectURL(file);
    }

    setSelectedFile({ file, url, type: fileType });
  }, [maxFileSize, allowedTypes]);

  // Drag & Drop handlers
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  }, [handleFileSelect]);

  // Обработка клика по input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  // Подтверждение выбора файла
  const handleConfirm = () => {
    if (selectedFile) {
      onFileSelect(selectedFile.file);
      // Очистка объекта URL для предотвращения утечек памяти
      if (selectedFile.url) {
        URL.revokeObjectURL(selectedFile.url);
      }
    }
  };

  // Отмена выбора файла
  const handleCancel = () => {
    if (selectedFile?.url) {
      URL.revokeObjectURL(selectedFile.url);
    }
    setSelectedFile(null);
    setError(null);
    onCancel();
  };

  // Очистка выбранного файла
  const handleClearFile = () => {
    if (selectedFile?.url) {
      URL.revokeObjectURL(selectedFile.url);
    }
    setSelectedFile(null);
    setError(null);
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 ${className}`}>
      {!selectedFile ? (
        <>
          {/* Upload Zone */}
          <div
            className={`
              border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer
              ${isDragOver 
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
              }
            `}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              Загрузите файл
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Перетащите файл сюда или нажмите для выбора
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              Максимальный размер: {Math.round(maxFileSize / 1024 / 1024)} MB
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              Поддерживаемые форматы: {allowedTypes.slice(0, 5).join(', ')}
              {allowedTypes.length > 5 && ` и ещё ${allowedTypes.length - 5}`}
            </p>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept={allowedTypes.join(',')}
            onChange={handleInputChange}
          />

          {error && (
            <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}
        </>
      ) : (
        <>
          {/* File Preview */}
          <div className="space-y-4">
            <div className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              {selectedFile.type === 'image' && selectedFile.url ? (
                <img 
                  src={selectedFile.url} 
                  alt={selectedFile.file.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
              ) : (
                <div className="w-16 h-16 flex items-center justify-center bg-white dark:bg-gray-600 rounded-lg">
                  {getFileIcon(selectedFile.type)}
                </div>
              )}
              
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {selectedFile.file.name}
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {(selectedFile.file.size / 1024 / 1024).toFixed(2)} MB
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500 capitalize">
                  {selectedFile.type === 'other' ? 'файл' : selectedFile.type}
                </p>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearFile}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <Button
                onClick={handleConfirm}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              >
                Отправить файл
              </Button>
              <Button
                onClick={handleCancel}
                variant="outline"
                className="flex-1"
              >
                Отмена
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}; 