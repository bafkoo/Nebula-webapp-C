using System.ComponentModel.DataAnnotations;

namespace NebulaChat.API.DTOs.Chat;

/// <summary>
/// Запрос на бан пользователя в чате.
/// </summary>
public class BanUserRequest
{
    /// <summary>
    /// Причина бана.
    /// </summary>
    [MaxLength(500)]
    public string? Reason { get; set; }
} 