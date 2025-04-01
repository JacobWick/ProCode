using System.ComponentModel.DataAnnotations;
using Domain.Enums;
using Domain.Interfaces;

namespace Domain.Entities
{
    public class Notification : IEntity
    {
        [Key]
        public Guid Id { get; set; }
        
        public User User { get; set; } = null!;

        [Required]
        public string? MessageText { get; set; }
        public NotificationType Type { get; set; }
        public DateTime CreatedAt { get; set; }
        public Boolean IsRead { get; set; } 

    }
}
