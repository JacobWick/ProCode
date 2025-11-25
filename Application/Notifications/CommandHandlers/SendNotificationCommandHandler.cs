using Application.Interfaces;
using Application.Notifications.Commands;
using MediatR;

namespace Application.Notifications.CommandHandlers;

public class SendNotificationCommandHandler : IRequestHandler<SendNotificationCommand, bool>
{
    private readonly INotificationService _notificationService;

    public SendNotificationCommandHandler(INotificationService notificationService)
    {
        _notificationService = notificationService;
    }
    public async Task<bool> Handle(SendNotificationCommand request, CancellationToken cancellationToken)
    {
        if (request.UserIds != null && request.UserIds.Any())
        {
            await _notificationService.NotifyMultipleUsersAsync(request.UserIds, request.Message, request.Type);
            return true;
        }
        if (request.UserId.HasValue && request.UserId != Guid.Empty)
        {
            await _notificationService.NotifyUserAsync(request.UserId.Value, request.Message, request.Type);
            return true;
        }
        return false;

    }
}