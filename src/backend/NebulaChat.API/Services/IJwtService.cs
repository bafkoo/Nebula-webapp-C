using NebulaChat.Domain.Entities;

namespace NebulaChat.API.Services;

public interface IJwtService
{
    string GenerateAccessToken(User user);
    bool ValidateToken(string token);
    string? GetUserIdFromToken(string token);
} 