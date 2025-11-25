using Application.DTOs;
using Domain.Entities;

namespace Application.Mappers;

public class NotificationMapper
{
    public static NotificationDto MapToDto(Notification notification)
    {
        return new NotificationDto
        {
            Id = notification.Id,
            UserId = notification.User.Id,
            Message = notification.Message,
            Type = notification.Type,
            IsRead = notification.IsRead,
            Date =  notification.CreatedAt,
        };
    }

    public static List<NotificationDto> MapListToDto(ICollection<Notification> notifications)
    {
        return notifications.Select(MapToDto).ToList();
    }
    public static List<NotificationDto> MapListToDto(IOrderedEnumerable<Notification> notifications)
    {
        return notifications.Select(MapToDto).ToList();
    }
    
}