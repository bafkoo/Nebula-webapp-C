using System.ComponentModel.DataAnnotations;
using NebulaChat.Domain.Entities.Enums;

namespace NebulaChat.API.DTOs.Chat;

/// <summary>
/// Запрос на отправку сообщения
/// </summary>
public class SendMessageRequest
{
    /// <summary>
    /// Содержимое сообщения
    /// </summary>
    [Required]
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
} 