using System.Threading.Tasks;
using NebulaChat.Domain.Interfaces;
using NebulaChat.Infrastructure.Data;

namespace NebulaChat.Infrastructure.Repositories
{
    /// <summary>
    /// Реализация паттерна Unit of Work для управления репозиториями и сохранения изменений
    /// </summary>
    public class UnitOfWork : IUnitOfWork
    {
        private readonly NebulaChatDbContext _context;
        private IChatRepository? _chatRepository;
        private IMessageRepository? _messageRepository;
        private IChatInviteRepository? _chatInviteRepository;
        private IAdminActionLogRepository? _adminActionLogRepository;

        public UnitOfWork(NebulaChatDbContext context)
        {
            _context = context;
        }

        /// <inheritdoc />
        public IChatRepository ChatRepository => _chatRepository ??= new ChatRepository(_context);

        /// <inheritdoc />
        public IMessageRepository MessageRepository => _messageRepository ??= new MessageRepository(_context);

        /// <inheritdoc />
        public IChatInviteRepository ChatInviteRepository => _chatInviteRepository ??= new ChatInviteRepository(_context);

        /// <inheritdoc />
        public IAdminActionLogRepository AdminActionLogRepository => _adminActionLogRepository ??= new AdminActionLogRepository(_context);

        /// <inheritdoc />
        public Task<int> SaveChangesAsync() => _context.SaveChangesAsync();
    }
} 