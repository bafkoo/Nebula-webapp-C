using System.ComponentModel.DataAnnotations;
using NebulaChat.Domain.Entities.Enums;

namespace NebulaChat.API.DTOs.Chat;

/// <summary>
/// Запрос на отправку сообщения
/// </summary>
public class SendMessageRequest
{
    /// <summary>
    /// ID чата
    /// </summary>
    [Required]
    public Guid ChatId { get; set; }
    
    /// <summary>
    /// Содержимое сообщения
    /// </summary>
    [MaxLength(4000)]
    public string Content { get; set; } = string.Empty;
    
    /// <summary>
    /// Тип сообщения
    /// </summary>
    public MessageType Type { get; set; } = MessageType.Text;
    
    /// <summary>
    /// ID сообщения на которое отвечаем
    /// </summary>
    public Guid? ReplyToMessageId { get; set; }
    
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
} 