namespace NebulaChat.Domain.Entities.Enums;

/// <summary>
/// Типы сообщений в чате
/// </summary>
public enum MessageType
{
    /// <summary>
    /// Текстовое сообщение
    /// </summary>
    Text = 1,
    
    /// <summary>
    /// Изображение
    /// </summary>
    Image = 2,
    
    /// <summary>
    /// Файл (документ, архив и т.д.)
    /// </summary>
    File = 3,
    
    /// <summary>
    /// Системное сообщение (пользователь присоединился, покинул чат и т.д.)
    /// </summary>
    System = 4,
    
    /// <summary>
    /// Голосовое сообщение
    /// </summary>
    Voice = 5,
    
    /// <summary>
    /// Видео файл
    /// </summary>
    Video = 6
} 