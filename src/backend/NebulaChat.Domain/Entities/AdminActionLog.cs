using System;
using NebulaChat.Domain.Common;

namespace NebulaChat.Domain.Entities
{
    /// <summary>
    /// Лог административных действий в групповом чате
    /// </summary>
    public class AdminActionLog : BaseEntity
    {
        /// <summary>
        /// ID чата
        /// </summary>
        public Guid ChatId { get; set; }

        /// <summary>
        /// Групповой чат
        /// </summary>
        public Chat Chat { get; set; } = null!;

        /// <summary>
        /// ID администратора, выполнившего действие
        /// </summary>
        public Guid AdminId { get; set; }

        /// <summary>
        /// Пользователь-администратор
        /// </summary>
        public User Admin { get; set; } = null!;

        /// <summary>
        /// Тип действия (Kick, Ban, RoleUpdate, SettingsUpdate, Moderate)
        /// </summary>
        public string ActionType { get; set; } = null!;

        /// <summary>
        /// Тип цели действия (User, Message, Chat)
        /// </summary>
        public string TargetType { get; set; } = null!;

        /// <summary>
        /// ID цели действия
        /// </summary>
        public Guid TargetId { get; set; }

        /// <summary>
        /// Причина действия (если есть)
        /// </summary>
        public string? Reason { get; set; }

        /// <summary>
        /// Время выполнения действия
        /// </summary>
        public DateTime Timestamp { get; set; }
    }
} 