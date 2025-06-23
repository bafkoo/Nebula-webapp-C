using System;
using System.ComponentModel.DataAnnotations;

namespace NebulaChat.API.DTOs.Chat
{
    public class CreateChatInviteRequest
    {
        [Required]
        public Guid InviteeId { get; set; }

        public DateTime? ExpiresAt { get; set; }
    }
} 