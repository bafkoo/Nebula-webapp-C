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
    /// Реализация репозитория для работы с приглашениями в чат
    /// </summary>
    public class ChatInviteRepository : IChatInviteRepository
    {
        private readonly NebulaChatDbContext _context;

        public ChatInviteRepository(NebulaChatDbContext context)
        {
            _context = context;
        }

        public async Task AddAsync(ChatInvite invite)
        {
            await _context.ChatInvites.AddAsync(invite);
        }

        public async Task<ChatInvite?> GetByIdAsync(Guid inviteId)
        {
            return await _context.ChatInvites
                .Include(i => i.Chat)
                .Include(i => i.Inviter)
                .Include(i => i.Invitee)
                .FirstOrDefaultAsync(i => i.Id == inviteId);
        }

        public async Task<IEnumerable<ChatInvite>> GetInvitesForUserAsync(Guid userId)
        {
            return await _context.ChatInvites
                .Where(i => i.InviteeId == userId)
                .Include(i => i.Chat)
                .Include(i => i.Inviter)
                .ToListAsync();
        }

        public void Remove(ChatInvite invite)
        {
            _context.ChatInvites.Remove(invite);
        }
    }
} 