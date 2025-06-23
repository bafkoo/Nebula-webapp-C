namespace NebulaChat.API.Services;

/// <summary>
/// Сервис для отслеживания активных SignalR соединений пользователей
/// </summary>
public interface IConnectionMapping
{
    /// <summary>
    /// Добавить соединение для пользователя
    /// </summary>
    /// <param name="userId">ID пользователя</param>
    /// <param name="connectionId">ID соединения</param>
    void Add(string userId, string connectionId);

    /// <summary>
    /// Удалить соединение для пользователя
    /// </summary>
    /// <param name="userId">ID пользователя</param>
    /// <param name="connectionId">ID соединения</param>
    void Remove(string userId, string connectionId);

    /// <summary>
    /// Получить все соединения пользователя
    /// </summary>
    /// <param name="userId">ID пользователя</param>
    /// <returns>Список ID соединений</returns>
    IEnumerable<string> GetConnections(string userId);

    /// <summary>
    /// Проверить есть ли активные соединения у пользователя
    /// </summary>
    /// <param name="userId">ID пользователя</param>
    /// <returns>True если есть активные соединения</returns>
    bool HasConnections(string userId);

    /// <summary>
    /// Получить всех онлайн пользователей
    /// </summary>
    /// <returns>Список ID пользователей</returns>
    IEnumerable<string> GetOnlineUsers();

    /// <summary>
    /// Получить количество активных соединений
    /// </summary>
    /// <returns>Количество соединений</returns>
    int GetConnectionCount();
} 