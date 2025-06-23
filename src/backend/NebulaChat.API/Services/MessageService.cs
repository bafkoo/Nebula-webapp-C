using AutoMapper;
using Microsoft.EntityFrameworkCore;
using NebulaChat.API.DTOs.Chat;
using NebulaChat.API.Services.Interfaces;
using NebulaChat.Domain.Entities;
using NebulaChat.Infrastructure.Data;

namespace NebulaChat.API.Services
{
    public class MessageService : IMessageService
    {
        private readonly NebulaChatDbContext _context;
        private readonly IMapper _mapper;
        private readonly IChatService _chatService;

        public MessageService(NebulaChatDbContext context, IMapper mapper, IChatService chatService)
        {
            _context = context;
            _mapper = mapper;
            _chatService = chatService;
        }

        public Task DeleteMessageAsync(Guid messageId, Guid userId)
        {
            // TODO: Implement logic
            return Task.CompletedTask;
        }

        public async Task<MessageDto> EditMessageAsync(Guid messageId, string newContent, Guid userId)
        {
            var message = await _context.Messages
                .Include(m => m.Author)
                .FirstOrDefaultAsync(m => m.Id == messageId);

            if (message == null)
            {
                throw new KeyNotFoundException("Message not found.");
            }

            if (message.AuthorId != userId)
            {
                throw new UnauthorizedAccessException("You can only edit your own messages.");
            }

            message.Content = newContent;
            message.IsEdited = true;
            message.EditedAt = DateTime.UtcNow;

            _context.Messages.Update(message);
            await _context.SaveChangesAsync();

            return _mapper.Map<MessageDto>(message);
        }

        public Task<MessageDto> GetMessageAsync(Guid messageId, Guid userId)
        {
            // TODO: Implement logic
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<MessageDto>> GetMessagesAsync(Guid chatId, Guid userId, int page, int pageSize)
        {
            var hasAccess = await _chatService.HasAccessToChatAsync(chatId, userId);
            if (!hasAccess)
            {
                // Return empty list or throw exception? Let's return empty for now.
                // Or throwing is better to signal the client that something is wrong.
                throw new UnauthorizedAccessException("You do not have access to this chat.");
            }

            var messages = await _context.Messages
                .Include(m => m.Author)
                .Where(m => m.ChatId == chatId)
                .OrderByDescending(m => m.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();
                
            // The list needs to be reversed to display correctly in the chat (oldest first in the current batch)
            messages.Reverse();

            return _mapper.Map<IEnumerable<MessageDto>>(messages);
        }

        public Task MarkAsReadAsync(Guid chatId, Guid messageId, Guid userId)
        {
            // TODO: Implement logic
            return Task.CompletedTask;
        }

        public Task PinMessageAsync(Guid chatId, Guid messageId, Guid userId)
        {
            // TODO: Implement logic
            return Task.CompletedTask;
        }

        public async Task<MessageDto> SendMessageAsync(Guid chatId, SendMessageRequest request, Guid userId)
        {
            var hasAccess = await _chatService.HasAccessToChatAsync(chatId, userId);
            if (!hasAccess)
            {
                throw new UnauthorizedAccessException("You do not have access to this chat.");
            }

            var chat = await _context.Chats.FindAsync(chatId);
            if (chat == null)
            {
                throw new KeyNotFoundException("Chat not found.");
            }

            if (request.ReplyToMessageId.HasValue)
            {
                var messageToReplyExists = await _context.Messages
                    .AnyAsync(m => m.Id == request.ReplyToMessageId.Value && m.ChatId == chatId);
                if (!messageToReplyExists)
                {
                    throw new KeyNotFoundException("The message you are trying to reply to does not exist in this chat.");
                }
            }

            var message = new Message
            {
                ChatId = chatId,
                AuthorId = userId,
                Content = request.Content,
                Type = request.Type,
                ReplyToMessageId = request.ReplyToMessageId,
                CreatedAt = DateTime.UtcNow
            };

            // Update chat's last activity timestamp
            chat.LastMessageAt = message.CreatedAt;
            _context.Chats.Update(chat);

            await _context.Messages.AddAsync(message);
            await _context.SaveChangesAsync();
            
            // To return a full MessageDto, we need author info, so we'll fetch the message again with includes.
            // This is a common pattern to ensure the DTO is complete.
            var createdMessage = await _context.Messages
                .Include(m => m.Author)
                .FirstAsync(m => m.Id == message.Id);

            return _mapper.Map<MessageDto>(createdMessage);
        }
    }
} 