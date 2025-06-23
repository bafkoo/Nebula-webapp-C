using AutoMapper;
using Microsoft.EntityFrameworkCore;
using NebulaChat.API.DTOs.Chat;
using NebulaChat.API.Services.Interfaces;
using NebulaChat.Domain.Entities;
using NebulaChat.Domain.Entities.Enums;
using NebulaChat.Infrastructure.Data;

namespace NebulaChat.API.Services
{
    public class ChatService : IChatService
    {
        private readonly NebulaChatDbContext _context;
        private readonly IMapper _mapper;

        public ChatService(NebulaChatDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task AddParticipantAsync(Guid chatId, Guid userIdToAdd, Guid currentUserId)
        {
            var chat = await _context.Chats
                .Include(c => c.Participants)
                .FirstOrDefaultAsync(c => c.Id == chatId);

            if (chat == null)
            {
                // Consider using a custom, more specific exception
                throw new KeyNotFoundException("Chat not found.");
            }

            var currentUserParticipant = chat.Participants.FirstOrDefault(p => p.UserId == currentUserId);

            if (currentUserParticipant == null || (currentUserParticipant.Role != ParticipantRole.Admin && currentUserParticipant.Role != ParticipantRole.Owner))
            {
                throw new UnauthorizedAccessException("You do not have permission to add new participants to this chat.");
            }
            
            if (chat.Type == ChatType.Private)
            {
                throw new InvalidOperationException("Cannot add participants to a private chat.");
            }

            if (chat.Participants.Any(p => p.UserId == userIdToAdd))
            {
                // The user is already in the chat, the operation is considered successful (idempotency).
                return;
            }

            var userToAddExists = await _context.Users.AnyAsync(u => u.Id == userIdToAdd);
            if (!userToAddExists)
            {
                throw new KeyNotFoundException("The user you are trying to add does not exist.");
            }

            var newParticipant = new Domain.Entities.ChatParticipant
            {
                ChatId = chatId,
                UserId = userIdToAdd,
                Role = ParticipantRole.Member
            };

            _context.ChatParticipants.Add(newParticipant);
            await _context.SaveChangesAsync();
        }

        public Task<bool> ArchiveChatAsync(Guid chatId, bool isArchived, Guid currentUserId)
        {
            // TODO: Implement logic
            return Task.FromResult(true);
        }

        public Task<ChatDto> CreateChatAsync(CreateChatRequest request, Guid currentUserId)
        {
            // TODO: Implement logic
            throw new NotImplementedException();
        }

        public Task<bool> DeleteChatAsync(Guid chatId, Guid currentUserId)
        {
            // TODO: Implement logic
            return Task.FromResult(true);
        }

        public Task<ChatDto?> GetChatAsync(Guid chatId, Guid currentUserId)
        {
            // TODO: Implement logic
            return Task.FromResult<ChatDto?>(null);
        }

        public Task<List<ChatDto>> GetUserChatsAsync(Guid userId, ChatType? chatType = null, int page = 1, int pageSize = 50)
        {
            // TODO: Implement logic
            return Task.FromResult(new List<ChatDto>());
        }

        public async Task<bool> HasAccessToChatAsync(Guid chatId, Guid userId)
        {
            return await _context.ChatParticipants
                .AnyAsync(p => p.ChatId == chatId && p.UserId == userId);
        }

        public async Task RemoveParticipantAsync(Guid chatId, Guid userIdToRemove, Guid currentUserId)
        {
            var chat = await _context.Chats
                .Include(c => c.Participants)
                .FirstOrDefaultAsync(c => c.Id == chatId);

            if (chat == null)
            {
                throw new KeyNotFoundException("Chat not found.");
            }

            var participantToRemove = chat.Participants.FirstOrDefault(p => p.UserId == userIdToRemove);
            
            if (participantToRemove == null)
            {
                // User is not in the chat, operation is successful (idempotency).
                return;
            }

            if (participantToRemove.Role == ParticipantRole.Owner)
            {
                throw new InvalidOperationException("Cannot remove the owner of the chat.");
            }

            var currentUserParticipant = chat.Participants.FirstOrDefault(p => p.UserId == currentUserId);

            // A user can remove themselves, or an admin/owner can remove others.
            if (currentUserId != userIdToRemove && (currentUserParticipant == null || (currentUserParticipant.Role != ParticipantRole.Admin && currentUserParticipant.Role != ParticipantRole.Owner)))
            {
                throw new UnauthorizedAccessException("You do not have permission to remove this participant.");
            }

            _context.ChatParticipants.Remove(participantToRemove);
            await _context.SaveChangesAsync();
        }

        public Task<List<ChatDto>> SearchChatsAsync(string query, Guid userId, ChatType? chatType = null)
        {
            // TODO: Implement logic
            return Task.FromResult(new List<ChatDto>());
        }

        public Task<ChatDto?> UpdateChatAsync(Guid chatId, string? name, string? description, string? avatarUrl, Guid currentUserId)
        {
            // TODO: Implement logic
            return Task.FromResult<ChatDto?>(null);
        }

        public async Task UpdateParticipantRoleAsync(Guid chatId, Guid userIdToUpdate, ParticipantRole newRole, Guid currentUserId)
        {
            var chat = await _context.Chats
                .Include(c => c.Participants)
                .FirstOrDefaultAsync(c => c.Id == chatId);

            if (chat == null)
            {
                throw new KeyNotFoundException("Chat not found.");
            }

            var currentUserParticipant = chat.Participants.FirstOrDefault(p => p.UserId == currentUserId);
            var participantToUpdate = chat.Participants.FirstOrDefault(p => p.UserId == userIdToUpdate);

            if (currentUserParticipant == null || participantToUpdate == null)
            {
                throw new KeyNotFoundException("One of the users is not a participant in this chat.");
            }

            // --- Permission Checks ---

            // Only Admins or Owners can change roles.
            if (currentUserParticipant.Role < ParticipantRole.Admin)
            {
                throw new UnauthorizedAccessException("You do not have permission to change participant roles.");
            }

            // Cannot change the Owner's role.
            if (participantToUpdate.Role == ParticipantRole.Owner)
            {
                throw new InvalidOperationException("The chat owner's role cannot be changed.");
            }
            
            // An Admin cannot change another Admin's role. Only the Owner can.
            if (currentUserParticipant.Role == ParticipantRole.Admin && participantToUpdate.Role == ParticipantRole.Admin)
            {
                throw new UnauthorizedAccessException("Admins cannot change the roles of other admins.");
            }

            // Cannot promote someone to Owner via this method.
            if (newRole == ParticipantRole.Owner)
            {
                throw new InvalidOperationException("Ownership cannot be transferred via this method.");
            }

            // --- Update Role ---
            participantToUpdate.Role = newRole;
            _context.ChatParticipants.Update(participantToUpdate);
            await _context.SaveChangesAsync();
        }

        public async Task BanUserAsync(Guid chatId, Guid userIdToBan, string? reason, Guid currentUserId)
        {
            var chat = await _context.Chats
                .Include(c => c.Participants)
                .FirstOrDefaultAsync(c => c.Id == chatId);

            if (chat == null) throw new KeyNotFoundException("Chat not found.");

            var currentUserParticipant = chat.Participants.FirstOrDefault(p => p.UserId == currentUserId);
            if (currentUserParticipant == null || currentUserParticipant.Role < ParticipantRole.Admin)
                throw new UnauthorizedAccessException("You do not have permission to ban users in this chat.");
            
            var participantToBan = chat.Participants.FirstOrDefault(p => p.UserId == userIdToBan);
            if (participantToBan != null)
            {
                if (participantToBan.Role >= currentUserParticipant.Role)
                    throw new UnauthorizedAccessException("You cannot ban a user with the same or higher role.");
            }
            
            var isAlreadyBanned = await _context.BannedUsers.AnyAsync(b => b.ChatId == chatId && b.UserId == userIdToBan);
            if (isAlreadyBanned)
            {
                // User is already banned, consider the operation successful.
                return;
            }

            // If the user is a participant, remove them first.
            if (participantToBan != null)
            {
                _context.ChatParticipants.Remove(participantToBan);
            }

            var ban = new BannedUser
            {
                ChatId = chatId,
                UserId = userIdToBan,
                BannedById = currentUserId,
                Reason = reason,
                BannedAt = DateTime.UtcNow
            };

            await _context.BannedUsers.AddAsync(ban);
            await _context.SaveChangesAsync();
        }

        public async Task UnbanUserAsync(Guid chatId, Guid userIdToUnban, Guid currentUserId)
        {
            var chat = await _context.Chats
                .Include(c => c.Participants)
                .FirstOrDefaultAsync(c => c.Id == chatId);
        
            if (chat == null) throw new KeyNotFoundException("Chat not found.");

            var currentUserParticipant = chat.Participants.FirstOrDefault(p => p.UserId == currentUserId);
            if (currentUserParticipant == null || currentUserParticipant.Role < ParticipantRole.Admin)
                throw new UnauthorizedAccessException("You do not have permission to unban users in this chat.");

            var banRecord = await _context.BannedUsers.FirstOrDefaultAsync(b => b.ChatId == chatId && b.UserId == userIdToUnban);

            if (banRecord != null)
            {
                _context.BannedUsers.Remove(banRecord);
                await _context.SaveChangesAsync();
            }
            
            // If the record doesn't exist, we consider the operation successful (idempotency).
        }
    }
} 