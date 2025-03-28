using Domain.Interfaces;

namespace Domain.Entities;

public class Lesson  : IEntity
{
    public Guid Id { get; set; }
    
    public Progress? Progress { get; set; }
    
    public Course Course { get; set; } = null!;

    public ICollection<Exercise> Exercises { get; set; } = new List<Exercise>();
    public ICollection<ValidationMethod> ValidationMethods { get; set; } = new List<ValidationMethod>();

    public string? Title { get; set; }
    public Uri? VideoUri { get; set; }
    public Uri? TextUri { get; set; }
    public DateTime CreatedAt { get; set; }
}