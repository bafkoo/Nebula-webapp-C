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
    public DbSet<Chat> Chats { get; set; }
    public DbSet<Message> Messages { get; set; }
    public DbSet<ChatParticipant> ChatParticipants { get; set; }
    public DbSet<BannedUser> BannedUsers { get; set; }
    public DbSet<ChatInvite> ChatInvites { get; set; }
    public DbSet<AdminActionLog> AdminActionLogs { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // User entity configuration
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).ValueGeneratedOnAdd();
            
            // Уникальные индексы для быстрого поиска
            entity.HasIndex(e => e.Username).IsUnique();
            entity.HasIndex(e => e.Email).IsUnique();
            
            // Индексы для OAuth провайдеров
            entity.HasIndex(e => e.GoogleId);
            entity.HasIndex(e => e.GitHubId);
            entity.HasIndex(e => e.AppleId);
            
            // Индекс для последней активности (для online статуса)
            entity.HasIndex(e => e.LastLoginAt);
            
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
                
            entity.Property(e => e.AvatarUrl)
                .HasMaxLength(500);
                
            // Ограничение на OAuth ID
            entity.Property(e => e.GoogleId)
                .HasMaxLength(100);
                
            entity.Property(e => e.GitHubId)
                .HasMaxLength(100);
                
            entity.Property(e => e.AppleId)
                .HasMaxLength(100);
        });

        // Chat entity configuration
        modelBuilder.Entity<Chat>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).ValueGeneratedOnAdd();
            
            entity.Property(e => e.Name)
                .HasMaxLength(100);
                
            entity.Property(e => e.Description)
                .HasMaxLength(1000); // Увеличено для групповых чатов
                
            entity.Property(e => e.Type)
                .IsRequired();
                
            entity.Property(e => e.AvatarUrl)
                .HasMaxLength(500);
                
            // Ограничения для групповых чатов
            entity.Property(e => e.MaxParticipants)
                .HasDefaultValue(100);
                
            entity.HasOne(e => e.Creator)
                .WithMany()
                .HasForeignKey(e => e.CreatedBy)
                .OnDelete(DeleteBehavior.Restrict);
                
            // Оптимальные индексы для производительности
            entity.HasIndex(e => new { e.Type, e.CreatedBy });
            entity.HasIndex(e => e.LastMessageAt)
                .HasDatabaseName("IX_Chats_LastMessageAt")
                .IsDescending(); // Для сортировки по последним сообщениям
            
            // Индекс для поиска активных чатов
            entity.HasIndex(e => new { e.IsArchived, e.LastMessageAt })
                .HasDatabaseName("IX_Chats_ActiveChats")
                .HasFilter("[IsArchived] = 0");
            
            // Индекс для поиска по названию
            entity.HasIndex(e => e.Name)
                .HasDatabaseName("IX_Chats_Name_Search");
                
            // Поддержка soft delete
            entity.HasQueryFilter(e => !e.IsArchived);
        });

        // Message entity configuration
        modelBuilder.Entity<Message>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).ValueGeneratedOnAdd();
            
            // ОГРАНИЧЕНИЕ НА РАЗМЕР СООБЩЕНИЙ
            entity.Property(e => e.Content)
                .IsRequired()
                .HasMaxLength(2000); // Discord-like лимит
                
            entity.Property(e => e.Type)
                .IsRequired();
                
            entity.Property(e => e.FileName)
                .HasMaxLength(255);
                
            entity.Property(e => e.MimeType)
                .HasMaxLength(100);
                
            entity.Property(e => e.FileUrl)
                .HasMaxLength(500);
                
            // CASCADE УДАЛЕНИЕ для сообщений при удалении чата
            entity.HasOne(e => e.Chat)
                .WithMany(c => c.Messages)
                .HasForeignKey(e => e.ChatId)
                .OnDelete(DeleteBehavior.Cascade);
                
            entity.HasOne(e => e.Author)
                .WithMany()
                .HasForeignKey(e => e.AuthorId)
                .OnDelete(DeleteBehavior.Restrict); // Сохраняем сообщения при удалении пользователя
                
            entity.HasOne(e => e.ReplyToMessage)
                .WithMany(m => m.Replies)
                .HasForeignKey(e => e.ReplyToMessageId)
                .OnDelete(DeleteBehavior.Restrict);
                
            // КРИТИЧЕСКИЕ ИНДЕКСЫ для производительности чата
            
            // Основной индекс для получения сообщений чата (с пагинацией)
            entity.HasIndex(e => new { e.ChatId, e.CreatedAt })
                .HasDatabaseName("IX_Messages_Chat_CreatedAt")
                .IsDescending(false, true); // Сортировка по дате убывающая
            
            // Индекс для поиска по автору
            entity.HasIndex(e => e.AuthorId)
                .HasDatabaseName("IX_Messages_Author");
            
            // Индекс для ответов на сообщения
            entity.HasIndex(e => e.ReplyToMessageId)
                .HasDatabaseName("IX_Messages_ReplyTo")
                .HasFilter("[ReplyToMessageId] IS NOT NULL");
                
            // Индекс для поиска отредактированных сообщений
            entity.HasIndex(e => new { e.ChatId, e.IsEdited })
                .HasDatabaseName("IX_Messages_Chat_Edited")
                .HasFilter("[IsEdited] = 1");
                
            // Индекс для поиска удаленных сообщений (soft delete)
            entity.HasIndex(e => new { e.ChatId, e.IsDeleted })
                .HasDatabaseName("IX_Messages_Chat_Deleted")
                .HasFilter("[IsDeleted] = 1");
                
            // Поддержка soft delete - скрываем удаленные сообщения
            entity.HasQueryFilter(e => !e.IsDeleted);
        });

        // ChatParticipant entity configuration
        modelBuilder.Entity<ChatParticipant>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).ValueGeneratedOnAdd();
            
            entity.Property(e => e.Role)
                .IsRequired();
                
            entity.Property(e => e.BanReason)
                .HasMaxLength(500);
                
            // CASCADE УДАЛЕНИЕ участников при удалении чата
            entity.HasOne(e => e.Chat)
                .WithMany(c => c.Participants)
                .HasForeignKey(e => e.ChatId)
                .OnDelete(DeleteBehavior.Cascade);
                
            entity.HasOne(e => e.User)
                .WithMany()
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);
                
            entity.HasOne(e => e.LastReadMessage)
                .WithMany()
                .HasForeignKey(e => e.LastReadMessageId)
                .OnDelete(DeleteBehavior.Restrict); // Не удалять участников при удалении сообщения
                
            // КРИТИЧЕСКИЙ ИНДЕКС - уникальность участников в чате
            entity.HasIndex(e => new { e.ChatId, e.UserId })
                .IsUnique()
                .HasDatabaseName("IX_ChatParticipants_Unique");
            
            // Индекс для получения чатов пользователя (основной запрос)
            entity.HasIndex(e => e.UserId)
                .HasDatabaseName("IX_ChatParticipants_User");
            
            // Индекс для сортировки по времени присоединения
            entity.HasIndex(e => new { e.ChatId, e.JoinedAt })
                .HasDatabaseName("IX_ChatParticipants_Chat_Joined");
                
            // Индекс для активных участников (не забаненных)
            entity.HasIndex(e => new { e.ChatId, e.IsBanned })
                .HasDatabaseName("IX_ChatParticipants_Chat_Active")
                .HasFilter("[IsBanned] = 0");

            // Индекс для отслеживания непрочитанных сообщений
            entity.HasIndex(e => new { e.UserId, e.LastReadMessageId, e.ChatId })
                .HasDatabaseName("IX_ChatParticipants_UnreadMessages");

            // Индекс для уведомлений
            entity.HasIndex(e => new { e.UserId, e.NotificationsEnabled })
                .HasDatabaseName("IX_ChatParticipants_Notifications")
                .HasFilter("[NotificationsEnabled] = 1");
        });
        
        // BannedUser entity configuration
        modelBuilder.Entity<BannedUser>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).ValueGeneratedOnAdd();

            entity.Property(e => e.Reason)
                .HasMaxLength(500);

            // Связь с чатом
            entity.HasOne(e => e.Chat)
                .WithMany(c => c.BannedUsers)
                .HasForeignKey(e => e.ChatId)
                .OnDelete(DeleteBehavior.Cascade); // Удалять бан при удалении чата

            // Связь с забаненным пользователем
            entity.HasOne(e => e.User)
                .WithMany()
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade); // Удалять бан при удалении пользователя

            // Связь с администратором, который забанил
            entity.HasOne(e => e.BannedBy)
                .WithMany()
                .HasForeignKey(e => e.BannedById)
                .OnDelete(DeleteBehavior.Restrict); // Не удалять админа, если он кого-то банил

            // Уникальный индекс, чтобы нельзя было забанить одного и того же пользователя дважды в одном чате
            entity.HasIndex(e => new { e.ChatId, e.UserId })
                .IsUnique()
                .HasDatabaseName("IX_BannedUsers_Unique");
        });

        // ChatInvite entity configuration
        modelBuilder.Entity<ChatInvite>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).ValueGeneratedOnAdd();

            // Связь с чатом
            entity.HasOne(e => e.Chat)
                .WithMany()
                .HasForeignKey(e => e.ChatId)
                .OnDelete(DeleteBehavior.Cascade); // Удалять приглашение при удалении чата

            // Связь с приглашающим пользователем
            entity.HasOne(e => e.Inviter)
                .WithMany()
                .HasForeignKey(e => e.InviterId)
                .OnDelete(DeleteBehavior.Restrict); // Не удалять приглашения при удалении пользователя

            // Связь с приглашенным пользователем
            entity.HasOne(e => e.Invitee)
                .WithMany()
                .HasForeignKey(e => e.InviteeId)
                .OnDelete(DeleteBehavior.Restrict); // Не удалять приглашения при удалении пользователя

            // Индекс для поиска приглашений по чату
            entity.HasIndex(e => e.ChatId)
                .HasDatabaseName("IX_ChatInvites_Chat");

            // Индекс для поиска приглашений по приглашенному пользователю
            entity.HasIndex(e => e.InviteeId)
                .HasDatabaseName("IX_ChatInvites_Invitee");

            // Индекс для поиска истекших приглашений
            entity.HasIndex(e => e.ExpiresAt)
                .HasDatabaseName("IX_ChatInvites_ExpiresAt");
        });

        // AdminActionLog entity configuration
        modelBuilder.Entity<AdminActionLog>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Id).ValueGeneratedOnAdd();

            entity.Property(e => e.ActionType)
                .IsRequired()
                .HasMaxLength(100);

            entity.Property(e => e.TargetType)
                .IsRequired()
                .HasMaxLength(100);

            entity.Property(e => e.Reason)
                .HasMaxLength(500);

            // Связь с чатом
            entity.HasOne(e => e.Chat)
                .WithMany()
                .HasForeignKey(e => e.ChatId)
                .OnDelete(DeleteBehavior.Cascade); // Удалять логи при удалении чата

            // Связь с администратором
            entity.HasOne(e => e.Admin)
                .WithMany()
                .HasForeignKey(e => e.AdminId)
                .OnDelete(DeleteBehavior.Restrict); // Не удалять логи при удалении админа

            // Индекс для поиска логов по чату
            entity.HasIndex(e => e.ChatId)
                .HasDatabaseName("IX_AdminActionLogs_Chat");

            // Индекс для поиска логов по администратору
            entity.HasIndex(e => e.AdminId)
                .HasDatabaseName("IX_AdminActionLogs_Admin");

            // Индекс для поиска по типу действия
            entity.HasIndex(e => e.ActionType)
                .HasDatabaseName("IX_AdminActionLogs_ActionType");

            // Индекс для поиска по времени
            entity.HasIndex(e => e.Timestamp)
                .HasDatabaseName("IX_AdminActionLogs_Timestamp")
                .IsDescending();
        });

        // Дополнительные ограничения на уровне базы данных
        
        // Ограничение на максимальное количество участников в чате
        modelBuilder.Entity<Chat>()
            .ToTable(t => t.HasCheckConstraint("CK_Chat_MaxParticipants", "\"MaxParticipants\" > 0 AND \"MaxParticipants\" <= 10000"));
            
        // Ограничение на размер файлов (50MB в байтах)
        modelBuilder.Entity<Message>()
            .ToTable(t => t.HasCheckConstraint("CK_Message_FileSize", "\"FileSize\" IS NULL OR \"FileSize\" <= 52428800"));
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