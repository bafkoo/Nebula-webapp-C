using System.ComponentModel.DataAnnotations;

namespace NebulaChat.API.DTOs;

public class ResetPasswordRequest
{
    [Required(ErrorMessage = "Токен обязателен")]
    public string Token { get; set; } = string.Empty;

    [Required(ErrorMessage = "Пароль обязателен")]
    [MinLength(8, ErrorMessage = "Пароль должен содержать минимум 8 символов")]
    public string NewPassword { get; set; } = string.Empty;
} 