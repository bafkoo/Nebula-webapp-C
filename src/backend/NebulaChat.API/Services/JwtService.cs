using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using NebulaChat.Domain.Entities;

namespace NebulaChat.API.Services;

public class JwtService : IJwtService
{
    private readonly IConfiguration _configuration;
    private readonly JwtSecurityTokenHandler _tokenHandler;

    public JwtService(IConfiguration configuration)
    {
        _configuration = configuration;
        _tokenHandler = new JwtSecurityTokenHandler();
    }

    public string GenerateAccessToken(User user)
    {
        var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Key"]!);
        
        // Получаем время жизни токена из конфигурации
        var expirationHours = _configuration.GetValue<int>("Jwt:AccessTokenExpirationHours", 24);
        
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim("IsEmailVerified", user.IsEmailVerified.ToString()),
                new Claim("jti", Guid.NewGuid().ToString()), // Уникальный идентификатор токена
                new Claim("iat", DateTimeOffset.UtcNow.ToUnixTimeSeconds().ToString(), ClaimValueTypes.Integer64) // Время выдачи
            }),
            Expires = DateTime.UtcNow.AddHours(expirationHours),
            Issuer = _configuration["Jwt:Issuer"],
            Audience = _configuration["Jwt:Audience"],
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };

        var token = _tokenHandler.CreateToken(tokenDescriptor);
        return _tokenHandler.WriteToken(token);
    }

    public bool ValidateToken(string token)
    {
        try
        {
            var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Key"]!);
            _tokenHandler.ValidateToken(token, new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ValidateIssuer = true,
                ValidIssuer = _configuration["Jwt:Issuer"],
                ValidateAudience = true,
                ValidAudience = _configuration["Jwt:Audience"],
                ValidateLifetime = true,
                ClockSkew = TimeSpan.Zero
            }, out SecurityToken validatedToken);
            return true;
        }
        catch
        {
            return false;
        }
    }

    public string? GetUserIdFromToken(string token)
    {
        try
        {
            var tokenObj = _tokenHandler.ReadJwtToken(token);
            return tokenObj.Claims.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier)?.Value;
        }
        catch
        {
            return null;
        }
    }
} 