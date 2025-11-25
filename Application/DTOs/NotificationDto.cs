using Domain.Enums;

namespace Application.DTOs;

public class NotificationDto
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string Message { get; set; }
    public NotificationType Type { get; set; }
    public DateTime Date { get; set; }
    public Boolean IsRead { get; set; }
}