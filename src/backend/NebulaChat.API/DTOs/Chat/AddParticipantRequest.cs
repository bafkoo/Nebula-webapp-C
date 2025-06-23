using System.ComponentModel.DataAnnotations;

namespace NebulaChat.API.DTOs.Chat
{
    public class AddParticipantRequest
    {
        [Required]
        public Guid UserId { get; set; }
    }
} 