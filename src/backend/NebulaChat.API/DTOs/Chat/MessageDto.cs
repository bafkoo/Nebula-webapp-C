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
    public string Id { get; set; } = string.Empty;
    
    /// <summary>
    /// Временный ID сообщения
    /// </summary>
    public string? TempId { get; set; }
    
    /// <summary>
    /// ID чата
    /// </summary>
    public string ChatId { get; set; } = string.Empty;
    
    /// <summary>
    /// ID автора
    /// </summary>
    public string UserId { get; set; } = string.Empty;
    
    /// <summary>
    /// Имя автора
    /// </summary>
    public string UserName { get; set; } = string.Empty;
    
    /// <summary>
    /// Аватар автора
    /// </summary>
    public string? AvatarUrl { get; set; }
    
    /// <summary>
    /// Содержимое сообщения
    /// </summary>
    public string Content { get; set; } = string.Empty;
    
    /// <summary>
    /// Дата создания
    /// </summary>
    public DateTime CreatedAt { get; set; }
    
    /// <summary>
    /// Дата обновления
    /// </summary>
    public DateTime? UpdatedAt { get; set; }
} 