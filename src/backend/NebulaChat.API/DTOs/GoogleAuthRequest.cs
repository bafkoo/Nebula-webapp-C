using System.ComponentModel.DataAnnotations;

namespace NebulaChat.API.DTOs;

public class GoogleAuthRequest
{
    [Required]
    public string IdToken { get; set; } = string.Empty;
} 