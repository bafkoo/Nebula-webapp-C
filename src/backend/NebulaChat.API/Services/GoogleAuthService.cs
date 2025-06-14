using System.Text.Json;

namespace NebulaChat.API.Services;

public class GoogleAuthService : IGoogleAuthService
{
    private readonly IConfiguration _configuration;

    public GoogleAuthService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public async Task<GoogleUserInfo?> VerifyGoogleTokenAsync(string idToken)
    {
        try
        {
            // Декодируем base64 токен с поддержкой UTF-8
            var decodedBytes = Convert.FromBase64String(idToken);
            var decodedJson = System.Text.Encoding.UTF8.GetString(decodedBytes);
            
            var userInfo = JsonSerializer.Deserialize<Dictionary<string, object>>(decodedJson);

            if (userInfo != null && userInfo.ContainsKey("email"))
            {
                return new GoogleUserInfo
                {
                    GoogleId = userInfo.GetValueOrDefault("sub")?.ToString() ?? "",
                    Email = userInfo.GetValueOrDefault("email")?.ToString() ?? "",
                    Name = userInfo.GetValueOrDefault("name")?.ToString() ?? "",
                    Picture = userInfo.GetValueOrDefault("picture")?.ToString(),
                    EmailVerified = bool.Parse(userInfo.GetValueOrDefault("email_verified")?.ToString() ?? "false")
                };
            }

            return null;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error verifying Google token: {ex.Message}");
            return null;
        }
    }
} 