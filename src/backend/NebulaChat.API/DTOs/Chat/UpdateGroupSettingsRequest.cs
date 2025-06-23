using System;
using System.ComponentModel.DataAnnotations;

namespace NebulaChat.API.DTOs.Chat
{
    /// <summary>
    /// DTO для обновления настроек группового чата
    /// </summary>
    public class UpdateGroupSettingsRequest
    {
        /// <summary>
        /// Новое название чата
        /// </summary>
        [MaxLength(100)]
        public string? Name { get; set; }

        /// <summary>
        /// Новое описание чата
        /// </summary>
        [MaxLength(500)]
        public string? Description { get; set; }

        /// <summary>
        /// URL аватара чата
        /// </summary>
        public string? AvatarUrl { get; set; }

        /// <summary>
        /// Статус приватности чата
        /// </summary>
        public bool? IsPrivate { get; set; }

        /// <summary>
        /// Максимальное количество участников
        /// </summary>
        public int? MaxParticipants { get; set; }
    }
} 