namespace Domain.Entities;

public class Progress
{
    public Guid Id { get; set; }
    
    public User User { get; set; } = null!;
    
    public Course Course { get; set; } = null!;

    public ICollection<Lesson> Lessons { get; set; } = new List<Lesson>();

    public DateOnly LastAccessedAt { get; set; }
}