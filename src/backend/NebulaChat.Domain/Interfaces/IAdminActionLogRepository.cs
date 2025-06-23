using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using NebulaChat.Domain.Entities;

namespace NebulaChat.Domain.Interfaces
{
    /// <summary>
    /// Интерфейс репозитория для логов административных действий
    /// </summary>
    public interface IAdminActionLogRepository
    {
        /// <summary>
        /// Добавить запись лога
        /// </summary>
        Task AddAsync(AdminActionLog log);

        /// <summary>
        /// Получить логи по ID чата
        /// </summary>
        Task<IEnumerable<AdminActionLog>> GetLogsByChatAsync(Guid chatId);
    }
} 