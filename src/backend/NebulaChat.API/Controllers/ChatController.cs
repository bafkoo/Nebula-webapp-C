using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using NebulaChat.API.DTOs.Chat;
using NebulaChat.API.Hubs;
using NebulaChat.Domain.Entities.Enums;
using System.Security.Claims;
using NebulaChat.API.Services.Interfaces;
using AutoMapper;
using NebulaChat.Domain.Interfaces;
using System.Linq;

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
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public ChatController(
        ILogger<ChatController> logger, 
        IHubContext<ChatHub> hubContext,
        IChatService chatService,
        IUnitOfWork unitOfWork,
        IMapper mapper)
    {
        _logger = logger;
        _hubContext = hubContext;
        _chatService = chatService;
        _unitOfWork = unitOfWork;
        _mapper = mapper;
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
            return StatusCode(500, ex.ToString());
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
        var currentUserId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        await _chatService.UpdateParticipantRoleAsync(chatId, userId, request.Role, currentUserId);
        return NoContent();
    }

    [HttpPost("{chatId}/participants/{userId}/ban")]
    public async Task<IActionResult> BanParticipant(Guid chatId, Guid userId, [FromBody] BanUserRequest request)
    {
        var currentUserId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        await _chatService.BanUserAsync(chatId, userId, request.Reason, currentUserId);
        return NoContent();
    }

    [HttpDelete("{chatId}/participants/{userId}/ban")]
    public async Task<IActionResult> UnbanParticipant(Guid chatId, Guid userId)
    {
        var currentUserId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        await _chatService.UnbanUserAsync(chatId, userId, currentUserId);
        return NoContent();
    }

    /// <summary>
    /// Обновить настройки группового чата (только для админов/владельцев)
    /// </summary>
    [HttpPut("{chatId:guid}/settings")]
    public async Task<ActionResult<ChatDto>> UpdateGroupSettings(Guid chatId, [FromBody] UpdateGroupSettingsRequest request)
    {
        var currentUserId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var updated = await _chatService.UpdateGroupSettingsAsync(chatId, request, currentUserId);
        return Ok(updated);
    }

    /// <summary>
    /// Модерация сообщения в групповом чате
    /// </summary>
    [HttpPost("{chatId:guid}/moderate")]
    public async Task<IActionResult> ModerateMessage(Guid chatId, [FromBody] ModerateMessageRequest request)
    {
        var currentUserId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        await _chatService.ModerateMessageAsync(chatId, request, currentUserId);
        return NoContent();
    }

    /// <summary>
    /// Получить участников чата
    /// </summary>
    [HttpGet("{chatId}/participants")]
    public async Task<ActionResult<IEnumerable<ParticipantDto>>> GetParticipants(Guid chatId)
    {
        try
        {
            _logger.LogInformation("Getting participants for chat {ChatId}", chatId);
            var participants = await _chatService.GetParticipantsAsync(chatId);
            return Ok(participants);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting participants for chat {ChatId}", chatId);
            return StatusCode(500, "Internal server error");
        }
    }

    /// <summary>
    /// Получить историю административных действий в чате
    /// </summary>
    [HttpGet("{chatId}/admin-actions")]
    public async Task<ActionResult<IEnumerable<AdminActionLogDto>>> GetAdminActionLogs(Guid chatId)
    {
        try
        {
            _logger.LogInformation("Getting admin action logs for chat {ChatId}", chatId);
            var logs = await _unitOfWork.AdminActionLogRepository.GetLogsByChatAsync(chatId);
            var dtos = logs.Select(l => new AdminActionLogDto
            {
                Id = l.Id,
                AdminId = l.AdminId,
                AdminUsername = l.Admin.Username,
                ActionType = l.ActionType,
                TargetType = l.TargetType,
                TargetId = l.TargetId,
                Reason = l.Reason,
                Timestamp = l.Timestamp
            });
            return Ok(dtos);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting admin action logs for chat {ChatId}", chatId);
            // Возвращаем стек-трейс для отладки
            return StatusCode(500, ex.ToString());
        }
    }

    // --- Приглашения в групповой чат ---

    /// <summary>
    /// Создать приглашение в чат
    /// </summary>
    [HttpPost("{chatId:guid}/invites")]
    public async Task<ActionResult<ChatInviteDto>> CreateInvite(Guid chatId, [FromBody] CreateChatInviteRequest request)
    {
        var inviterId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var invite = new Domain.Entities.ChatInvite
        {
            ChatId = chatId,
            InviterId = inviterId,
            InviteeId = request.InviteeId,
            ExpiresAt = request.ExpiresAt
        };
        await _unitOfWork.ChatInviteRepository.AddAsync(invite);
        await _unitOfWork.SaveChangesAsync();
        var dto = _mapper.Map<ChatInviteDto>(invite);
        return CreatedAtAction(nameof(GetInvite), new { inviteId = invite.Id }, dto);
    }

    /// <summary>
    /// Получить приглашения для текущего пользователя
    /// </summary>
    [HttpGet("invites")]
    public async Task<ActionResult<IEnumerable<ChatInviteDto>>> GetUserInvites()
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var invites = await _unitOfWork.ChatInviteRepository.GetInvitesForUserAsync(userId);
        var dtos = invites.Select(i => _mapper.Map<ChatInviteDto>(i));
        return Ok(dtos);
    }

    /// <summary>
    /// Получить конкретное приглашение
    /// </summary>
    [HttpGet("invites/{inviteId:guid}")]
    public async Task<ActionResult<ChatInviteDto>> GetInvite(Guid inviteId)
    {
        var invite = await _unitOfWork.ChatInviteRepository.GetByIdAsync(inviteId);
        if (invite == null) return NotFound();
        return Ok(_mapper.Map<ChatInviteDto>(invite));
    }

    /// <summary>
    /// Удалить приглашение
    /// </summary>
    [HttpDelete("invites/{inviteId:guid}")]
    public async Task<IActionResult> RemoveInvite(Guid inviteId)
    {
        var invite = await _unitOfWork.ChatInviteRepository.GetByIdAsync(inviteId);
        if (invite == null) return NotFound();
        _unitOfWork.ChatInviteRepository.Remove(invite);
        await _unitOfWork.SaveChangesAsync();
        return NoContent();
    }
} 