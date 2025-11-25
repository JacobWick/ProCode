using Domain.Enums;

namespace Application.Interfaces;

public interface INotificationService
{
    Task NotifyUserAsync(Guid userId, string message,  NotificationType notificationType);
    Task NotifyMultipleUsersAsync(IEnumerable<Guid> userIds, string message, NotificationType notificationType);
}