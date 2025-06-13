using System.ComponentModel.DataAnnotations;

namespace NebulaChat.API.DTOs;

public class RegisterRequest
{
    [Required(ErrorMessage = "Имя пользователя обязательно")]
    [StringLength(50, MinimumLength = 3, ErrorMessage = "Имя пользователя должно быть от 3 до 50 символов")]
    public string Username { get; set; } = string.Empty;

    [Required(ErrorMessage = "Email обязателен")]
    [EmailAddress(ErrorMessage = "Неверный формат email")]
    [StringLength(255, ErrorMessage = "Email не может быть длиннее 255 символов")]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "Пароль обязателен")]
    [StringLength(100, MinimumLength = 6, ErrorMessage = "Пароль должен быть от 6 до 100 символов")]
    public string Password { get; set; } = string.Empty;
} 