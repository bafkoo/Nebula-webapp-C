using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NebulaChat.Infrastructure.Data;
using NebulaChat.Domain.Entities;
using NebulaChat.API.DTOs;
using NebulaChat.API.Services;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using System.Linq;
using Microsoft.Extensions.Configuration;
using System.Net.Http.Json;

namespace NebulaChat.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly NebulaChatDbContext _context;
    private readonly IPasswordService _passwordService;
    private readonly IJwtService _jwtService;
    private readonly IEmailService _emailService;
    private readonly IGoogleAuthService _googleAuthService;
    private readonly IGitHubAuthService _gitHubAuthService;
    private readonly IConfiguration _configuration;

    public AuthController(NebulaChatDbContext context, IPasswordService passwordService, IJwtService jwtService, IEmailService emailService, IGoogleAuthService googleAuthService, IGitHubAuthService gitHubAuthService, IConfiguration configuration)
    {
        _context = context;
        _passwordService = passwordService;
        _jwtService = jwtService;
        _emailService = emailService;
        _googleAuthService = googleAuthService;
        _gitHubAuthService = gitHubAuthService;
        _configuration = configuration;
    }

    [HttpPost("register")]
    public async Task<ActionResult<AuthResponse>> Register(RegisterRequest request)
    {
        // Проверяем, существует ли пользователь с таким email
        if (await _context.Users.AnyAsync(u => u.Email == request.Email))
        {
            return BadRequest(new AuthResponse
            {
                Success = false,
                Message = "Пользователь с таким email уже существует"
            });
        }

        // Проверяем, существует ли пользователь с таким username
        if (await _context.Users.AnyAsync(u => u.Username == request.Username))
        {
            return BadRequest(new AuthResponse
            {
                Success = false,
                Message = "Пользователь с таким именем уже существует"
            });
        }

        // Генерируем 6-значный код подтверждения
        var verificationCode = new Random().Next(100000, 999999).ToString();

        // Создаем нового пользователя
        var user = new User
        {
            Id = Guid.NewGuid(),
            Username = request.Username,
            Email = request.Email,
            PasswordHash = _passwordService.HashPassword(request.Password),
            IsEmailVerified = false,
            EmailVerificationToken = verificationCode,
            EmailVerificationTokenExpiry = DateTime.UtcNow.AddDays(1)
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        // Отправляем email с кодом подтверждения
        try
        {
            await _emailService.SendVerificationEmailAsync(user.Email, user.Username, verificationCode);
        }
        catch (Exception ex)
        {
            // Логируем ошибку, но не возвращаем ошибку пользователю
            // так как аккаунт уже создан
            Console.WriteLine($"Error sending email: {ex.Message}");
        }

        // Генерируем JWT токен
        var token = _jwtService.GenerateAccessToken(user);

        return Ok(new AuthResponse
        {
            Success = true,
            Message = "Регистрация прошла успешно",
            User = new UserDto
            {
                Id = user.Id,
                Username = user.Username,
                Email = user.Email,
                IsEmailVerified = user.IsEmailVerified,
                CreatedAt = user.CreatedAt
            },
            Token = token
        });
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponse>> Login(LoginRequest request)
    {
        // Находим пользователя по email
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
        if (user == null)
        {
            return BadRequest(new AuthResponse
            {
                Success = false,
                Message = "Неверный email или пароль"
            });
        }

        // Проверяем пароль
        if (!_passwordService.VerifyPassword(request.Password, user.PasswordHash))
        {
            return BadRequest(new AuthResponse
            {
                Success = false,
                Message = "Неверный email или пароль"
            });
        }

        // Обновляем время последнего входа
        user.LastLoginAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        // Генерируем JWT токен
        var token = _jwtService.GenerateAccessToken(user);

        return Ok(new AuthResponse
        {
            Success = true,
            Message = "Вход выполнен успешно",
            User = new UserDto
            {
                Id = user.Id,
                Username = user.Username,
                Email = user.Email,
                IsEmailVerified = user.IsEmailVerified,
                CreatedAt = user.CreatedAt
            },
            Token = token
        });
    }

    [HttpPost("forgot-password")]
    public async Task<IActionResult> ForgotPassword(ForgotPasswordRequest request)
    {
        // Находим пользователя по email
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
        if (user == null)
        {
            // Не раскрываем информацию о том, существует ли пользователь
            return Ok(new { Success = true, Message = "Если пользователь с таким email существует, письмо для сброса пароля было отправлено" });
        }

        // Генерируем токен сброса пароля
        var resetToken = Guid.NewGuid().ToString();
        user.PasswordResetToken = resetToken;
        user.PasswordResetTokenExpiry = DateTime.UtcNow.AddHours(1); // Токен действует 1 час

        await _context.SaveChangesAsync();

        // Отправляем email с ссылкой для сброса пароля
        try
        {
            await _emailService.SendPasswordResetEmailAsync(user.Email, user.Username, resetToken);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error sending password reset email: {ex.Message}");
        }

        return Ok(new { Success = true, Message = "Если пользователь с таким email существует, письмо для сброса пароля было отправлено" });
    }

    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPassword(ResetPasswordRequest request)
    {
        // Находим пользователя по токену сброса пароля
        var user = await _context.Users.FirstOrDefaultAsync(u => 
            u.PasswordResetToken == request.Token && 
            u.PasswordResetTokenExpiry > DateTime.UtcNow);

        if (user == null)
        {
            return BadRequest(new { Success = false, Message = "Неверный или истекший токен сброса пароля" });
        }

        // Обновляем пароль
        user.PasswordHash = _passwordService.HashPassword(request.NewPassword);
        user.PasswordResetToken = null;
        user.PasswordResetTokenExpiry = null;

        await _context.SaveChangesAsync();

        return Ok(new { Success = true, Message = "Пароль успешно изменен" });
    }

    [HttpPost("verify-email")]
    [Authorize]
    public async Task<ActionResult<AuthResponse>> VerifyEmail(VerifyEmailRequest request)
    {
        // Получаем ID пользователя из JWT токена
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out var userId))
        {
            return BadRequest(new AuthResponse
            {
                Success = false,
                Message = "Неверный токен аутентификации"
            });
        }

        // Находим пользователя в базе данных
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
        if (user == null)
        {
            return BadRequest(new AuthResponse
            {
                Success = false,
                Message = "Пользователь не найден"
            });
        }

        // Проверяем, не верифицирован ли уже email
        if (user.IsEmailVerified)
        {
            return BadRequest(new AuthResponse
            {
                Success = false,
                Message = "Email уже подтвержден"
            });
        }

        // Проверяем код подтверждения и его срок действия
        if (user.EmailVerificationToken != request.Code)
        {
            return BadRequest(new AuthResponse
            {
                Success = false,
                Message = "Неверный код подтверждения"
            });
        }

        if (user.EmailVerificationTokenExpiry < DateTime.UtcNow)
        {
            return BadRequest(new AuthResponse
            {
                Success = false,
                Message = "Код подтверждения истек. Запросите новый код"
            });
        }

        // Подтверждаем email
        user.IsEmailVerified = true;
        user.EmailVerificationToken = null;
        user.EmailVerificationTokenExpiry = null;
        user.EmailVerifiedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        // Генерируем новый JWT токен с обновленным статусом верификации
        var token = _jwtService.GenerateAccessToken(user);

        return Ok(new AuthResponse
        {
            Success = true,
            Message = "Email успешно подтвержден",
            User = new UserDto
            {
                Id = user.Id,
                Username = user.Username,
                Email = user.Email,
                IsEmailVerified = user.IsEmailVerified,
                CreatedAt = user.CreatedAt
            },
            Token = token
        });
    }

    [HttpPost("resend-verification")]
    [Authorize]
    public async Task<IActionResult> ResendVerificationCode()
    {
        // Получаем ID пользователя из JWT токена
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out var userId))
        {
            return BadRequest(new { Success = false, Message = "Неверный токен аутентификации" });
        }

        // Находим пользователя в базе данных
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
        if (user == null)
        {
            return BadRequest(new { Success = false, Message = "Пользователь не найден" });
        }

        // Проверяем, не верифицирован ли уже email
        if (user.IsEmailVerified)
        {
            return BadRequest(new { Success = false, Message = "Email уже подтвержден" });
        }

        // Генерируем новый 6-значный код подтверждения
        var verificationCode = new Random().Next(100000, 999999).ToString();
        user.EmailVerificationToken = verificationCode;
        user.EmailVerificationTokenExpiry = DateTime.UtcNow.AddDays(1);

        await _context.SaveChangesAsync();

        // Отправляем email с новым кодом подтверждения
        try
        {
            await _emailService.SendVerificationEmailAsync(user.Email, user.Username, verificationCode);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error sending verification email: {ex.Message}");
            return StatusCode(500, new { Success = false, Message = "Ошибка при отправке email" });
        }

        return Ok(new { Success = true, Message = "Новый код подтверждения отправлен на ваш email" });
    }

    [HttpPost("google")]
    public async Task<ActionResult<AuthResponse>> GoogleAuth(GoogleAuthRequest request)
    {
        try
        {
            var googleUserInfo = await _googleAuthService.VerifyGoogleTokenAsync(request.IdToken);
            if (googleUserInfo == null)
            {
                return BadRequest(new AuthResponse
                {
                    Success = false,
                    Message = "Неверный Google токен"
                });
            }

            var existingUser = await _context.Users.FirstOrDefaultAsync(u => 
                u.GoogleId == googleUserInfo.GoogleId || u.Email == googleUserInfo.Email);

            User user;

            if (existingUser != null)
            {
                user = existingUser;
                if (string.IsNullOrEmpty(user.GoogleId))
                {
                    user.GoogleId = googleUserInfo.GoogleId;
                }
                if (!string.IsNullOrEmpty(googleUserInfo.Picture))
                {
                    user.AvatarUrl = googleUserInfo.Picture;
                }
                if (googleUserInfo.EmailVerified && !user.IsEmailVerified)
                {
                    user.IsEmailVerified = true;
                    user.EmailVerifiedAt = DateTime.UtcNow;
                    user.EmailVerificationToken = null;
                    user.EmailVerificationTokenExpiry = null;
                }
                user.LastLoginAt = DateTime.UtcNow;
            }
            else
            {
                user = new User
                {
                    Id = Guid.NewGuid(),
                    Username = GenerateUsernameFromEmail(googleUserInfo.Email),
                    Email = googleUserInfo.Email,
                    PasswordHash = string.Empty,
                    GoogleId = googleUserInfo.GoogleId,
                    AvatarUrl = googleUserInfo.Picture,
                    IsEmailVerified = googleUserInfo.EmailVerified,
                    EmailVerifiedAt = googleUserInfo.EmailVerified ? DateTime.UtcNow : null
                };
                _context.Users.Add(user);
            }

            await _context.SaveChangesAsync();

            var token = _jwtService.GenerateAccessToken(user);

            return Ok(new AuthResponse
            {
                Success = true,
                Message = existingUser != null ? "Вход выполнен успешно" : "Регистрация прошла успешно",
                User = new UserDto
                {
                    Id = user.Id,
                    Username = user.Username,
                    Email = user.Email,
                    IsEmailVerified = user.IsEmailVerified,
                    CreatedAt = user.CreatedAt
                },
                Token = token
            });
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error in Google auth: {ex.Message}");
            return StatusCode(500, new AuthResponse
            {
                Success = false,
                Message = "Ошибка при аутентификации через Google"
            });
        }
    }

    private string GenerateUsernameFromEmail(string email)
    {
        var username = email.Split('@')[0];
        username = new string(username.Where(c => char.IsLetterOrDigit(c) || c == '_').ToArray());
        if (username.Length > 20)
        {
            username = username.Substring(0, 20);
        }
        return username;
    }

    [HttpPost("github/exchange")]
    public async Task<IActionResult> ExchangeGitHubCode([FromBody] GitHubCodeExchangeRequest request)
    {
        try
        {
            var clientId = _configuration["GitHub:ClientId"];
            var clientSecret = _configuration["GitHub:ClientSecret"];

            Console.WriteLine($"GitHub Client ID: {clientId}");
            Console.WriteLine($"GitHub Client Secret: {(string.IsNullOrEmpty(clientSecret) ? "NOT SET" : "SET")}");
            Console.WriteLine($"Received code: {request.Code}");

            if (string.IsNullOrEmpty(clientSecret) || clientSecret == "your-github-client-secret")
            {
                return BadRequest(new { error = "GitHub Client Secret not configured" });
            }

            var tokenRequest = new
            {
                client_id = clientId,
                client_secret = clientSecret,
                code = request.Code
            };

            using var httpClient = new HttpClient();
            httpClient.DefaultRequestHeaders.Add("Accept", "application/json");
            httpClient.DefaultRequestHeaders.Add("User-Agent", "NebulaChat");

            var response = await httpClient.PostAsJsonAsync("https://github.com/login/oauth/access_token", tokenRequest);
            var responseContent = await response.Content.ReadAsStringAsync();
            
            Console.WriteLine($"GitHub response status: {response.StatusCode}");
            Console.WriteLine($"GitHub response content: {responseContent}");
            
            var tokenResponse = await response.Content.ReadFromJsonAsync<GitHubTokenResponse>();

            if (tokenResponse?.AccessToken == null)
            {
                return BadRequest(new { error = "Failed to exchange code for token", details = responseContent });
            }

            return Ok(new { access_token = tokenResponse.AccessToken });
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Exception in GitHub exchange: {ex.Message}");
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpPost("github")]
    public async Task<ActionResult<AuthResponse>> GitHubAuth(GitHubAuthRequest request)
    {
        try
        {
            var gitHubUserInfo = await _gitHubAuthService.VerifyGitHubTokenAsync(request.AccessToken);
            if (gitHubUserInfo == null)
            {
                return BadRequest(new AuthResponse
                {
                    Success = false,
                    Message = "Неверный GitHub токен"
                });
            }

            var existingUser = await _context.Users.FirstOrDefaultAsync(u => 
                u.GitHubId == gitHubUserInfo.GitHubId || u.Email == gitHubUserInfo.Email);

            User user;

            if (existingUser != null)
            {
                user = existingUser;
                if (string.IsNullOrEmpty(user.GitHubId))
                {
                    user.GitHubId = gitHubUserInfo.GitHubId;
                }
                if (!string.IsNullOrEmpty(gitHubUserInfo.AvatarUrl))
                {
                    user.AvatarUrl = gitHubUserInfo.AvatarUrl;
                }
                if (gitHubUserInfo.EmailVerified && !user.IsEmailVerified)
                {
                    user.IsEmailVerified = true;
                    user.EmailVerifiedAt = DateTime.UtcNow;
                    user.EmailVerificationToken = null;
                    user.EmailVerificationTokenExpiry = null;
                }
                user.LastLoginAt = DateTime.UtcNow;
            }
            else
            {
                user = new User
                {
                    Id = Guid.NewGuid(),
                    Username = !string.IsNullOrEmpty(gitHubUserInfo.Username) ? gitHubUserInfo.Username : GenerateUsernameFromEmail(gitHubUserInfo.Email),
                    Email = gitHubUserInfo.Email,
                    PasswordHash = string.Empty,
                    GitHubId = gitHubUserInfo.GitHubId,
                    AvatarUrl = gitHubUserInfo.AvatarUrl,
                    IsEmailVerified = gitHubUserInfo.EmailVerified,
                    EmailVerifiedAt = gitHubUserInfo.EmailVerified ? DateTime.UtcNow : null
                };
                _context.Users.Add(user);
            }

            await _context.SaveChangesAsync();

            var token = _jwtService.GenerateAccessToken(user);

            return Ok(new AuthResponse
            {
                Success = true,
                Message = "GitHub аутентификация прошла успешно",
                User = new UserDto
                {
                    Id = user.Id,
                    Username = user.Username,
                    Email = user.Email,
                    IsEmailVerified = user.IsEmailVerified,
                    CreatedAt = user.CreatedAt
                },
                Token = token
            });
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error in GitHub auth: {ex.Message}");
            return StatusCode(500, new AuthResponse
            {
                Success = false,
                Message = "Ошибка при аутентификации через GitHub"
            });
        }
    }

    [HttpGet("test-db")]
    public async Task<IActionResult> TestDatabase()
    {
        try
        {
            var userCount = await _context.Users.CountAsync();
            return Ok(new { 
                Success = true, 
                Message = "Подключение к базе данных работает", 
                UserCount = userCount,
                DatabaseName = _context.Database.GetDbConnection().Database
            });
        }
        catch (Exception ex)
        {
            return BadRequest(new { 
                Success = false, 
                Message = "Ошибка подключения к базе данных", 
                Error = ex.Message 
            });
        }
    }
} 