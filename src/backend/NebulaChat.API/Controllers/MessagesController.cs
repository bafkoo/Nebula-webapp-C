using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using NebulaChat.API.DTOs.Chat;
using NebulaChat.API.Hubs;
using System.Security.Claims;
using NebulaChat.API.Services.Interfaces;

namespace NebulaChat.API.Controllers;

/// <summary>
/// Контроллер для управления сообщениями в чатах
/// </summary>
[ApiController]
[Route("api/messages")]
[Authorize]
public class MessagesController : ControllerBase
{
    private readonly ILogger<MessagesController> _logger;
    private readonly IHubContext<ChatHub> _hubContext;
    private readonly IMessageService _messageService;

    public MessagesController(ILogger<MessagesController> logger, IHubContext<ChatHub> hubContext, IMessageService messageService)
    {
        _logger = logger;
        _hubContext = hubContext;
        _messageService = messageService;
    }

    /// <summary>
    /// Получить сообщения чата с пагинацией
    /// </summary>
    /// <param name="chatId">ID чата</param>
    /// <param name="page">Номер страницы (начиная с 1)</param>
    /// <param name="pageSize">Размер страницы (максимум 100)</param>
    [HttpGet("~/api/chats/{chatId}/messages")]
    public async Task<IActionResult> GetMessages(Guid chatId, [FromQuery] int page = 1, [FromQuery] int pageSize = 50)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        _logger.LogInformation("Пользователь {UserId} запрашивает сообщения для чата {ChatId}", userId, chatId);

        // TODO: Проверить права пользователя на чат

        if (pageSize > 100) pageSize = 100;

        var messages = await _messageService.GetMessagesAsync(chatId, userId, page, pageSize);
        return Ok(messages);
    }

    /// <summary>
    /// Отправить сообщение в чат
    /// </summary>
    /// <param name="chatId">ID чата</param>
    /// <param name="request">Данные сообщения</param>
    [HttpPost("~/api/chats/{chatId}/messages")]
    public async Task<IActionResult> SendMessage(Guid chatId, [FromBody] SendMessageRequest request)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        _logger.LogInformation("Пользователь {UserId} отправляет сообщение в чат {ChatId}", userId, chatId);

        // TODO: Проверить права, создать сообщение, сохранить в БД

        var message = await _messageService.SendMessageAsync(chatId, request, userId);
        
        // Отправляем сообщение всем участникам чата через SignalR
        await _hubContext.Clients.Group(chatId.ToString()).SendAsync("ReceiveMessage", message);

        return Ok(message);
    }
    
    /// <summary>
    /// Редактировать сообщение
    /// </summary>
    /// <param name="messageId">ID сообщения</param>
    /// <param name="request">Новое содержимое</param>
    [HttpPut("{id}")]
    public async Task<IActionResult> EditMessage(Guid id, [FromBody] string newContent)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        _logger.LogInformation("Пользователь {UserId} редактирует сообщение {MessageId}", userId, id);

        // TODO: 1. Найти сообщение по messageId, чтобы получить chatId
        // TODO: 2. Проверить права на редактирование
        // TODO: 3. Обновить сообщение в БД

        var editedMessage = await _messageService.EditMessageAsync(id, newContent, userId);
        
        // 4. Отправить broadcast "MessageEdited" в группу чата
        // await _hubContext.Clients.Group(chatId.ToString()).SendAsync("MessageEdited", editedMessage);
        return Ok(editedMessage);
    }

    /// <summary>
    /// Удалить сообщение
    /// </summary>
    /// <param name="messageId">ID сообщения</param>
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteMessage(Guid id)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
         _logger.LogInformation("Пользователь {UserId} удаляет сообщение {MessageId}", userId, id);

        // TODO: 1. Найти сообщение по messageId, чтобы получить chatId
        // TODO: 2. Проверить права на удаление
        // TODO: 3. Пометить сообщение как удаленное в БД (soft delete)

        await _messageService.DeleteMessageAsync(id, userId);

        // 4. Отправить broadcast "MessageDeleted" в группу чата с ID сообщения
        // await _hubContext.Clients.Group(chatId.ToString()).SendAsync("MessageDeleted", id);
        return NoContent();
    }

    [HttpPost("{chatId}/messages/{messageId}/pin")]
    public async Task<IActionResult> PinMessage(Guid chatId, Guid messageId)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        await _messageService.PinMessageAsync(chatId, messageId, userId);
        
        // TODO: send notification
        return Ok();
    }
}

// DTO для запроса на редактирование
public class EditMessageRequest
{
    public string Content { get; set; } = string.Empty;
} 