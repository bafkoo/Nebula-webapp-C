using System;
using NebulaChat.Domain.Entities.Enums;

namespace NebulaChat.API.DTOs.Chat
{
    /// <summary>
    /// DTO для представления участника чата
    /// </summary>
    public class ParticipantDto
    {
        /// <summary>
        /// ID пользователя
        /// </summary>
        public Guid UserId { get; set; }

        /// <summary>
        /// Имя пользователя
        /// </summary>
        public string Username { get; set; } = null!;

        /// <summary>
        /// URL аватара пользователя
        /// </summary>
        public string? AvatarUrl { get; set; }

        /// <summary>
        /// Роль участника
        /// </summary>
        public ParticipantRole Role { get; set; }

        /// <summary>
        /// Дата присоединения к чату
        /// </summary>
        public DateTime JoinedAt { get; set; }

        /// <summary>
        /// Забанен ли пользователь в чате
        /// </summary>
        public bool IsBanned { get; set; }

        /// <summary>
        /// Дата окончания бана
        /// </summary>
        public DateTime? BannedUntil { get; set; }

        /// <summary>
        /// Причина бана
        /// </summary>
        public string? BanReason { get; set; }
    }
} 