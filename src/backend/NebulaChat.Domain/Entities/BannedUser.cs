using NebulaChat.Domain.Common;

namespace NebulaChat.Domain.Entities;

/// <summary>
/// Represents a user who is banned from a specific chat.
/// </summary>
public class BannedUser : BaseEntity
{
    /// <summary>
    /// The ID of the chat from which the user is banned.
    /// </summary>
    public Guid ChatId { get; set; }

    /// <summary>
    /// The chat from which the user is banned.
    /// </summary>
    public Chat Chat { get; set; } = null!;

    /// <summary>
    /// The ID of the user who is banned.
    /// </summary>
    public Guid UserId { get; set; }

    /// <summary>
    /// The user who is banned.
    /// </summary>
    public User User { get; set; } = null!;

    /// <summary>
    /// The ID of the user (admin/owner) who performed the ban.
    /// </summary>
    public Guid BannedById { get; set; }

    /// <summary>
    /// The user (admin/owner) who performed the ban.
    /// </summary>
    public User BannedBy { get; set; } = null!;
    
    /// <summary>
    /// The reason for the ban.
    /// </summary>
    public string? Reason { get; set; }

    /// <summary>
    /// The date and time when the ban was issued.
    /// </summary>
    public DateTime BannedAt { get; set; } = DateTime.UtcNow;
} 