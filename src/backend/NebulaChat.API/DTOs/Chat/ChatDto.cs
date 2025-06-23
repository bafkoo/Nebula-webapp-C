using NebulaChat.Domain.Entities.Enums;

namespace NebulaChat.API.DTOs.Chat;

/// <summary>
/// DTO для чата
/// </summary>
public class ChatDto
{
    /// <summary>
    /// ID чата
    /// </summary>
    public Guid Id { get; set; }
    
    /// <summary>
    /// Название чата (для групповых чатов и каналов)
    /// </summary>
    public string? Name { get; set; }
    
    /// <summary>
    /// Описание чата
    /// </summary>
    public string? Description { get; set; }
    
    /// <summary>
    /// Тип чата
    /// </summary>
    public ChatType Type { get; set; }
    
    /// <summary>
    /// URL аватара чата
    /// </summary>
    public string? AvatarUrl { get; set; }
    
    /// <summary>
    /// Максимальное количество участников для групповых чатов
    /// </summary>
    public int? MaxParticipants { get; set; }
    
    /// <summary>
    /// ID создателя чата
    /// </summary>
    public Guid CreatedBy { get; set; }
    
    /// <summary>
    /// Имя создателя чата
    /// </summary>
    public string? CreatorUsername { get; set; }
    
    /// <summary>
    /// Чат закрыт для новых участников
    /// </summary>
    public bool IsPrivate { get; set; }
    
    /// <summary>
    /// Чат архивирован
    /// </summary>
    public bool IsArchived { get; set; }
    
    /// <summary>
    /// Количество участников
    /// </summary>
    public int ParticipantCount { get; set; }
    
    /// <summary>
    /// Количество непрочитанных сообщений
    /// </summary>
    public int UnreadCount { get; set; }
    
    /// <summary>
    /// Последнее сообщение
    /// </summary>
    public MessageDto? LastMessage { get; set; }
    
    /// <summary>
    /// Дата последнего сообщения
    /// </summary>
    public DateTime? LastMessageAt { get; set; }
    
    /// <summary>
    /// Дата создания
    /// </summary>
    public DateTime CreatedAt { get; set; }
} 