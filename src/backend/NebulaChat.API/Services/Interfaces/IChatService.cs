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
} 