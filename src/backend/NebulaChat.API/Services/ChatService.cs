using AutoMapper;
using Microsoft.EntityFrameworkCore;
using NebulaChat.API.DTOs.Chat;
using NebulaChat.API.Services.Interfaces;
using NebulaChat.Domain.Entities;
using NebulaChat.Domain.Entities.Enums;
using NebulaChat.Infrastructure.Data;
using System;
using NebulaChat.Domain.Interfaces;

namespace NebulaChat.API.Services
{
    public class ChatService : IChatService
    {
        private readonly NebulaChatDbContext _context;
        private readonly IMapper _mapper;
        private readonly IAdminActionLogRepository _adminActionLogRepository;

        public ChatService(NebulaChatDbContext context, IMapper mapper, IAdminActionLogRepository adminActionLogRepository)
        {
            _context = context;
            _mapper = mapper;
            _adminActionLogRepository = adminActionLogRepository;
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

        public async Task<ChatDto> CreateChatAsync(CreateChatRequest request, Guid currentUserId)
        {
            // Создание нового чата
            var chat = new Chat
            {
                Name = request.Name,
                Description = request.Description,
                Type = request.Type,
                CreatedBy = currentUserId,
                IsPrivate = request.IsPrivate,
                MaxParticipants = request.MaxParticipants ?? 100
            };
            _context.Chats.Add(chat);
            await _context.SaveChangesAsync();

            // Добавление участников
            if (request.ParticipantIds.Count == 0)
            {
                request.ParticipantIds.Add(currentUserId);
            }

            var ownerId = currentUserId; // Явное определение владельца

            foreach (var participantId in request.ParticipantIds.Distinct())
            {
                var userExists = await _context.Users.AnyAsync(u => u.Id == participantId);
                if (!userExists)
                {
                    // Пропускаем несуществующих пользователей, можно добавить логирование
                    continue;
                }

                var participant = new ChatParticipant
                {
                    ChatId = chat.Id,
                    UserId = participantId,
                    Role = participantId == ownerId ? ParticipantRole.Owner : ParticipantRole.Member,
                    JoinedAt = DateTime.UtcNow
                };
                _context.ChatParticipants.Add(participant);
            }
            await _context.SaveChangesAsync();

            // Загрузка с навигационными свойствами для маппинга
            var createdChat = await _context.Chats
                .Include(c => c.Participants)
                .Include(c => c.Creator)
                .FirstOrDefaultAsync(c => c.Id == chat.Id);

            var dto = _mapper.Map<ChatDto>(createdChat!);
            return dto;
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

        public async Task<List<ChatDto>> GetUserChatsAsync(Guid userId, ChatType? chatType = null, int page = 1, int pageSize = 50)
        {
            var query = _context.Chats
                .Where(c => c.Participants.Any(p => p.UserId == userId))
                .Include(c => c.Participants)
                    .ThenInclude(p => p.User)
                .Include(c => c.Messages.OrderByDescending(m => m.CreatedAt).Take(1))
                .AsQueryable();

            if (chatType.HasValue)
            {
                query = query.Where(c => c.Type == chatType.Value);
            }
            
            var chats = await query
                .OrderByDescending(c => c.Messages.Any() ? c.Messages.Max(m => m.CreatedAt) : c.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .AsSplitQuery() // Добавляем для оптимизации
                .ToListAsync();

            return _mapper.Map<List<ChatDto>>(chats);
        }

        public async Task<List<Guid>> GetUserChatIdsAsync(Guid userId)
        {
            return await _context.ChatParticipants
                .Where(p => p.UserId == userId)
                .Select(p => p.ChatId)
                .ToListAsync();
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

            if (currentUserId != userIdToRemove)
            {
                var log = new AdminActionLog { ChatId = chatId, AdminId = currentUserId, ActionType = "Kick", TargetType = "User", TargetId = userIdToRemove, Timestamp = DateTime.UtcNow };
                await _adminActionLogRepository.AddAsync(log);
                await _context.SaveChangesAsync();
            }
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

            var logRole = new AdminActionLog { ChatId = chatId, AdminId = currentUserId, ActionType = "RoleUpdate", TargetType = "User", TargetId = userIdToUpdate, Reason = newRole.ToString(), Timestamp = DateTime.UtcNow };
            await _adminActionLogRepository.AddAsync(logRole);
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

            var logBan = new AdminActionLog { ChatId = chatId, AdminId = currentUserId, ActionType = "Ban", TargetType = "User", TargetId = userIdToBan, Reason = reason, Timestamp = DateTime.UtcNow };
            await _adminActionLogRepository.AddAsync(logBan);
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

        /// <summary>
        /// Модерация сообщения в групповом чате
        /// </summary>
        public async Task ModerateMessageAsync(Guid chatId, ModerateMessageRequest request, Guid currentUserId)
        {
            var chat = await _context.Chats
                .Include(c => c.Participants)
                .FirstOrDefaultAsync(c => c.Id == chatId);

            if (chat == null) throw new KeyNotFoundException("Chat not found.");

            var currentUserParticipant = chat.Participants.FirstOrDefault(p => p.UserId == currentUserId);
            if (currentUserParticipant == null || currentUserParticipant.Role < ParticipantRole.Admin)
                throw new UnauthorizedAccessException("You do not have permission to moderate messages.");

            var message = await _context.Messages.FirstOrDefaultAsync(m => m.Id == request.MessageId && m.ChatId == chatId);
            if (message == null) throw new KeyNotFoundException("Message not found.");

            if (request.Action.Equals("delete", StringComparison.OrdinalIgnoreCase))
            {
                _context.Messages.Remove(message);
            }
            else if (request.Action.Equals("edit", StringComparison.OrdinalIgnoreCase))
            {
                message.Content = request.Reason ?? "[Message moderated by admin]";
                _context.Messages.Update(message);
            }
            else
            {
                throw new InvalidOperationException("Invalid moderation action.");
            }

            await _context.SaveChangesAsync();

            var logModerate = new AdminActionLog { ChatId = chatId, AdminId = currentUserId, ActionType = "Moderate", TargetType = "Message", TargetId = request.MessageId, Reason = request.Action, Timestamp = DateTime.UtcNow };
            await _adminActionLogRepository.AddAsync(logModerate);
            await _context.SaveChangesAsync();
        }

        /// <summary>
        /// Получить участников чата
        /// </summary>
        public async Task<List<ParticipantDto>> GetParticipantsAsync(Guid chatId)
        {
            var participants = await _context.ChatParticipants
                .Include(p => p.User)
                .Where(p => p.ChatId == chatId && !p.HasLeft)
                .ToListAsync();
            return _mapper.Map<List<ParticipantDto>>(participants);
        }

        public async Task<ChatDto> UpdateGroupSettingsAsync(Guid chatId, UpdateGroupSettingsRequest request, Guid currentUserId)
        {
            var chat = await _context.Chats
                .Include(c => c.Participants)
                .FirstOrDefaultAsync(c => c.Id == chatId);

            if (chat == null) throw new KeyNotFoundException("Chat not found.");

            var currentUserParticipant = chat.Participants.FirstOrDefault(p => p.UserId == currentUserId);
            if (currentUserParticipant == null || currentUserParticipant.Role < ParticipantRole.Admin)
                throw new UnauthorizedAccessException("You do not have permission to update group settings.");

            if (chat.Type != ChatType.Group)
                throw new InvalidOperationException("Settings can only be updated for group chats.");

            if (request.Name is not null) chat.Name = request.Name;
            if (request.Description is not null) chat.Description = request.Description;
            if (request.AvatarUrl is not null) chat.AvatarUrl = request.AvatarUrl;
            if (request.IsPrivate.HasValue) chat.IsPrivate = request.IsPrivate.Value;
            if (request.MaxParticipants.HasValue) chat.MaxParticipants = request.MaxParticipants.Value;

            _context.Chats.Update(chat);
            await _context.SaveChangesAsync();

            var logSettings = new AdminActionLog { ChatId = chatId, AdminId = currentUserId, ActionType = "SettingsUpdate", TargetType = "Chat", TargetId = chatId, Timestamp = DateTime.UtcNow };
            await _adminActionLogRepository.AddAsync(logSettings);
            await _context.SaveChangesAsync();

            var dto = _mapper.Map<ChatDto>(chat);
            return dto;
        }
    }
} 