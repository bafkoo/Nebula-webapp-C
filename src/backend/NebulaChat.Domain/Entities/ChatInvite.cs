using System;
using NebulaChat.Domain.Common;
using NebulaChat.Domain.Entities;

namespace NebulaChat.Domain.Entities
{
    /// <summary>
    /// Приглашение в групповой чат
    /// </summary>
    public class ChatInvite : BaseEntity
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
        /// ID пользователя, создавшего приглашение
        /// </summary>
        public Guid InviterId { get; set; }

        /// <summary>
        /// Пользователь, создавший приглашение
        /// </summary>
        public User Inviter { get; set; } = null!;

        /// <summary>
        /// ID пользователя, которому отправлено приглашение
        /// </summary>
        public Guid InviteeId { get; set; }

        /// <summary>
        /// Пользователь, которому отправлено приглашение
        /// </summary>
        public User Invitee { get; set; } = null!;

        /// <summary>
        /// Дата истечения приглашения
        /// </summary>
        public DateTime? ExpiresAt { get; set; }
    }
} 