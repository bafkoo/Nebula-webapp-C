using NebulaChat.Domain.Common;
using NebulaChat.Domain.Entities.Enums;

namespace NebulaChat.Domain.Entities;

/// <summary>
/// Чат (приватный, групповой или канал)
/// </summary>
public class Chat : BaseEntity
{
    /// <summary>
    /// Название чата (для групповых чатов и каналов)
    /// </summary>
    public string? Name { get; set; }
    
    /// <summary>
    /// Описание чата
    /// </summary>
    public string? Description { get; set; }
    
    /// <summary>
    /// Тип чата (Private, Group, Channel)
    /// </summary>
    public ChatType Type { get; set; }
    
    /// <summary>
    /// URL аватара чата
    /// </summary>
    public string? AvatarUrl { get; set; }
    
    /// <summary>
    /// ID пользователя создавшего чат
    /// </summary>
    public Guid CreatedBy { get; set; }
    
    /// <summary>
    /// Пользователь создавший чат
    /// </summary>
    public User Creator { get; set; } = null!;
    
    /// <summary>
    /// Максимальное количество участников (для групповых чатов)
    /// </summary>
    public int? MaxParticipants { get; set; }
    
    /// <summary>
    /// Чат закрыт для новых участников
    /// </summary>
    public bool IsPrivate { get; set; } = false;
    
    /// <summary>
    /// Чат архивирован
    /// </summary>
    public bool IsArchived { get; set; } = false;
    
    /// <summary>
    /// Дата последнего сообщения
    /// </summary>
    public DateTime? LastMessageAt { get; set; }
    
    /// <summary>
    /// Участники чата
    /// </summary>
    public ICollection<ChatParticipant> Participants { get; set; } = new List<ChatParticipant>();
    
    /// <summary>
    /// Сообщения в чате
    /// </summary>
    public ICollection<Message> Messages { get; set; } = new List<Message>();

    /// <summary>
    /// Забаненные в чате пользователи
    /// </summary>
    public ICollection<BannedUser> BannedUsers { get; set; } = new List<BannedUser>();
} 