using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using NebulaChat.Domain.Entities;

namespace NebulaChat.Domain.Interfaces
{
    /// <summary>
    /// Интерфейс репозитория для работы с сообщениями
    /// </summary>
    public interface IMessageRepository
    {
        /// <summary>
        /// Получить сообщение по идентификатору
        /// </summary>
        Task<Message?> GetByIdAsync(Guid messageId);

        /// <summary>
        /// Получить сообщения чата с пагинацией
        /// </summary>
        Task<IEnumerable<Message>> GetMessagesByChatAsync(Guid chatId, int page = 1, int pageSize = 50);

        /// <summary>
        /// Добавить новое сообщение
        /// </summary>
        Task AddAsync(Message message);

        /// <summary>
        /// Обновить сообщение
        /// </summary>
        void Update(Message message);

        /// <summary>
        /// Удалить сообщение
        /// </summary>
        void Remove(Message message);
    }
} 