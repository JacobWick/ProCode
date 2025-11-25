using Application.Interfaces;
using Application.Notifications.Commands;
using Domain.Entities;
using MediatR;

namespace Application.Notifications.CommandHandlers;

public class MarkNotificationAsReadCommandHandler : IRequestHandler<MarkNotificationAsReadCommand, bool>
{
    private readonly IRepository<Notification> _notificationRepository;
    
    public MarkNotificationAsReadCommandHandler(IRepository<Notification> notificationRepository)
    {
        _notificationRepository = notificationRepository;
    }

    public async Task<bool> Handle(MarkNotificationAsReadCommand request, CancellationToken cancellationToken)
    {
        var notification = await _notificationRepository.GetByIdAsync(request.Id, cancellationToken: cancellationToken);
        if (notification == null)
        {
            return false;
        }

        notification.IsRead = true;
        await _notificationRepository.UpdateAsync(notification);
        return true;
    }
}