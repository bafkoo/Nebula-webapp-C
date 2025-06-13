namespace NebulaChat.API.Services;

public interface IEmailService
{
    Task<bool> SendVerificationEmailAsync(string toEmail, string username, string verificationCode);
    Task<bool> SendPasswordResetEmailAsync(string toEmail, string username, string resetToken);
} 