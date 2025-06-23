using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using NebulaChat.API.DTOs.Chat;
using NebulaChat.API.Hubs;
using NebulaChat.Domain.Entities.Enums;
using System.Security.Claims;
using NebulaChat.API.Services.Interfaces;

namespace NebulaChat.API.Controllers;

/// <summary>
/// Контроллер для управления чатами
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ChatController : ControllerBase
{
    private readonly ILogger<ChatController> _logger;
    private readonly IHubContext<ChatHub> _hubContext;
    private readonly IChatService _chatService;

    public ChatController(
        ILogger<ChatController> logger, 
        IHubContext<ChatHub> hubContext,
        IChatService chatService)
    {
        _logger = logger;
        _hubContext = hubContext;
        _chatService = chatService;
    }

    /// <summary>
    /// Получить список чатов пользователя
    /// </summary>
    /// <param name="page">Номер страницы (начиная с 1)</param>
    /// <param name="pageSize">Количество чатов на странице (максимум 50)</param>
    /// <returns>Список чатов с пагинацией</returns>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<ChatDto>>> GetUserChats(
        [FromQuery] int page = 1, 
        [FromQuery] int pageSize = 20)
    {
        try
        {
            var userId = GetUserId();
            
            // Валидация параметров пагинации
            if (page < 1) page = 1;
            if (pageSize < 1 || pageSize > 50) pageSize = 20;
            
            _logger.LogInformation("Getting chats for user {UserId}, page {Page}, pageSize {PageSize}", 
                userId, page, pageSize);
            
            var chats = await _chatService.GetUserChatsAsync(Guid.Parse(userId), null, page, pageSize);
            
            return Ok(chats);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting user chats");
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Получить детали конкретного чата
    /// </summary>
    /// <param name="id">ID чата</param>
    /// <returns>Детали чата</returns>
    [HttpGet("{id:guid}")]
    public async Task<ActionResult<ChatDto>> GetChat(Guid id)
    {
        try
        {
            var userId = GetUserId();
            
            _logger.LogInformation("Getting chat {ChatId} for user {UserId}", id, userId);

            var chat = await _chatService.GetChatAsync(id, Guid.Parse(userId));

            if (chat == null)
            {
                return NotFound("Chat not found or you don't have access.");
            }
            
            return Ok(chat);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting chat {ChatId}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Создать новый чат
    /// </summary>
    /// <param name="request">Данные для создания чата</param>
    /// <returns>Созданный чат</returns>
    [HttpPost]
    public async Task<ActionResult<ChatDto>> CreateChat([FromBody] CreateChatRequest request)
    {
        try
        {
            var userId = GetUserId();
            
            _logger.LogInformation("Creating chat {ChatName} by user {UserId}", request.Name, userId);
            
            var chat = await _chatService.CreateChatAsync(request, Guid.Parse(userId));
            
            return CreatedAtAction(nameof(GetChat), new { id = chat.Id }, chat);
        }
        catch (ArgumentException ex)
        {
            _logger.LogWarning(ex, "Invalid chat creation request");
            return BadRequest(ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating chat");
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Обновить чат (только для владельца или администратора)
    /// </summary>
    /// <param name="id">ID чата</param>
    /// <param name="request">Данные для обновления</param>
    /// <returns>Обновленный чат</returns>
    [HttpPut("{id:guid}")]
    public async Task<ActionResult<ChatDto>> UpdateChat(Guid id, [FromBody] CreateChatRequest request)
    {
        try
        {
            var userId = GetUserId();
            
            _logger.LogInformation("Updating chat {ChatId} by user {UserId}", id, userId);

            var chat = await _chatService.UpdateChatAsync(id, request.Name, request.Description, null, Guid.Parse(userId));

            if (chat == null)
            {
                return NotFound("Chat not found.");
            }
            
            return Ok(chat);
        }
        catch (UnauthorizedAccessException ex)
        {
            _logger.LogWarning(ex, "Unauthorized chat update attempt");
            return Forbid();
        }
        catch (ArgumentException ex)
        {
            _logger.LogWarning(ex, "Invalid chat update request");
            return BadRequest(ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating chat {ChatId}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Удалить чат (только для владельца)
    /// </summary>
    /// <param name="id">ID чата</param>
    /// <returns>Результат операции</returns>
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteChat(Guid id)
    {
        try
        {
            var userId = GetUserId();
            
            _logger.LogInformation("Deleting chat {ChatId} by user {UserId}", id, userId);
            
            await _chatService.DeleteChatAsync(id, Guid.Parse(userId));
            
            return NoContent();
        }
        catch (UnauthorizedAccessException ex)
        {
            _logger.LogWarning(ex, "Unauthorized chat deletion attempt");
            return Forbid();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting chat {ChatId}", id);
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Поиск чатов по названию
    /// </summary>
    /// <param name="query">Поисковый запрос</param>
    /// <param name="page">Номер страницы</param>
    /// <param name="pageSize">Размер страницы</param>
    /// <returns>Найденные чаты</returns>
    [HttpGet("search")]
    public async Task<ActionResult<IEnumerable<ChatDto>>> SearchChats(
        [FromQuery] string query,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(query))
                return BadRequest("Search query cannot be empty");

            var userId = GetUserId();
            
            // Валидация параметров
            if (page < 1) page = 1;
            if (pageSize < 1 || pageSize > 50) pageSize = 20;
            
            _logger.LogInformation("Searching chats with query '{Query}' for user {UserId}", query, userId);
            
            // TODO: Реализовать через IChatService
            // var chats = await _chatService.SearchChatsAsync(query, userId, page, pageSize);
            
            // Временная заглушка
            var chats = new List<ChatDto>();
            
            return Ok(chats);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error searching chats with query '{Query}'", query);
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Получить ID текущего пользователя из JWT токена
    /// </summary>
    private string GetUserId()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
        {
            throw new UnauthorizedAccessException("User ID not found in token");
        }
        return userId;
    }

    // --- Управление участниками ---

    [HttpPost("{chatId}/participants")]
    public async Task<IActionResult> AddParticipant(Guid chatId, [FromBody] AddParticipantRequest request)
    {
        try
        {
            var currentUserId = Guid.Parse(GetUserId());
            await _chatService.AddParticipantAsync(chatId, request.UserId, currentUserId);
            return Ok();
        }
        catch (Exception ex)
        {
            // TODO: Add specific exceptions
            return BadRequest(ex.Message);
        }
    }

    [HttpDelete("{chatId}/participants/{userId}")]
    public async Task<IActionResult> RemoveParticipant(Guid chatId, Guid userId)
    {
        try
        {
            var currentUserId = Guid.Parse(GetUserId());
            await _chatService.RemoveParticipantAsync(chatId, userId, currentUserId);
            return NoContent();
        }
        catch (Exception ex)
        {
            // TODO: Add specific exceptions
            return BadRequest(ex.Message);
        }
    }

    [HttpPut("{chatId}/participants/{userId}/role")]
    public async Task<IActionResult> UpdateParticipantRole(Guid chatId, Guid userId, [FromBody] UpdateParticipantRoleRequest request)
    {
        try
        {
            var currentUserId = Guid.Parse(GetUserId());
            await _chatService.UpdateParticipantRoleAsync(chatId, userId, request.Role, currentUserId);
            return Ok();
        }
        catch (Exception ex)
        {
            // TODO: Add specific exceptions
            return BadRequest(ex.Message);
        }
    }
} 