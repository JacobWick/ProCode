using System.ComponentModel.DataAnnotations;
using Domain.Interfaces;

namespace Domain.Entities;

public class Progress : IEntity
{
    [Key]
    public Guid Id { get; set; }

    public Guid UserId { get; set; }
    public User User { get; set; } = null!;

    public Guid LessonId { get; set; }
    public Lesson Lesson { get; set; } = null!;

    public DateOnly CompletedAt { get; set; }
}