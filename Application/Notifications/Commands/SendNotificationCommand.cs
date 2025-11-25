using Domain.Enums;
using MediatR;

namespace Application.Notifications.Commands;

public class SendNotificationCommand : IRequest<bool>
{
    public Guid? UserId { get; set; }
    public List<Guid>? UserIds { get; set; }
    public string Message { get; set; }
    public NotificationType Type { get; set; }
}