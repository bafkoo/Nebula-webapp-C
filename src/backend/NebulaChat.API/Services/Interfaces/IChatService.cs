using NebulaChat.API.DTOs.Chat;
using NebulaChat.Domain.Entities.Enums;

namespace NebulaChat.API.Services.Interfaces;

/// <summary>
/// Сервис для управления чатами
/// </summary>
public interface IChatService
{
    /// <summary>
    /// Создание нового чата
    /// </summary>
    /// <param name="request">Данные для создания чата</param>
    /// <param name="currentUserId">ID текущего пользователя</param>
    /// <returns>Созданный чат</returns>
    Task<ChatDto> CreateChatAsync(CreateChatRequest request, Guid currentUserId);
    
    /// <summary>
    /// Получение списка чатов пользователя
    /// </summary>
    /// <param name="userId">ID пользователя</param>
    /// <param name="chatType">Фильтр по типу чата (опционально)</param>
    /// <param name="page">Номер страницы</param>
    /// <param name="pageSize">Размер страницы</param>
    /// <returns>Список чатов</returns>
    Task<List<ChatDto>> GetUserChatsAsync(Guid userId, ChatType? chatType = null, int page = 1, int pageSize = 50);
    
    /// <summary>
    /// Получение списка ID чатов пользователя (для SignalR групп)
    /// </summary>
    /// <param name="userId">ID пользователя</param>
    /// <returns>Список ID чатов</returns>
    Task<List<Guid>> GetUserChatIdsAsync(Guid userId);
    
    /// <summary>
    /// Получение деталей чата
    /// </summary>
    /// <param name="chatId">ID чата</param>
    /// <param name="currentUserId">ID текущего пользователя</param>
    /// <returns>Детали чата</returns>
    Task<ChatDto?> GetChatAsync(Guid chatId, Guid currentUserId);
    
    /// <summary>
    /// Обновление чата
    /// </summary>
    /// <param name="chatId">ID чата</param>
    /// <param name="name">Новое название</param>
    /// <param name="description">Новое описание</param>
    /// <param name="avatarUrl">Новый аватар</param>
    /// <param name="currentUserId">ID текущего пользователя</param>
    /// <returns>Обновленный чат</returns>
    Task<ChatDto?> UpdateChatAsync(Guid chatId, string? name, string? description, string? avatarUrl, Guid currentUserId);
    
    /// <summary>
    /// Удаление чата
    /// </summary>
    /// <param name="chatId">ID чата</param>
    /// <param name="currentUserId">ID текущего пользователя</param>
    /// <returns>Успешность операции</returns>
    Task<bool> DeleteChatAsync(Guid chatId, Guid currentUserId);
    
    /// <summary>
    /// Архивирование/разархивирование чата
    /// </summary>
    /// <param name="chatId">ID чата</param>
    /// <param name="isArchived">Статус архивации</param>
    /// <param name="currentUserId">ID текущего пользователя</param>
    /// <returns>Успешность операции</returns>
    Task<bool> ArchiveChatAsync(Guid chatId, bool isArchived, Guid currentUserId);
    
    /// <summary>
    /// Проверка доступа пользователя к чату
    /// </summary>
    /// <param name="chatId">ID чата</param>
    /// <param name="userId">ID пользователя</param>
    /// <returns>Есть ли доступ</returns>
    Task<bool> HasAccessToChatAsync(Guid chatId, Guid userId);
    
    /// <summary>
    /// Поиск чатов
    /// </summary>
    /// <param name="query">Поисковый запрос</param>
    /// <param name="userId">ID пользователя</param>
    /// <param name="chatType">Фильтр по типу чата</param>
    /// <returns>Найденные чаты</returns>
    Task<List<ChatDto>> SearchChatsAsync(string query, Guid userId, ChatType? chatType = null);
    
    // --- Participant Management ---
    
    /// <summary>
    /// Добавить участника в чат
    /// </summary>
    /// <param name="chatId">ID чата</param>
    /// <param name="userIdToAdd">ID добавляемого пользователя</param>
    /// <param name="currentUserId">ID пользователя, который выполняет действие</param>
    Task AddParticipantAsync(Guid chatId, Guid userIdToAdd, Guid currentUserId);

    /// <summary>
    /// Удалить участника из чата
    /// </summary>
    /// <param name="chatId">ID чата</param>
    /// <param name="userIdToRemove">ID удаляемого пользователя</param>
    /// <param name="currentUserId">ID пользователя, который выполняет действие</param>
    Task RemoveParticipantAsync(Guid chatId, Guid userIdToRemove, Guid currentUserId);
    
    /// <summary>
    /// Обновить роль участника
    /// </summary>
    /// <param name="chatId">ID чата</param>
    /// <param name="userIdToUpdate">ID пользователя, чья роль обновляется</param>
    /// <param name="newRole">Новая роль</param>
    /// <param name="currentUserId">ID пользователя, который выполняет действие</param>
    Task UpdateParticipantRoleAsync(Guid chatId, Guid userIdToUpdate, ParticipantRole newRole, Guid currentUserId);

    /// <summary>
    /// Забанить пользователя в чате
    /// </summary>
    /// <param name="chatId">ID чата</param>
    /// <param name="userIdToBan">ID забаненного пользователя</param>
    /// <param name="reason">Причина бана</param>
    /// <param name="currentUserId">ID текущего пользователя</param>
    Task BanUserAsync(Guid chatId, Guid userIdToBan, string? reason, Guid currentUserId);

    /// <summary>
    /// Разбанить пользователя в чате
    /// </summary>
    /// <param name="chatId">ID чата</param>
    /// <param name="userIdToUnban">ID разбаненного пользователя</param>
    /// <param name="currentUserId">ID текущего пользователя</param>
    Task UnbanUserAsync(Guid chatId, Guid userIdToUnban, Guid currentUserId);

    /// <summary>
    /// Обновление настроек группового чата (только для админов/владельцев)
    /// </summary>
    Task<ChatDto> UpdateGroupSettingsAsync(Guid chatId, UpdateGroupSettingsRequest request, Guid currentUserId);

    /// <summary>
    /// Модерация сообщения в групповом чате
    /// </summary>
    Task ModerateMessageAsync(Guid chatId, ModerateMessageRequest request, Guid currentUserId);

    /// <summary>
    /// Получить участников чата
    /// </summary>
    /// <param name="chatId">ID чата</param>
    /// <returns>Список участников</returns>
    Task<List<ParticipantDto>> GetParticipantsAsync(Guid chatId);
} 