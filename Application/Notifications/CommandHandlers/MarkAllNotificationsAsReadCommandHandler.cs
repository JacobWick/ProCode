using System.Linq.Expressions;
using Application.Interfaces;
using Application.Notifications.Commands;
using Domain.Entities;
using MediatR;

namespace Application.Notifications.CommandHandlers;

public class MarkAllNotificationsAsReadCommandHandler : IRequestHandler<MarkAllNotificationsAsReadCommand, bool>
{
    private readonly IRepository<Notification> _notificationRepository;
    
    public MarkAllNotificationsAsReadCommandHandler(IRepository<Notification> notificationRepository)
    {
        _notificationRepository = notificationRepository;
    }

    public async Task<bool> Handle(MarkAllNotificationsAsReadCommand request, CancellationToken cancellationToken)
    {
        var notifications = await _notificationRepository.GetAllAsync(
            includes: new Expression<Func<Notification, object>>[] { n => n.User},
            cancellationToken: cancellationToken);

        foreach (var notification in notifications)
        {
            if (notification.User.Id == request.UserId)
            {
                notification.IsRead = true;
                await _notificationRepository.UpdateAsync(notification, cancellationToken);
            }
        }
        return true;
    }
}