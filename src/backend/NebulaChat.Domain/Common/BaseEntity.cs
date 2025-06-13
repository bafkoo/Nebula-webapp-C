using System.ComponentModel.DataAnnotations;

namespace NebulaChat.Domain.Common;

public abstract class BaseEntity
{
    [Key]
    public Guid Id { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
} 