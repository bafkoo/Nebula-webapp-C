using AutoMapper;
using Microsoft.EntityFrameworkCore;
using NebulaChat.API.DTOs.Chat;
using NebulaChat.API.Services.Interfaces;
using NebulaChat.Domain.Entities;
using NebulaChat.Infrastructure.Data;
using System.Text.RegularExpressions;

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
                FileUrl = request.FileUrl,
                FileName = request.FileName,
                FileSize = request.FileSize,
                MimeType = request.MimeType,
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

        public async Task<MessageDto> SendMessageAsync(SendMessageRequest request, Guid userId)
        {
            return await SendMessageAsync(request.ChatId, request, userId);
        }

        public async Task<SearchMessagesResponse> SearchMessagesAsync(SearchMessagesRequest request, Guid userId)
        {
            // Базовый запрос для сообщений с доступом пользователя
            var query = _context.Messages
                .Include(m => m.Author)
                .Include(m => m.Chat)
                .Where(m => m.Chat.Participants.Any(p => p.UserId == userId));

            // Поиск по тексту (регистронезависимый)
            if (!string.IsNullOrWhiteSpace(request.Query))
            {
                query = query.Where(m => m.Content.Contains(request.Query));
            }

            // Фильтр по чату
            if (request.ChatId.HasValue)
            {
                query = query.Where(m => m.ChatId == request.ChatId.Value);
            }

            // Фильтр по автору
            if (request.AuthorId.HasValue)
            {
                query = query.Where(m => m.AuthorId == request.AuthorId.Value);
            }

            // Фильтр по типу сообщения
            if (request.MessageType.HasValue)
            {
                query = query.Where(m => m.Type == request.MessageType.Value);
            }

            // Фильтр по дате начала
            if (request.StartDate.HasValue)
            {
                query = query.Where(m => m.CreatedAt >= request.StartDate.Value);
            }

            // Фильтр по дате окончания
            if (request.EndDate.HasValue)
            {
                query = query.Where(m => m.CreatedAt <= request.EndDate.Value);
            }

            // Подсчет общего количества
            var totalCount = await query.CountAsync();

            // Пагинация и сортировка
            var messages = await query
                .OrderByDescending(m => m.CreatedAt)
                .Skip((request.Page - 1) * request.PageSize)
                .Take(request.PageSize)
                .ToListAsync();

            // Конвертация в SearchMessageResultDto с подсветкой
            var searchResults = messages.Select(m => new SearchMessageResultDto
            {
                Id = m.Id.ToString(),
                TempId = null,
                ChatId = m.ChatId.ToString(),
                UserId = m.AuthorId.ToString(),
                UserName = m.Author.Username,
                AvatarUrl = m.Author.AvatarUrl,
                Content = m.Content,
                Type = m.Type,
                FileUrl = m.FileUrl,
                FileName = m.FileName,
                FileSize = m.FileSize,
                MimeType = m.MimeType,
                CreatedAt = m.CreatedAt,
                UpdatedAt = m.UpdatedAt,
                ChatName = m.Chat.Name,
                HighlightedContent = HighlightText(m.Content, request.Query)
            });

            var totalPages = (int)Math.Ceiling((double)totalCount / request.PageSize);

            return new SearchMessagesResponse
            {
                Messages = searchResults,
                TotalCount = totalCount,
                Page = request.Page,
                PageSize = request.PageSize,
                TotalPages = totalPages
            };
        }

        public async Task<SearchMessagesResponse> SearchInChatAsync(Guid chatId, string query, Guid userId, int page = 1, int pageSize = 20)
        {
            var request = new SearchMessagesRequest
            {
                Query = query,
                ChatId = chatId,
                Page = page,
                PageSize = pageSize
            };

            return await SearchMessagesAsync(request, userId);
        }

        private IEnumerable<HighlightFragment> HighlightText(string content, string searchQuery)
        {
            if (string.IsNullOrWhiteSpace(searchQuery) || string.IsNullOrWhiteSpace(content))
            {
                return new[] { new HighlightFragment { Text = content, IsHighlighted = false } };
            }

            var fragments = new List<HighlightFragment>();
            var regex = new Regex(Regex.Escape(searchQuery), RegexOptions.IgnoreCase);
            var matches = regex.Matches(content);

            if (matches.Count == 0)
            {
                return new[] { new HighlightFragment { Text = content, IsHighlighted = false } };
            }

            var lastIndex = 0;
            
            foreach (Match match in matches)
            {
                // Добавляем текст до найденного фрагмента
                if (match.Index > lastIndex)
                {
                    fragments.Add(new HighlightFragment 
                    { 
                        Text = content.Substring(lastIndex, match.Index - lastIndex), 
                        IsHighlighted = false 
                    });
                }

                // Добавляем найденный фрагмент (подсвеченный)
                fragments.Add(new HighlightFragment 
                { 
                    Text = match.Value, 
                    IsHighlighted = true 
                });

                lastIndex = match.Index + match.Length;
            }

            // Добавляем оставшийся текст после последнего найденного фрагмента
            if (lastIndex < content.Length)
            {
                fragments.Add(new HighlightFragment 
                { 
                    Text = content.Substring(lastIndex), 
                    IsHighlighted = false 
                });
            }

            return fragments;
        }
    }
} 