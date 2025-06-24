using NebulaChat.API.DTOs.Chat;

namespace NebulaChat.API.Services.Interfaces
{
    public interface IMessageService
    {
        Task<IEnumerable<MessageDto>> GetMessagesAsync(Guid chatId, Guid userId, int page, int pageSize);
        Task<MessageDto> GetMessageAsync(Guid messageId, Guid userId);
        Task<MessageDto> SendMessageAsync(Guid chatId, SendMessageRequest request, Guid userId);
        Task<MessageDto> SendMessageAsync(SendMessageRequest request, Guid userId);
        Task<MessageDto> EditMessageAsync(Guid messageId, string newContent, Guid userId);
        Task DeleteMessageAsync(Guid messageId, Guid userId);
        Task PinMessageAsync(Guid chatId, Guid messageId, Guid userId);
        Task MarkAsReadAsync(Guid chatId, Guid messageId, Guid userId);
        
        // Search methods
        Task<SearchMessagesResponse> SearchMessagesAsync(SearchMessagesRequest request, Guid userId);
        Task<SearchMessagesResponse> SearchInChatAsync(Guid chatId, string query, Guid userId, int page = 1, int pageSize = 20);
    }
} 