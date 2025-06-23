using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using NebulaChat.Domain.Entities;

namespace NebulaChat.Domain.Interfaces
{
    /// <summary>
    /// Интерфейс репозитория для работы с приглашениями в чат
    /// </summary>
    public interface IChatInviteRepository
    {
        /// <summary>
        /// Получить приглашение по идентификатору
        /// </summary>
        Task<ChatInvite?> GetByIdAsync(Guid inviteId);

        /// <summary>
        /// Получить все приглашения указанного пользователя
        /// </summary>
        Task<IEnumerable<ChatInvite>> GetInvitesForUserAsync(Guid userId);

        /// <summary>
        /// Добавить новое приглашение
        /// </summary>
        Task AddAsync(ChatInvite invite);

        /// <summary>
        /// Удалить приглашение
        /// </summary>
        void Remove(ChatInvite invite);
    }
} 