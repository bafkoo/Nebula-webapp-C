using System.Threading.Tasks;

namespace NebulaChat.Domain.Interfaces
{
    /// <summary>
    /// Интерфейс Unit of Work для управления репозиториями и сохранения изменений
    /// </summary>
    public interface IUnitOfWork
    {
        /// <summary>
        /// Репозиторий чатов
        /// </summary>
        IChatRepository ChatRepository { get; }

        /// <summary>
        /// Репозиторий сообщений
        /// </summary>
        IMessageRepository MessageRepository { get; }

        /// <summary>
        /// Репозиторий приглашений в чат
        /// </summary>
        IChatInviteRepository ChatInviteRepository { get; }

        /// <summary>
        /// Лог административных действий
        /// </summary>
        IAdminActionLogRepository AdminActionLogRepository { get; }

        /// <summary>
        /// Сохраняет все изменения в источнике данных
        /// </summary>
        Task<int> SaveChangesAsync();
    }
} 