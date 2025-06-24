namespace NebulaChat.API.DTOs.Chat;

/// <summary>
/// Ответ для поиска сообщений
/// </summary>
public class SearchMessagesResponse
{
    /// <summary>
    /// Список найденных сообщений
    /// </summary>
    public IEnumerable<SearchMessageResultDto> Messages { get; set; } = new List<SearchMessageResultDto>();
    
    /// <summary>
    /// Общее количество найденных сообщений
    /// </summary>
    public int TotalCount { get; set; }
    
    /// <summary>
    /// Текущая страница
    /// </summary>
    public int Page { get; set; }
    
    /// <summary>
    /// Размер страницы
    /// </summary>
    public int PageSize { get; set; }
    
    /// <summary>
    /// Общее количество страниц
    /// </summary>
    public int TotalPages { get; set; }
}

/// <summary>
/// DTO для результата поиска сообщения
/// </summary>
public class SearchMessageResultDto : MessageDto
{
    /// <summary>
    /// Имя чата, в котором найдено сообщение
    /// </summary>
    public string ChatName { get; set; } = string.Empty;
    
    /// <summary>
    /// Фрагменты текста с подсветкой найденного
    /// </summary>
    public IEnumerable<HighlightFragment> HighlightedContent { get; set; } = new List<HighlightFragment>();
}

/// <summary>
/// Фрагмент текста с подсветкой
/// </summary>
public class HighlightFragment
{
    /// <summary>
    /// Текст фрагмента
    /// </summary>
    public string Text { get; set; } = string.Empty;
    
    /// <summary>
    /// Является ли фрагмент найденным (требует подсветки)
    /// </summary>
    public bool IsHighlighted { get; set; }
} 