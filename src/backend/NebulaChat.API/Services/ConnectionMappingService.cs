using System.Collections.Concurrent;

namespace NebulaChat.API.Services;

/// <summary>
/// Thread-safe реализация маппинга пользователей к SignalR соединениям
/// </summary>
public class ConnectionMappingService : IConnectionMapping
{
    // Маппинг: UserId -> HashSet<ConnectionId>
    private readonly ConcurrentDictionary<string, HashSet<string>> _connections = new();
    
    // Обратный маппинг: ConnectionId -> UserId (для быстрого поиска)
    private readonly ConcurrentDictionary<string, string> _connectionToUser = new();
    
    private readonly object _lock = new();

    /// <summary>
    /// Добавить соединение для пользователя
    /// </summary>
    public void Add(string userId, string connectionId)
    {
        if (string.IsNullOrEmpty(userId) || string.IsNullOrEmpty(connectionId))
            return;

        lock (_lock)
        {
            // Добавить в основной маппинг
            if (!_connections.TryGetValue(userId, out var connections))
            {
                connections = new HashSet<string>();
                _connections[userId] = connections;
            }
            
            connections.Add(connectionId);
            
            // Добавить в обратный маппинг
            _connectionToUser[connectionId] = userId;
        }
    }

    /// <summary>
    /// Удалить соединение для пользователя
    /// </summary>
    public void Remove(string userId, string connectionId)
    {
        if (string.IsNullOrEmpty(userId) || string.IsNullOrEmpty(connectionId))
            return;

        lock (_lock)
        {
            // Удалить из основного маппинга
            if (_connections.TryGetValue(userId, out var connections))
            {
                connections.Remove(connectionId);
                
                // Если у пользователя больше нет соединений, удалить запись
                if (connections.Count == 0)
                {
                    _connections.TryRemove(userId, out _);
                }
            }
            
            // Удалить из обратного маппинга
            _connectionToUser.TryRemove(connectionId, out _);
        }
    }

    /// <summary>
    /// Получить все соединения пользователя
    /// </summary>
    public IEnumerable<string> GetConnections(string userId)
    {
        if (string.IsNullOrEmpty(userId))
            return Enumerable.Empty<string>();

        lock (_lock)
        {
            return _connections.TryGetValue(userId, out var connections) 
                ? connections.ToList() 
                : Enumerable.Empty<string>();
        }
    }

    /// <summary>
    /// Проверить есть ли активные соединения у пользователя
    /// </summary>
    public bool HasConnections(string userId)
    {
        if (string.IsNullOrEmpty(userId))
            return false;

        lock (_lock)
        {
            return _connections.TryGetValue(userId, out var connections) && connections.Count > 0;
        }
    }

    /// <summary>
    /// Получить всех онлайн пользователей
    /// </summary>
    public IEnumerable<string> GetOnlineUsers()
    {
        lock (_lock)
        {
            return _connections.Keys.ToList();
        }
    }

    /// <summary>
    /// Получить количество активных соединений
    /// </summary>
    public int GetConnectionCount()
    {
        lock (_lock)
        {
            return _connectionToUser.Count;
        }
    }

    /// <summary>
    /// Получить ID пользователя по ID соединения
    /// </summary>
    /// <param name="connectionId">ID соединения</param>
    /// <returns>ID пользователя или null</returns>
    public string? GetUserByConnection(string connectionId)
    {
        if (string.IsNullOrEmpty(connectionId))
            return null;

        lock (_lock)
        {
            return _connectionToUser.TryGetValue(connectionId, out var userId) ? userId : null;
        }
    }

    /// <summary>
    /// Очистить все соединения (для тестирования)
    /// </summary>
    public void Clear()
    {
        lock (_lock)
        {
            _connections.Clear();
            _connectionToUser.Clear();
        }
    }

    /// <summary>
    /// Получить статистику соединений
    /// </summary>
    /// <returns>Статистика</returns>
    public ConnectionStats GetStats()
    {
        lock (_lock)
        {
            return new ConnectionStats
            {
                OnlineUsers = _connections.Count,
                TotalConnections = _connectionToUser.Count,
                AverageConnectionsPerUser = _connections.Count > 0 
                    ? (double)_connectionToUser.Count / _connections.Count 
                    : 0
            };
        }
    }
}

/// <summary>
/// Статистика соединений
/// </summary>
public class ConnectionStats
{
    /// <summary>
    /// Количество онлайн пользователей
    /// </summary>
    public int OnlineUsers { get; set; }
    
    /// <summary>
    /// Общее количество соединений
    /// </summary>
    public int TotalConnections { get; set; }
    
    /// <summary>
    /// Среднее количество соединений на пользователя
    /// </summary>
    public double AverageConnectionsPerUser { get; set; }
}