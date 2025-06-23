using System;
using System.ComponentModel.DataAnnotations;

namespace NebulaChat.API.DTOs.Chat
{
    /// <summary>
    /// DTO для модерации сообщений в групповом чате
    /// </summary>
    public class ModerateMessageRequest
    {
        /// <summary>
        /// ID сообщения, которое нужно модерировать
        /// </summary>
        [Required]
        public Guid MessageId { get; set; }

        /// <summary>
        /// Действие модерации: "delete" или "edit"
        /// </summary>
        [Required]
        public string Action { get; set; } = null!;

        /// <summary>
        /// Причина модерации (опционально)
        /// </summary>
        [MaxLength(500)]
        public string? Reason { get; set; }
    }
} 