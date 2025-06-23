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
    /// Реализация репозитория для работы с сообщениями
    /// </summary>
    public class MessageRepository : IMessageRepository
    {
        private readonly NebulaChatDbContext _context;

        public MessageRepository(NebulaChatDbContext context)
        {
            _context = context;
        }

        public async Task AddAsync(Message message)
        {
            await _context.Messages.AddAsync(message);
        }

        public async Task<Message?> GetByIdAsync(Guid messageId)
        {
            return await _context.Messages
                .Include(m => m.Author)
                .Include(m => m.Replies)
                .FirstOrDefaultAsync(m => m.Id == messageId);
        }

        public async Task<IEnumerable<Message>> GetMessagesByChatAsync(Guid chatId, int page = 1, int pageSize = 50)
        {
            var query = _context.Messages
                .Where(m => m.ChatId == chatId)
                .OrderByDescending(m => m.CreatedAt)
                .AsQueryable();

            return await query
                .Include(m => m.Author)
                .Include(m => m.Replies)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
        }

        public void Update(Message message)
        {
            _context.Messages.Update(message);
        }

        public void Remove(Message message)
        {
            _context.Messages.Remove(message);
        }
    }
} 