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
            string jsonString;
            
            // Проверяем, является ли токен уже JSON строкой
            if (idToken.StartsWith("{") && idToken.EndsWith("}"))
            {
                // Токен уже является JSON
                jsonString = idToken;
            }
            else if (idToken.StartsWith("\"") && idToken.Contains(":"))
            {
                // JSON без фигурных скобок - добавляем только недостающие
                if (!idToken.StartsWith("{"))
                {
                    jsonString = "{" + idToken;
                }
                else
                {
                    jsonString = idToken;
                }
                
                if (!jsonString.EndsWith("}"))
                {
                    jsonString = jsonString + "}";
                }
            }
            else
            {
                // Пытаемся декодировать как base64
                try
                {
                    var decodedBytes = Convert.FromBase64String(idToken);
                    jsonString = System.Text.Encoding.UTF8.GetString(decodedBytes);
                    
                    // Удаляем BOM если присутствует
                    if (jsonString.StartsWith("\uFEFF"))
                    {
                        jsonString = jsonString.Substring(1);
                    }
                    
                    // Проверяем, нужно ли добавить фигурные скобки
                    if (!jsonString.StartsWith("{") && jsonString.Contains(":"))
                    {
                        jsonString = "{" + jsonString;
                    }
                    if (!jsonString.EndsWith("}") && jsonString.Contains(":"))
                    {
                        jsonString = jsonString + "}";
                    }
                }
                catch
                {
                    // Если не удалось декодировать base64, используем как есть
                    jsonString = idToken;
                    if (!jsonString.StartsWith("{") && jsonString.Contains(":"))
                    {
                        jsonString = "{" + jsonString;
                    }
                    if (!jsonString.EndsWith("}") && jsonString.Contains(":"))
                    {
                        jsonString = jsonString + "}";
                    }
                }
            }
            
            Console.WriteLine($"Final JSON for parsing: {jsonString}");
            
            var userInfo = JsonSerializer.Deserialize<Dictionary<string, JsonElement>>(jsonString);

            if (userInfo != null && userInfo.ContainsKey("email"))
            {
                return new GoogleUserInfo
                {
                    GoogleId = userInfo.GetValueOrDefault("sub").GetString() ?? "",
                    Email = userInfo.GetValueOrDefault("email").GetString() ?? "",
                    Name = userInfo.GetValueOrDefault("name").GetString() ?? "",
                    Picture = userInfo.GetValueOrDefault("picture").GetString(),
                    EmailVerified = userInfo.GetValueOrDefault("email_verified").GetBoolean()
                };
            }

            return null;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error verifying Google token: {ex.Message}");
            Console.WriteLine($"Token length: {idToken?.Length ?? 0}");
            return null;
        }
    }
} 