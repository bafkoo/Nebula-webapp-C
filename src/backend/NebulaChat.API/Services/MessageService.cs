using AutoMapper;
using NebulaChat.API.DTOs.Chat;
using NebulaChat.API.Services.Interfaces;
using NebulaChat.Infrastructure.Data;

namespace NebulaChat.API.Services
{
    public class MessageService : IMessageService
    {
        private readonly NebulaChatDbContext _context;
        private readonly IMapper _mapper;

        public MessageService(NebulaChatDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public Task DeleteMessageAsync(Guid messageId, Guid userId)
        {
            // TODO: Implement logic
            return Task.CompletedTask;
        }

        public Task<MessageDto> EditMessageAsync(Guid messageId, string newContent, Guid userId)
        {
            // TODO: Implement logic
            throw new NotImplementedException();
        }

        public Task<MessageDto> GetMessageAsync(Guid messageId, Guid userId)
        {
            // TODO: Implement logic
            throw new NotImplementedException();
        }

        public Task<IEnumerable<MessageDto>> GetMessagesAsync(Guid chatId, Guid userId, int page, int pageSize)
        {
            // TODO: Implement logic
            throw new NotImplementedException();
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

        public Task<MessageDto> SendMessageAsync(Guid chatId, SendMessageRequest request, Guid userId)
        {
            // TODO: Implement logic
            throw new NotImplementedException();
        }
    }
} 