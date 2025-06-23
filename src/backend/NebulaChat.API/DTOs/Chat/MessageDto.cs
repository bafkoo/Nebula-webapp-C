using NebulaChat.Domain.Entities.Enums;

namespace NebulaChat.API.DTOs.Chat;

/// <summary>
/// DTO для сообщения
/// </summary>
public class MessageDto
{
    /// <summary>
    /// ID сообщения
    /// </summary>
    public Guid Id { get; set; }
    
    /// <summary>
    /// ID чата
    /// </summary>
    public Guid ChatId { get; set; }
    
    /// <summary>
    /// ID автора
    /// </summary>
    public Guid AuthorId { get; set; }
    
    /// <summary>
    /// Имя автора
    /// </summary>
    public string AuthorUsername { get; set; } = string.Empty;
    
    /// <summary>
    /// Аватар автора
    /// </summary>
    public string? AuthorAvatarUrl { get; set; }
    
    /// <summary>
    /// Содержимое сообщения
    /// </summary>
    public string Content { get; set; } = string.Empty;
    
    /// <summary>
    /// Тип сообщения
    /// </summary>
    public MessageType Type { get; set; }
    
    /// <summary>
    /// URL файла (для сообщений с медиа)
    /// </summary>
    public string? FileUrl { get; set; }
    
    /// <summary>
    /// Название файла
    /// </summary>
    public string? FileName { get; set; }
    
    /// <summary>
    /// Размер файла в байтах
    /// </summary>
    public long? FileSize { get; set; }
    
    /// <summary>
    /// MIME тип файла
    /// </summary>
    public string? MimeType { get; set; }
    
    /// <summary>
    /// Сообщение отредактировано
    /// </summary>
    public bool IsEdited { get; set; }
    
    /// <summary>
    /// Дата редактирования
    /// </summary>
    public DateTime? EditedAt { get; set; }
    
    /// <summary>
    /// Сообщение на которое отвечает данное сообщение
    /// </summary>
    public MessageDto? ReplyToMessage { get; set; }
    
    /// <summary>
    /// Дата создания
    /// </summary>
    public DateTime CreatedAt { get; set; }
} 