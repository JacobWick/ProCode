using Application.DTOs;
using Application.Interfaces;
using Application.Mappers;
using Application.Notifications.Commands;
using Domain.Entities;
using MediatR;

namespace Application.Notifications.CommandHandlers;

public class CreateNotificationCommandHandler : IRequestHandler<CreateNotificationCommand, NotificationDto>
{
    private readonly IRepository<Notification> _notificationRepository;
    private readonly IRepository<User> _userRepository;

    public CreateNotificationCommandHandler(IRepository<Notification> notificationRepository, IRepository<User> userRepository)
    {
        _notificationRepository = notificationRepository;
        _userRepository = userRepository;
    }

    public async Task<NotificationDto> Handle(CreateNotificationCommand request, CancellationToken cancellationToken)
    {
        if (request.UserId != Guid.Empty)
        {
            var user = await _userRepository.GetByIdAsync(request.UserId, cancellationToken: cancellationToken);
            if (user == null)
            {
                throw new Exception("User not found");
            }
            var notification = new Notification
            {
                Id = Guid.NewGuid(),
                User = user,
                Message = request.Message,
                Type = request.Type,
                CreatedAt = DateTime.UtcNow,
                IsRead = false,
            };

            await _notificationRepository.CreateAsync(notification, cancellationToken);
            return NotificationMapper.MapToDto(notification);
        }

        return null;
    }
}