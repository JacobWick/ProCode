using System.Linq.Expressions;
using Application.DTOs;
using Application.Interfaces;
using Application.Mappers;
using Application.Notifications.Queries;
using MediatR;
using Domain.Entities;

namespace Application.Notifications.QueryHandlers
{
    public class GetUserNotificationsQueryHandler : IRequestHandler<GetUserNotificationsQuery, List<NotificationDto>>
    {
        private readonly IRepository<Notification> _notificationRepository;

        public GetUserNotificationsQueryHandler(IRepository<Notification> notificationRepository)
        {
            _notificationRepository = notificationRepository;
        }

        public async Task<List<NotificationDto>> Handle(GetUserNotificationsQuery request, CancellationToken cancellationToken)
        {
            var notifications = await _notificationRepository.GetAllAsync(selector: null, includes: new Expression<Func<Notification, object>>[] {n => n.User}, cancellationToken: cancellationToken);
            var filteredNotifications = notifications.Where(n => n.User.Id == request.UserId);
            if (request.IsRead.HasValue)
                filteredNotifications = filteredNotifications.Where(n => n.IsRead == request.IsRead.Value);
            var ordered = filteredNotifications.OrderByDescending(n => n.CreatedAt);
            
            return NotificationMapper.MapListToDto(ordered);
        }
    }
}