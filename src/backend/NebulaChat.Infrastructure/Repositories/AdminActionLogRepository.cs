using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using NebulaChat.Domain.Entities;
using NebulaChat.Domain.Interfaces;
using NebulaChat.Infrastructure.Data;

namespace NebulaChat.Infrastructure.Repositories
{
    /// <summary>
    /// Реализация репозитория для логов административных действий
    /// </summary>
    public class AdminActionLogRepository : IAdminActionLogRepository
    {
        private readonly NebulaChatDbContext _context;

        public AdminActionLogRepository(NebulaChatDbContext context)
        {
            _context = context;
        }

        /// <inheritdoc />
        public async Task AddAsync(AdminActionLog log)
        {
            await _context.AdminActionLogs.AddAsync(log);
        }

        /// <inheritdoc />
        public async Task<IEnumerable<AdminActionLog>> GetLogsByChatAsync(Guid chatId)
        {
            return await _context.AdminActionLogs
                .Include(l => l.Admin)
                .Where(l => l.ChatId == chatId)
                .OrderByDescending(l => l.Timestamp)
                .ToListAsync();
        }
    }
} 