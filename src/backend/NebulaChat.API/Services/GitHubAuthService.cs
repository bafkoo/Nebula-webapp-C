using System.Text.Json;

namespace NebulaChat.API.Services;

public class GitHubAuthService : IGitHubAuthService
{
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _configuration;

    public GitHubAuthService(HttpClient httpClient, IConfiguration configuration)
    {
        _httpClient = httpClient;
        _configuration = configuration;
    }

    public async Task<GitHubUserInfo?> VerifyGitHubTokenAsync(string accessToken)
    {
        try
        {
            // Настраиваем заголовки для GitHub API
            _httpClient.DefaultRequestHeaders.Clear();
            _httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {accessToken}");
            _httpClient.DefaultRequestHeaders.Add("User-Agent", "NebulaChat");
            _httpClient.DefaultRequestHeaders.Add("Accept", "application/vnd.github.v3+json");

            // Получаем информацию о пользователе
            var userResponse = await _httpClient.GetAsync("https://api.github.com/user");
            if (!userResponse.IsSuccessStatusCode)
            {
                Console.WriteLine($"GitHub API error: {userResponse.StatusCode}");
                return null;
            }

            var userJson = await userResponse.Content.ReadAsStringAsync();
            var userInfo = JsonSerializer.Deserialize<JsonElement>(userJson);

            // Получаем email (может быть приватным)
            var emailResponse = await _httpClient.GetAsync("https://api.github.com/user/emails");
            string? primaryEmail = null;
            
            if (emailResponse.IsSuccessStatusCode)
            {
                var emailJson = await emailResponse.Content.ReadAsStringAsync();
                var emails = JsonSerializer.Deserialize<JsonElement[]>(emailJson);
                
                // Ищем основной email
                if (emails != null)
                {
                    foreach (var email in emails)
                    {
                        if (email.GetProperty("primary").GetBoolean())
                        {
                            primaryEmail = email.GetProperty("email").GetString();
                            break;
                        }
                    }
                }
            }

            // Если нет основного email, берем первый доступный
            if (string.IsNullOrEmpty(primaryEmail) && userInfo.TryGetProperty("email", out var emailProp))
            {
                primaryEmail = emailProp.GetString();
            }

            if (string.IsNullOrEmpty(primaryEmail))
            {
                Console.WriteLine("No email found for GitHub user");
                return null;
            }

            return new GitHubUserInfo
            {
                GitHubId = userInfo.GetProperty("id").GetInt32().ToString(),
                Email = primaryEmail,
                Name = userInfo.TryGetProperty("name", out var nameProp) ? nameProp.GetString() ?? "" : "",
                Username = userInfo.GetProperty("login").GetString() ?? "",
                AvatarUrl = userInfo.TryGetProperty("avatar_url", out var avatarProp) ? avatarProp.GetString() : null,
                EmailVerified = true
            };
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error verifying GitHub token: {ex.Message}");
            return null;
        }
    }
} 