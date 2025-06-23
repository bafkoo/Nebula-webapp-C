using NebulaChat.API.DTOs.Chat;

namespace NebulaChat.API.Services.Interfaces
{
    public interface IMessageService
    {
        Task<IEnumerable<MessageDto>> GetMessagesAsync(Guid chatId, Guid userId, int page, int pageSize);
        Task<MessageDto> GetMessageAsync(Guid messageId, Guid userId);
        Task<MessageDto> SendMessageAsync(Guid chatId, SendMessageRequest request, Guid userId);
        Task<MessageDto> EditMessageAsync(Guid messageId, string newContent, Guid userId);
        Task DeleteMessageAsync(Guid messageId, Guid userId);
        Task PinMessageAsync(Guid chatId, Guid messageId, Guid userId);
        Task MarkAsReadAsync(Guid chatId, Guid messageId, Guid userId);
    }
} 