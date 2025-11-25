using Application.DTOs;
using Domain.Enums;
using MediatR;

namespace Application.Notifications.Commands;

public class CreateNotificationCommand : IRequest<NotificationDto>
{
    public Guid UserId { get; set; }
    public string Message { get; set; }
    public NotificationType Type { get; set; }
}