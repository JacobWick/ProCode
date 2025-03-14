namespace Domain.Entities;

public class Lesson
{
    public Guid Id { get; set; }
    public string? Title { get; set; }
    public Uri? VideoUri { get; set; }
    public Uri? TextUri { get; set; }
    public DateTime CreatedAt { get; set; }
    public Exercise Exercise { get; set; }
}