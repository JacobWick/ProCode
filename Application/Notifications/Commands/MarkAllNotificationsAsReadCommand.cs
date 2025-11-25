using MediatR;

namespace Application.Notifications.Commands;

public class MarkAllNotificationsAsReadCommand: IRequest<bool>
{
    public Guid UserId { get; set; }
}