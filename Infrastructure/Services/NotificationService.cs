using Application.Interfaces;
using Application.Notifications.Commands;
using Domain.Enums;
using MediatR;

namespace Infrastructure.Services;

public class NotificationService : INotificationService
{
    private readonly IMediator _mediator;
    
    public NotificationService(IMediator mediator)
    {
        _mediator = mediator;
    }

    public async Task NotifyUserAsync(Guid userId, string message, NotificationType notificationType)
    {
        var command = new CreateNotificationCommand
        {
            UserId = userId,
            Message = message,
            Type = notificationType
        };
        await _mediator.Send(command);
    }

    public async Task NotifyMultipleUsersAsync(IEnumerable<Guid> userIds, string message,
        NotificationType notificationType)
    {
        var ids = userIds.Where(i => i != Guid.Empty).Distinct().ToList();
        foreach (var id in ids)
        {
            await NotifyUserAsync(id, message, notificationType);
        }
    }
}