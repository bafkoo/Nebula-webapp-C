using System.ComponentModel.DataAnnotations;
using NebulaChat.Domain.Entities.Enums;

namespace NebulaChat.API.DTOs.Chat;

/// <summary>
/// Запрос для поиска сообщений
/// </summary>
public class SearchMessagesRequest
{
    /// <summary>
    /// Поисковый запрос
    /// </summary>
    [Required]
    [MinLength(1)]
    [MaxLength(500)]
    public string Query { get; set; } = string.Empty;
    
    /// <summary>
    /// ID чата для поиска внутри конкретного чата (опционально)
    /// </summary>
    public Guid? ChatId { get; set; }
    
    /// <summary>
    /// ID автора для фильтрации по автору (опционально)
    /// </summary>
    public Guid? AuthorId { get; set; }
    
    /// <summary>
    /// Тип сообщения для фильтрации (опционально)
    /// </summary>
    public MessageType? MessageType { get; set; }
    
    /// <summary>
    /// Дата начала поиска (опционально)
    /// </summary>
    public DateTime? StartDate { get; set; }
    
    /// <summary>
    /// Дата окончания поиска (опционально)
    /// </summary>
    public DateTime? EndDate { get; set; }
    
    /// <summary>
    /// Номер страницы (по умолчанию 1)
    /// </summary>
    [Range(1, int.MaxValue)]
    public int Page { get; set; } = 1;
    
    /// <summary>
    /// Размер страницы (по умолчанию 20)
    /// </summary>
    [Range(1, 100)]
    public int PageSize { get; set; } = 20;
} 