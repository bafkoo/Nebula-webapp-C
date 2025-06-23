using System.ComponentModel.DataAnnotations;
using NebulaChat.Domain.Entities.Enums;

namespace NebulaChat.API.DTOs.Chat;

/// <summary>
/// Запрос на создание чата
/// </summary>
public class CreateChatRequest
{
    /// <summary>
    /// Название чата (обязательно для групповых чатов и каналов)
    /// </summary>
    [MaxLength(100)]
    public string? Name { get; set; }
    
    /// <summary>
    /// Описание чата
    /// </summary>
    [MaxLength(500)]
    public string? Description { get; set; }
    
    /// <summary>
    /// Тип чата
    /// </summary>
    [Required]
    public ChatType Type { get; set; }
    
    /// <summary>
    /// Чат закрыт для новых участников
    /// </summary>
    public bool IsPrivate { get; set; } = false;
    
    /// <summary>
    /// Максимальное количество участников (для групповых чатов)
    /// </summary>
    public int? MaxParticipants { get; set; }
    
    /// <summary>
    /// Участники чата (для приватных чатов - один участник, для групповых - список)
    /// </summary>
    [Required]
    [MinLength(1)]
    public List<Guid> ParticipantIds { get; set; } = new();
} 