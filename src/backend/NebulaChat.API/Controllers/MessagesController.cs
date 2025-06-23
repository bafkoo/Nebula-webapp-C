using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using NebulaChat.API.DTOs.Chat;
using NebulaChat.API.Hubs;
using System.Security.Claims;

namespace NebulaChat.API.Controllers;

/// <summary>
/// Контроллер для управления сообщениями в чатах
/// </summary>
[ApiController]
[Route("api/")]
[Authorize]
public class MessagesController : ControllerBase
{
    private readonly ILogger<MessagesController> _logger;
    private readonly IHubContext<ChatHub> _hubContext;
    // TODO: Добавить IMessageService и IChatService

    public MessagesController(ILogger<MessagesController> logger, IHubContext<ChatHub> hubContext)
    {
        _logger = logger;
        _hubContext = hubContext;
    }

    /// <summary>
    /// Получить сообщения чата с пагинацией
    /// </summary>
    /// <param name="chatId">ID чата</param>
    /// <param name="page">Номер страницы (начиная с 1)</param>
    /// <param name="pageSize">Размер страницы (максимум 100)</param>
    [HttpGet("chats/{chatId}/messages")]
    public async Task<IActionResult> GetChatMessages(Guid chatId, [FromQuery] int page = 1, [FromQuery] int pageSize = 50)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        _logger.LogInformation("Пользователь {UserId} запрашивает сообщения для чата {ChatId}", userId, chatId);

        // TODO: Проверить права пользователя на чат

        if (pageSize > 100) pageSize = 100;

        // Временная заглушка
        var messages = new List<MessageDto>
        {
            new MessageDto { Id = Guid.NewGuid(), ChatId = chatId, Content = "Всем привет! 👋", CreatedAt = DateTime.UtcNow.AddMinutes(-2), AuthorUsername = "Admin" },
            new MessageDto { Id = Guid.NewGuid(), ChatId = chatId, Content = "Добро пожаловать в Nebula Chat!", CreatedAt = DateTime.UtcNow.AddMinutes(-1), AuthorUsername = "System" }
        };

        return Ok(messages);
    }

    /// <summary>
    /// Отправить сообщение в чат
    /// </summary>
    /// <param name="chatId">ID чата</param>
    /// <param name="request">Данные сообщения</param>
    [HttpPost("chats/{chatId}/messages")]
    public async Task<IActionResult> SendMessage(Guid chatId, [FromBody] SendMessageRequest request)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        _logger.LogInformation("Пользователь {UserId} отправляет сообщение в чат {ChatId}", userId, chatId);

        // TODO: Проверить права, создать сообщение, сохранить в БД

        var message = new MessageDto
        {
            Id = Guid.NewGuid(),
            ChatId = chatId,
            Content = request.Content,
            AuthorId = Guid.Parse(userId!),
            AuthorUsername = User.Identity?.Name,
            CreatedAt = DateTime.UtcNow
        };
        
        // Отправляем сообщение всем участникам чата через SignalR
        await _hubContext.Clients.Group(chatId.ToString()).SendAsync("ReceiveMessage", message);

        return CreatedAtAction(nameof(GetChatMessages), new { chatId = chatId }, message);
    }
    
    /// <summary>
    /// Редактировать сообщение
    /// </summary>
    /// <param name="messageId">ID сообщения</param>
    /// <param name="request">Новое содержимое</param>
    [HttpPut("messages/{messageId}")]
    public async Task<IActionResult> EditMessage(Guid messageId, [FromBody] EditMessageRequest request)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        _logger.LogInformation("Пользователь {UserId} редактирует сообщение {MessageId}", userId, messageId);

        // TODO: 1. Найти сообщение по messageId, чтобы получить chatId
        // TODO: 2. Проверить права на редактирование
        // TODO: 3. Обновить сообщение в БД

        // Временная заглушка для демонстрации
        var placeholderChatId = Guid.Parse("00000000-0000-0000-0000-000000000001");
        
        var editedMessage = new MessageDto
        {
            Id = messageId,
            ChatId = placeholderChatId,
            Content = request.Content,
            IsEdited = true,
            EditedAt = DateTime.UtcNow,
            AuthorId = Guid.Parse(userId!),
            AuthorUsername = User.Identity?.Name,
            CreatedAt = DateTime.UtcNow.AddMinutes(-10) // Placeholder
        };

        // 4. Отправить broadcast "MessageEdited" в группу чата
        await _hubContext.Clients.Group(placeholderChatId.ToString()).SendAsync("MessageEdited", editedMessage);

        return NoContent();
    }

    /// <summary>
    /// Удалить сообщение
    /// </summary>
    /// <param name="messageId">ID сообщения</param>
    [HttpDelete("messages/{messageId}")]
    public async Task<IActionResult> DeleteMessage(Guid messageId)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
         _logger.LogInformation("Пользователь {UserId} удаляет сообщение {MessageId}", userId, messageId);

        // TODO: 1. Найти сообщение по messageId, чтобы получить chatId
        // TODO: 2. Проверить права на удаление
        // TODO: 3. Пометить сообщение как удаленное в БД (soft delete)

        // Временная заглушка для демонстрации
        var placeholderChatId = Guid.Parse("00000000-0000-0000-0000-000000000001");

        // 4. Отправить broadcast "MessageDeleted" в группу чата с ID сообщения
        await _hubContext.Clients.Group(placeholderChatId.ToString()).SendAsync("MessageDeleted", new { MessageId = messageId, ChatId = placeholderChatId });

        return NoContent();
    }

    [HttpPost("{chatId}/messages/{messageId}/pin")]
    public async Task<IActionResult> PinMessage(Guid chatId, Guid messageId)
    {
        // TODO: Проверить права (админ/модератор)
        // TODO: Реализовать логику закрепления
        // TODO: Отправить SignalR уведомление
        return await Task.FromResult(Ok());
    }
}

// DTO для запроса на редактирование
public class EditMessageRequest
{
    public string Content { get; set; } = string.Empty;
} 