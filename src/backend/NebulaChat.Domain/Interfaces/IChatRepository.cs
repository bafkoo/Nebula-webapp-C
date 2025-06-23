using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using NebulaChat.Domain.Entities;
using NebulaChat.Domain.Entities.Enums;

namespace NebulaChat.Domain.Interfaces
{
    /// <summary>
    /// Интерфейс репозитория для работы с чатами
    /// </summary>
    public interface IChatRepository
    {
        /// <summary>
        /// Получить чат по идентификатору
        /// </summary>
        Task<Chat?> GetByIdAsync(Guid chatId);

        /// <summary>
        /// Получить список чатов пользователя с пагинацией и опциональным фильтром по типу
        /// </summary>
        Task<IEnumerable<Chat>> GetUserChatsAsync(Guid userId, ChatType? chatType = null, int page = 1, int pageSize = 50);

        /// <summary>
        /// Создать новый чат
        /// </summary>
        Task AddAsync(Chat chat);

        /// <summary>
        /// Обновить информацию чата
        /// </summary>
        void Update(Chat chat);

        /// <summary>
        /// Удалить чат
        /// </summary>
        void Remove(Chat chat);
    }
} 