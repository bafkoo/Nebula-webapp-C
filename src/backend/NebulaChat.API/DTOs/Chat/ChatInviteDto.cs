using System;

namespace NebulaChat.API.DTOs.Chat
{
    public class ChatInviteDto
    {
        public Guid Id { get; set; }
        public Guid ChatId { get; set; }
        public Guid InviterId { get; set; }
        public Guid InviteeId { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? ExpiresAt { get; set; }
    }
} 