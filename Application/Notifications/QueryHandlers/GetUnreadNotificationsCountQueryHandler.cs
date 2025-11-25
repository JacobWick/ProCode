using Application.Interfaces;
using Application.Notifications.Queries;
using Domain.Entities;
using MediatR;

namespace Application.Notifications.QueryHandlers;

public class GetUnreadNotificationsCountQueryHandler : IRequestHandler<GetUnreadNotificationsCountQuery, int>
{
    private readonly IRepository<Notification> _notificationRepository;
    public GetUnreadNotificationsCountQueryHandler(IRepository<Notification> notificationRepository)
    {
        _notificationRepository = notificationRepository;
    }

    public async Task<int> Handle(GetUnreadNotificationsCountQuery request, CancellationToken cancellationToken)
    {
        return await _notificationRepository.CountAsync(n => n.User != null && n.User.Id == request.UserId && !n.IsRead, cancellationToken);
    }
    
}