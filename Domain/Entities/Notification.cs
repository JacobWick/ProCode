using System.ComponentModel.DataAnnotations;
using Domain.Enums;

namespace Domain.Entities
{
    public class Notification
    {
        public int Id { get; set; }

        public Guid UserId { get; set; }
        public User User { get; set; } = null!;

        [Required]
        public string? MessageText { get; set; }
        public NotificationType Type { get; set; }
        public DateTime CreatedAt { get; set; }
        public Boolean IsRead { get; set; } 

    }
}
