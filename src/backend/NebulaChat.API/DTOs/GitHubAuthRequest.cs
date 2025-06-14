using System.ComponentModel.DataAnnotations;

namespace NebulaChat.API.DTOs;

public class GitHubAuthRequest
{
    [Required]
    public string AccessToken { get; set; } = string.Empty;
} 