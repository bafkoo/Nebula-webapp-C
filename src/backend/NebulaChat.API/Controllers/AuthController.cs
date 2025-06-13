using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using NebulaChat.Infrastructure.Data;
using NebulaChat.Domain.Entities;
using NebulaChat.API.DTOs;
using NebulaChat.API.Services;

namespace NebulaChat.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly NebulaChatDbContext _context;
    private readonly IPasswordService _passwordService;
    private readonly IJwtService _jwtService;
    private readonly IEmailService _emailService;

    public AuthController(NebulaChatDbContext context, IPasswordService passwordService, IJwtService jwtService, IEmailService emailService)
    {
        _context = context;
        _passwordService = passwordService;
        _jwtService = jwtService;
        _emailService = emailService;
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
} 