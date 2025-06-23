using NebulaChat.Domain.Common;
using NebulaChat.Domain.Entities.Enums;

namespace NebulaChat.Domain.Entities;

/// <summary>
/// Сообщение в чате
/// </summary>
public class Message : BaseEntity
{
    /// <summary>
    /// ID чата в котором отправлено сообщение
    /// </summary>
    public Guid ChatId { get; set; }
    
    /// <summary>
    /// Чат в котором отправлено сообщение
    /// </summary>
    public Chat Chat { get; set; } = null!;
    
    /// <summary>
    /// ID автора сообщения
    /// </summary>
    public Guid AuthorId { get; set; }
    
    /// <summary>
    /// Автор сообщения
    /// </summary>
    public User Author { get; set; } = null!;
    
    /// <summary>
    /// Содержимое сообщения
    /// </summary>
    public string Content { get; set; } = string.Empty;
    
    /// <summary>
    /// Тип сообщения (Text, Image, File, System, etc.)
    /// </summary>
    public MessageType Type { get; set; } = MessageType.Text;
    
    /// <summary>
    /// URL файла (для сообщений типа Image, File, Voice, Video)
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
    public bool IsEdited { get; set; } = false;
    
    /// <summary>
    /// Дата редактирования
    /// </summary>
    public DateTime? EditedAt { get; set; }
    
    /// <summary>
    /// Сообщение удалено
    /// </summary>
    public bool IsDeleted { get; set; } = false;
    
    /// <summary>
    /// Дата удаления
    /// </summary>
    public DateTime? DeletedAt { get; set; }
    
    /// <summary>
    /// ID сообщения на которое отвечает данное сообщение
    /// </summary>
    public Guid? ReplyToMessageId { get; set; }
    
    /// <summary>
    /// Сообщение на которое отвечает данное сообщение
    /// </summary>
    public Message? ReplyToMessage { get; set; }
    
    /// <summary>
    /// Ответы на данное сообщение
    /// </summary>
    public ICollection<Message> Replies { get; set; } = new List<Message>();
} 