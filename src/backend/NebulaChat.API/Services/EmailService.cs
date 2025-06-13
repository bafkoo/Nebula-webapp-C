using Resend;

namespace NebulaChat.API.Services;

public class EmailService : IEmailService
{
    private readonly IResend _resend;
    private readonly IConfiguration _configuration;
    private readonly ILogger<EmailService> _logger;

    public EmailService(IResend resend, IConfiguration configuration, ILogger<EmailService> logger)
    {
        _resend = resend;
        _configuration = configuration;
        _logger = logger;
    }

    public async Task<bool> SendVerificationEmailAsync(string toEmail, string username, string verificationCode)
    {
        try
        {
            var fromEmail = _configuration["Resend:FromEmail"] ?? "onboarding@resend.dev";
            var fromName = _configuration["Resend:FromName"] ?? "Nebula";

            var htmlContent = $@"
                <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;'>
                    <div style='text-align: center; margin-bottom: 30px;'>
                        <h1 style='color: #5865F2; margin-bottom: 10px;'>Nebula</h1>
                        <p style='color: #747f8d; font-size: 16px;'>Добро пожаловать в сообщество!</p>
                    </div>
                    
                    <div style='background: #f8f9fa; padding: 25px; border-radius: 8px; margin-bottom: 25px;'>
                        <h2 style='color: #23272a; margin-bottom: 15px;'>Привет, {username}!</h2>
                        <p style='color: #4f545c; font-size: 16px; line-height: 1.5; margin-bottom: 20px;'>
                            Спасибо за регистрацию в Nebula! Чтобы завершить создание аккаунта, 
                            подтвердите ваш email адрес, введя код ниже:
                        </p>
                        
                        <div style='text-align: center; margin: 25px 0;'>
                            <div style='background: #5865F2; color: white; font-size: 32px; font-weight: bold; 
                                       padding: 15px 25px; border-radius: 8px; letter-spacing: 3px; display: inline-block;'>
                                {verificationCode}
                            </div>
                        </div>
                        
                        <p style='color: #747f8d; font-size: 14px; text-align: center;'>
                            Код действителен в течение 24 часов
                        </p>
                    </div>
                    
                    <div style='text-align: center; color: #747f8d; font-size: 12px;'>
                        <p>Если вы не регистрировались в Nebula, просто проигнорируйте это письмо.</p>
                        <p>© 2025 Nebula. Все права защищены.</p>
                    </div>
                </div>";

            var plainTextContent = $@"
                Nebula - Подтверждение email
                
                Привет, {username}!
                
                Спасибо за регистрацию в Nebula! 
                Чтобы завершить создание аккаунта, подтвердите ваш email адрес с помощью кода:
                
                {verificationCode}
                
                Код действителен в течение 24 часов.
                
                Если вы не регистрировались в Nebula, просто проигнорируйте это письмо.
                
                © 2025 Nebula";

            var message = new EmailMessage();
            message.From = $"{fromName} <{fromEmail}>";
            message.To.Add(toEmail);
            message.Subject = "Подтвердите ваш email в Nebula";
            message.HtmlBody = htmlContent;
            message.TextBody = plainTextContent;

            var response = await _resend.EmailSendAsync(message);
            
            _logger.LogInformation("Verification email sent successfully to {Email}. MessageId: {MessageId}", 
                toEmail, response);
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error sending verification email to {Email}", toEmail);
            return false;
        }
    }

    public async Task<bool> SendPasswordResetEmailAsync(string toEmail, string username, string resetToken)
    {
        try
        {
            var fromEmail = _configuration["Resend:FromEmail"] ?? "onboarding@resend.dev";
            var fromName = _configuration["Resend:FromName"] ?? "Nebula";
            
            var resetUrl = $"{_configuration["Frontend:BaseUrl"]}/new-password?token={resetToken}";

            var htmlContent = $@"
                <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;'>
                    <div style='text-align: center; margin-bottom: 30px;'>
                        <h1 style='color: #5865F2; margin-bottom: 10px;'>Nebula</h1>
                        <p style='color: #747f8d; font-size: 16px;'>Сброс пароля</p>
                    </div>
                    
                    <div style='background: #f8f9fa; padding: 25px; border-radius: 8px; margin-bottom: 25px;'>
                        <h2 style='color: #23272a; margin-bottom: 15px;'>Привет, {username}!</h2>
                        <p style='color: #4f545c; font-size: 16px; line-height: 1.5; margin-bottom: 20px;'>
                            Мы получили запрос на сброс пароля для вашего аккаунта Nebula.
                        </p>
                        
                        <div style='text-align: center; margin: 25px 0;'>
                            <a href='{resetUrl}' style='background: #5865F2; color: white; text-decoration: none; 
                               padding: 12px 30px; border-radius: 8px; font-weight: bold; display: inline-block;'>
                                Сбросить пароль
                            </a>
                        </div>
                        
                        <p style='color: #747f8d; font-size: 14px; text-align: center;'>
                            Ссылка действительна в течение 24 часов
                        </p>
                    </div>
                    
                    <div style='text-align: center; color: #747f8d; font-size: 12px;'>
                        <p>Если вы не запрашивали сброс пароля, просто проигнорируйте это письмо.</p>
                        <p>© 2025 NebulaChat. Все права защищены.</p>
                    </div>
                </div>";

            var plainTextContent = $@"
                Nebula - Сброс пароля
                
                Привет, {username}!
                
                Мы получили запрос на сброс пароля для вашего аккаунта Nebula.
                
                Перейдите по ссылке для сброса пароля:
                {resetUrl}
                
                Ссылка действительна в течение 24 часов.
                
                Если вы не запрашивали сброс пароля, просто проигнорируйте это письмо.
                
                © 2025 Nebula";

            var message = new EmailMessage();
            message.From = $"{fromName} <{fromEmail}>";
            message.To.Add(toEmail);
            message.Subject = "Сброс пароля Nebula";
            message.HtmlBody = htmlContent;
            message.TextBody = plainTextContent;

            var response = await _resend.EmailSendAsync(message);
            
            _logger.LogInformation("Password reset email sent successfully to {Email}. MessageId: {MessageId}", 
                toEmail, response);
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error sending password reset email to {Email}", toEmail);
            return false;
        }
    }
} 