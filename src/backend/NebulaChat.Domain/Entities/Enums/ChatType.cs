namespace NebulaChat.Domain.Entities.Enums;

/// <summary>
/// Типы чатов в системе
/// </summary>
public enum ChatType
{
    /// <summary>
    /// Приватный чат между двумя пользователями
    /// </summary>
    Private = 1,
    
    /// <summary>
    /// Групповой чат с несколькими участниками
    /// </summary>
    Group = 2,
    
    /// <summary>
    /// Публичный канал для широкой аудитории
    /// </summary>
    Channel = 3
} 