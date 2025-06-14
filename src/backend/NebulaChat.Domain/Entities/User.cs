using System.ComponentModel.DataAnnotations;
using NebulaChat.Domain.Common;

namespace NebulaChat.Domain.Entities;

public class User : BaseEntity
{
    [Required]
    [MaxLength(50)]
    public string Username { get; set; } = string.Empty;
    
    [Required]
    [MaxLength(255)]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;
    
    [Required]
    public string PasswordHash { get; set; } = string.Empty;
    
    public bool IsEmailVerified { get; set; } = false;
    
    public DateTime? EmailVerifiedAt { get; set; }
    
    public string? EmailVerificationToken { get; set; }
    
    public DateTime? EmailVerificationTokenExpiry { get; set; }
    
    public string? PasswordResetToken { get; set; }
    
    public DateTime? PasswordResetTokenExpiry { get; set; }
    
    public DateTime? LastLoginAt { get; set; }
    
    // OAuth fields
    public string? GoogleId { get; set; }
    
    public string? GitHubId { get; set; }
    
    public string? AppleId { get; set; }
    
    public string? AvatarUrl { get; set; }
} 