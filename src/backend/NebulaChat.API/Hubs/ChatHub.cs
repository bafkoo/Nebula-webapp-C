using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;

namespace NebulaChat.API.Hubs;

/// <summary>
/// SignalR Hub для real-time чата
/// </summary>
[Authorize]
public class ChatHub : Hub
{
    private readonly ILogger<ChatHub> _logger;
    private readonly IConnectionMapping _connectionMapping;

    public ChatHub(ILogger<ChatHub> logger, IConnectionMapping connectionMapping)
    {
        _logger = logger;
        _connectionMapping = connectionMapping;
    }

    /// <summary>
    /// Присоединение к чату
    /// </summary>
    /// <param name="chatId">ID чата</param>
    public async Task JoinChat(string chatId)
    {
        try
        {
            var userId = GetUserId();
            
            // TODO: Проверить права пользователя на доступ к чату
            
            await Groups.AddToGroupAsync(Context.ConnectionId, $"Chat_{chatId}");
            
            _logger.LogInformation("User {UserId} joined chat {ChatId}", userId, chatId);
            
            // Уведомить других участников о присоединении
            await Clients.Group($"Chat_{chatId}")
                .SendAsync("UserJoined", new { UserId = userId, ChatId = chatId });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error joining chat {ChatId}", chatId);
            await Clients.Caller.SendAsync("Error", "Failed to join chat");
        }
    }

    /// <summary>
    /// Покидание чата
    /// </summary>
    /// <param name="chatId">ID чата</param>
    public async Task LeaveChat(string chatId)
    {
        try
        {
            var userId = GetUserId();
            
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"Chat_{chatId}");
            
            _logger.LogInformation("User {UserId} left chat {ChatId}", userId, chatId);
            
            // Уведомить других участников о выходе
            await Clients.Group($"Chat_{chatId}")
                .SendAsync("UserLeft", new { UserId = userId, ChatId = chatId });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error leaving chat {ChatId}", chatId);
        }
    }

    /// <summary>
    /// Отправка сообщения через SignalR (для мгновенного отображения)
    /// </summary>
    /// <param name="chatId">ID чата</param>
    /// <param name="content">Содержимое сообщения</param>
    public async Task SendMessage(string chatId, string content)
    {
        try
        {
            var userId = GetUserId();
            
            // TODO: Валидация сообщения и прав доступа
            // TODO: Сохранение в базу данных через сервис
            
            // Отправить сообщение всем участникам чата
            await Clients.Group($"Chat_{chatId}")
                .SendAsync("ReceiveMessage", new 
                { 
                    Id = Guid.NewGuid(),
                    ChatId = chatId,
                    AuthorId = userId,
                    Content = content,
                    CreatedAt = DateTime.UtcNow,
                    Type = "Text"
                });
                
            _logger.LogInformation("Message sent in chat {ChatId} by user {UserId}", chatId, userId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error sending message to chat {ChatId}", chatId);
            await Clients.Caller.SendAsync("Error", "Failed to send message");
        }
    }

    /// <summary>
    /// Индикатор печати
    /// </summary>
    /// <param name="chatId">ID чата</param>
    /// <param name="isTyping">Печатает ли пользователь</param>
    public async Task SetTyping(string chatId, bool isTyping)
    {
        try
        {
            var userId = GetUserId();
            
            // Отправить индикатор печати только другим участникам
            await Clients.GroupExcept($"Chat_{chatId}", Context.ConnectionId)
                .SendAsync("UserTyping", new 
                { 
                    UserId = userId, 
                    ChatId = chatId, 
                    IsTyping = isTyping,
                    Timestamp = DateTime.UtcNow
                });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error setting typing indicator for chat {ChatId}", chatId);
        }
    }

    /// <summary>
    /// Отметка сообщения как прочитанного
    /// </summary>
    /// <param name="chatId">ID чата</param>
    /// <param name="messageId">ID сообщения</param>
    public async Task MarkAsRead(string chatId, string messageId)
    {
        try
        {
            var userId = GetUserId();
            
            // TODO: Обновить LastReadMessageId в базе данных
            
            // Уведомить других участников о прочтении
            await Clients.GroupExcept($"Chat_{chatId}", Context.ConnectionId)
                .SendAsync("MessageRead", new 
                { 
                    UserId = userId, 
                    ChatId = chatId, 
                    MessageId = messageId,
                    ReadAt = DateTime.UtcNow
                });
                
            _logger.LogInformation("Message {MessageId} marked as read by user {UserId}", messageId, userId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error marking message as read {MessageId}", messageId);
        }
    }

    /// <summary>
    /// Подключение пользователя
    /// </summary>
    public override async Task OnConnectedAsync()
    {
        try
        {
            var userId = GetUserId();
            
            // Добавить соединение в маппинг
            _connectionMapping.Add(userId, Context.ConnectionId);
            
            // Уведомить друзей о том, что пользователь онлайн
            await Clients.All.SendAsync("UserOnline", new 
            { 
                UserId = userId, 
                ConnectedAt = DateTime.UtcNow 
            });
            
            _logger.LogInformation("User {UserId} connected with connection {ConnectionId}", userId, Context.ConnectionId);
            
            await base.OnConnectedAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error on user connection");
        }
    }

    /// <summary>
    /// Отключение пользователя
    /// </summary>
    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        try
        {
            var userId = GetUserId();
            
            // Удалить соединение из маппинга
            _connectionMapping.Remove(userId, Context.ConnectionId);
            
            // Если у пользователя нет других активных соединений
            if (!_connectionMapping.HasConnections(userId))
            {
                // Уведомить друзей о том, что пользователь оффлайн
                await Clients.All.SendAsync("UserOffline", new 
                { 
                    UserId = userId, 
                    DisconnectedAt = DateTime.UtcNow 
                });
            }
            
            _logger.LogInformation("User {UserId} disconnected from connection {ConnectionId}", userId, Context.ConnectionId);
            
            await base.OnDisconnectedAsync(exception);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error on user disconnection");
        }
    }

    /// <summary>
    /// Получить ID текущего пользователя из токена
    /// </summary>
    private string GetUserId()
    {
        var userId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
        {
            throw new UnauthorizedAccessException("User ID not found in token");
        }
        return userId;
    }
} 