using MediatR;

namespace Application.Notifications.Commands;

public class MarkNotificationAsReadCommand : IRequest<bool>
{
    public Guid Id { get; set; }
}