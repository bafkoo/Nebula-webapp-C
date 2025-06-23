namespace NebulaChat.Domain.Entities.Enums;

/// <summary>
/// Роли участников в чате
/// </summary>
public enum ParticipantRole
{
    /// <summary>
    /// Обычный участник чата
    /// </summary>
    Member = 1,
    
    /// <summary>
    /// Модератор чата (может управлять участниками)
    /// </summary>
    Moderator = 2,
    
    /// <summary>
    /// Администратор чата (может изменять настройки)
    /// </summary>
    Admin = 3,
    
    /// <summary>
    /// Владелец чата (полные права)
    /// </summary>
    Owner = 4
} 