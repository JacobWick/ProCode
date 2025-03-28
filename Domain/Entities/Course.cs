using Domain.Enums;
using Domain.Interfaces;

namespace Domain.Entities;

public class Course : IEntity
{
    public Guid Id { get; set; }

    public ICollection<Progress> Progresses { get; set; } = new List<Progress>();

    public ICollection<Lesson> Lessons { get; set; } = new List<Lesson>();
    
    public User User { get; set; } = null!;

    public string? Title { get; set; }
    public string? Description { get; set; }
    public DateTime CreatedAt { get; set; }
    public DifficultyLevel DifficultyLevel { get; set; }
    public int Rating { get; set; }
}