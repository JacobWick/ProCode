using MediatR;

namespace Application.Notifications.Queries;

public class GetUnreadNotificationsCountQuery: IRequest<int>
{
    public Guid UserId { get; set; }
}