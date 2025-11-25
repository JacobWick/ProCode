using Application.DTOs;
using MediatR;

namespace Application.Notifications.Queries;

public class GetUserNotificationsQuery : IRequest<List<NotificationDto>>
{
    public Guid UserId { get; set; }
    public Boolean? IsRead { get; set; }
}