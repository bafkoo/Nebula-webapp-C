using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using NebulaChat.Domain.Entities;
using NebulaChat.Domain.Entities.Enums;
using NebulaChat.Domain.Interfaces;
using NebulaChat.Infrastructure.Data;

namespace NebulaChat.Infrastructure.Repositories
{
    /// <summary>
    /// Реализация репозитория для работы с чатами
    /// </summary>
    public class ChatRepository : IChatRepository
    {
        private readonly NebulaChatDbContext _context;

        public ChatRepository(NebulaChatDbContext context)
        {
            _context = context;
        }

        public async Task AddAsync(Chat chat)
        {
            await _context.Chats.AddAsync(chat);
        }

        public async Task<Chat?> GetByIdAsync(Guid chatId)
        {
            return await _context.Chats
                .Include(c => c.Participants)
                .Include(c => c.Messages)
                .FirstOrDefaultAsync(c => c.Id == chatId);
        }

        public async Task<IEnumerable<Chat>> GetUserChatsAsync(Guid userId, ChatType? chatType = null, int page = 1, int pageSize = 50)
        {
            var query = _context.ChatParticipants
                .Where(p => p.UserId == userId)
                .Select(p => p.Chat)
                .AsQueryable();

            if (chatType.HasValue)
                query = query.Where(c => c.Type == chatType.Value);

            return await query
                .Include(c => c.Participants)
                .Include(c => c.Messages)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
        }

        public void Update(Chat chat)
        {
            _context.Chats.Update(chat);
        }

        public void Remove(Chat chat)
        {
            _context.Chats.Remove(chat);
        }
    }
} 