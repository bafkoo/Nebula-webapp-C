using NebulaChat.Domain.Common;
using NebulaChat.Domain.Entities.Enums;

namespace NebulaChat.Domain.Entities;

/// <summary>
/// Участник чата (связь между пользователем и чатом)
/// </summary>
public class ChatParticipant : BaseEntity
{
    /// <summary>
    /// ID чата
    /// </summary>
    public Guid ChatId { get; set; }
    
    /// <summary>
    /// Чат
    /// </summary>
    public Chat Chat { get; set; } = null!;
    
    /// <summary>
    /// ID пользователя
    /// </summary>
    public Guid UserId { get; set; }
    
    /// <summary>
    /// Пользователь
    /// </summary>
    public User User { get; set; } = null!;
    
    /// <summary>
    /// Роль пользователя в чате
    /// </summary>
    public ParticipantRole Role { get; set; } = ParticipantRole.Member;
    
    /// <summary>
    /// Дата присоединения к чату
    /// </summary>
    public DateTime JoinedAt { get; set; } = DateTime.UtcNow;
    
    /// <summary>
    /// Дата последнего прочтения сообщений
    /// </summary>
    public DateTime? LastReadAt { get; set; }
    
    /// <summary>
    /// ID последнего прочитанного сообщения
    /// </summary>
    public Guid? LastReadMessageId { get; set; }
    
    /// <summary>
    /// Последнее прочитанное сообщение
    /// </summary>
    public Message? LastReadMessage { get; set; }
    
    /// <summary>
    /// Пользователь заблокирован в чате
    /// </summary>
    public bool IsBanned { get; set; } = false;
    
    /// <summary>
    /// Дата окончания блокировки
    /// </summary>
    public DateTime? BannedUntil { get; set; }
    
    /// <summary>
    /// Причина блокировки
    /// </summary>
    public string? BanReason { get; set; }
    
    /// <summary>
    /// Пользователь покинул чат
    /// </summary>
    public bool HasLeft { get; set; } = false;
    
    /// <summary>
    /// Дата покидания чата
    /// </summary>
    public DateTime? LeftAt { get; set; }
    
    /// <summary>
    /// Уведомления включены для этого чата
    /// </summary>
    public bool NotificationsEnabled { get; set; } = true;
} 