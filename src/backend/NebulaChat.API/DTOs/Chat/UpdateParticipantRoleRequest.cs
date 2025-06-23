using NebulaChat.Domain.Entities.Enums;
using System.ComponentModel.DataAnnotations;

namespace NebulaChat.API.DTOs.Chat
{
    public class UpdateParticipantRoleRequest
    {
        [Required]
        public ParticipantRole Role { get; set; }
    }
} 