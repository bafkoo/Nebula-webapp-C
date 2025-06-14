namespace NebulaChat.API.Services;

public interface IGitHubAuthService
{
    Task<GitHubUserInfo?> VerifyGitHubTokenAsync(string accessToken);
}

public class GitHubUserInfo
{
    public string GitHubId { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Username { get; set; } = string.Empty;
    public string? AvatarUrl { get; set; }
    public bool EmailVerified { get; set; } = true; // GitHub emails считаем верифицированными
} 