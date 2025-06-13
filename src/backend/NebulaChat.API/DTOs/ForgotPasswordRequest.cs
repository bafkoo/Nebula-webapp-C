using System.ComponentModel.DataAnnotations;

namespace NebulaChat.API.DTOs;

public class ForgotPasswordRequest
{
    [Required(ErrorMessage = "Email обязателен")]
    [EmailAddress(ErrorMessage = "Неверный формат email")]
    public string Email { get; set; } = string.Empty;
} 