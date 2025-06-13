using System.ComponentModel.DataAnnotations;

namespace NebulaChat.API.DTOs;

public class VerifyEmailRequest
{
    [Required(ErrorMessage = "Код подтверждения обязателен")]
    [StringLength(6, MinimumLength = 6, ErrorMessage = "Код подтверждения должен содержать 6 цифр")]
    [RegularExpression(@"^\d{6}$", ErrorMessage = "Код подтверждения должен содержать только цифры")]
    public string Code { get; set; } = string.Empty;
} 