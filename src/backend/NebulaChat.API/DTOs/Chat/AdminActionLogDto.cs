using System;

namespace NebulaChat.API.DTOs.Chat
{
    /// <summary>
    /// DTO для лога административного действия
    /// </summary>
    public class AdminActionLogDto
    {
        /// <summary>
        /// ID записи лога
        /// </summary>
        public Guid Id { get; set; }

        /// <summary>
        /// ID администратора, выполнившего действие
        /// </summary>
        public Guid AdminId { get; set; }

        /// <summary>
        /// Имя администратора
        /// </summary>
        public string AdminUsername { get; set; } = null!;

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