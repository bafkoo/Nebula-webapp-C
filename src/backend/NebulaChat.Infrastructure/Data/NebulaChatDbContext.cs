using Microsoft.EntityFrameworkCore;
using NebulaChat.Domain.Entities;
using NebulaChat.Domain.Common;

namespace NebulaChat.Infrastructure.Data;

public class NebulaChatDbContext : DbContext
{
    public NebulaChatDbContext(DbContextOptions<NebulaChatDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // User entity configuration
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).ValueGeneratedOnAdd();
            
            entity.HasIndex(e => e.Username).IsUnique();
            entity.HasIndex(e => e.Email).IsUnique();
            
            entity.Property(e => e.Username)
                .IsRequired()
                .HasMaxLength(50);
                
            entity.Property(e => e.Email)
                .IsRequired()
                .HasMaxLength(255);
                
            entity.Property(e => e.PasswordHash)
                .IsRequired();
                
            entity.Property(e => e.EmailVerificationToken)
                .HasMaxLength(500);
                
            entity.Property(e => e.PasswordResetToken)
                .HasMaxLength(500);
        });
    }

    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        // Automatically update UpdatedAt for BaseEntity
        var entries = ChangeTracker
            .Entries()
            .Where(e => e.Entity is BaseEntity && (e.State == EntityState.Added || e.State == EntityState.Modified));

        foreach (var entityEntry in entries)
        {
            if (entityEntry.Entity is BaseEntity entity)
            {
                entity.UpdatedAt = DateTime.UtcNow;
                
                if (entityEntry.State == EntityState.Added)
                {
                    entity.CreatedAt = DateTime.UtcNow;
                }
            }
        }

        return await base.SaveChangesAsync(cancellationToken);
    }
} 