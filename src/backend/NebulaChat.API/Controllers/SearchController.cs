using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NebulaChat.API.DTOs.Chat;
using NebulaChat.API.Services.Interfaces;
using System.Security.Claims;

namespace NebulaChat.API.Controllers;

/// <summary>
/// Контроллер для поиска сообщений
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Authorize]
public class SearchController : ControllerBase
{
    private readonly IMessageService _messageService;
    private readonly ILogger<SearchController> _logger;

    public SearchController(IMessageService messageService, ILogger<SearchController> logger)
    {
        _messageService = messageService;
        _logger = logger;
    }

    /// <summary>
    /// Глобальный поиск по всем сообщениям пользователя
    /// </summary>
    /// <param name="request">Параметры поиска</param>
    /// <returns>Результаты поиска</returns>
    [HttpPost("messages")]
    public async Task<ActionResult<SearchMessagesResponse>> SearchMessages([FromBody] SearchMessagesRequest request)
    {
        try
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!Guid.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized("Invalid user ID");
            }

            var results = await _messageService.SearchMessagesAsync(request, userId);
            return Ok(results);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error searching messages for user {UserId} with query {Query}", 
                User.FindFirst(ClaimTypes.NameIdentifier)?.Value, request.Query);
            return StatusCode(500, "Internal server error occurred while searching messages");
        }
    }

    /// <summary>
    /// Поиск сообщений внутри конкретного чата
    /// </summary>
    /// <param name="chatId">ID чата</param>
    /// <param name="query">Поисковый запрос</param>
    /// <param name="page">Номер страницы</param>
    /// <param name="pageSize">Размер страницы</param>
    /// <returns>Результаты поиска в чате</returns>
    [HttpGet("chats/{chatId}/messages")]
    public async Task<ActionResult<SearchMessagesResponse>> SearchInChat(
        Guid chatId, 
        [FromQuery] string query,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(query))
            {
                return BadRequest("Search query cannot be empty");
            }

            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!Guid.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized("Invalid user ID");
            }

            var results = await _messageService.SearchInChatAsync(chatId, query, userId, page, pageSize);
            return Ok(results);
        }
        catch (UnauthorizedAccessException)
        {
            return Forbid("You do not have access to this chat");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error searching in chat {ChatId} for user {UserId} with query {Query}", 
                chatId, User.FindFirst(ClaimTypes.NameIdentifier)?.Value, query);
            return StatusCode(500, "Internal server error occurred while searching in chat");
        }
    }

    /// <summary>
    /// Быстрый поиск сообщений (упрощенная версия для автокомплита)
    /// </summary>
    /// <param name="q">Поисковый запрос</param>
    /// <param name="chatId">ID чата (опционально)</param>
    /// <param name="limit">Максимальное количество результатов</param>
    /// <returns>Упрощенные результаты поиска</returns>
    [HttpGet("quick")]
    public async Task<ActionResult<IEnumerable<SearchMessageResultDto>>> QuickSearch(
        [FromQuery] string q,
        [FromQuery] Guid? chatId = null,
        [FromQuery] int limit = 5)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(q) || q.Length < 2)
            {
                return Ok(new List<SearchMessageResultDto>());
            }

            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!Guid.TryParse(userIdClaim, out var userId))
            {
                return Unauthorized("Invalid user ID");
            }

            var request = new SearchMessagesRequest
            {
                Query = q,
                ChatId = chatId,
                PageSize = limit,
                Page = 1
            };

            var results = await _messageService.SearchMessagesAsync(request, userId);
            return Ok(results.Messages);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in quick search for user {UserId} with query {Query}", 
                User.FindFirst(ClaimTypes.NameIdentifier)?.Value, q);
            return StatusCode(500, "Internal server error occurred during quick search");
        }
    }
} 